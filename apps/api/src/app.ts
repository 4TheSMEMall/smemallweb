import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { prisma } from "./infrastructure/database/prisma.client";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaBhcResultRepository } from "./infrastructure/repositories/PrismaBhcResultRepository";
import { BcryptPasswordService } from "./infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./infrastructure/services/JwtTokenService";
import { RegisterUseCase } from "./application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "./application/use-cases/auth/LoginUseCase";
import { GetMeUseCase } from "./application/use-cases/auth/GetMeUseCase";
import { SaveBhcResultUseCase } from "./application/use-cases/bhc/SaveBhcResultUseCase";
import { GetBhcHistoryUseCase } from "./application/use-cases/bhc/GetBhcHistoryUseCase";
import { GenerateBhcLaunchTokenUseCase } from "./application/use-cases/bhc/GenerateBhcLaunchTokenUseCase";
import { AuthController } from "./presentation/controllers/AuthController";
import { WebhookController } from "./presentation/controllers/WebhookController";
import { BhcController } from "./presentation/controllers/BhcController";
import { createAuthRouter } from "./presentation/routes/auth.routes";
import { createWebhookRouter } from "./presentation/routes/webhook.routes";
import { createBhcRouter } from "./presentation/routes/bhc.routes";
import { createAuthMiddleware } from "./presentation/middleware/authenticate";
import { errorHandler } from "./presentation/middleware/errorHandler";

export function createApp(): Express {
  // ── Infrastructure ───────────────────────────────────────────
  const userRepo       = new PrismaUserRepository(prisma);
  const bhcResultRepo  = new PrismaBhcResultRepository(prisma);
  const passwordService = new BcryptPasswordService();
  const tokenService   = new JwtTokenService(
    process.env.JWT_SECRET  ?? "change-me-in-production",
    process.env.JWT_EXPIRES_IN ?? "7d"
  );

  // ── Use Cases ────────────────────────────────────────────────
  const registerUseCase    = new RegisterUseCase(userRepo, passwordService, tokenService);
  const loginUseCase       = new LoginUseCase(userRepo, passwordService, tokenService);
  const getMeUseCase       = new GetMeUseCase(userRepo);
  const saveBhcResultUseCase       = new SaveBhcResultUseCase(bhcResultRepo, userRepo);
  const getBhcHistoryUseCase       = new GetBhcHistoryUseCase(bhcResultRepo);
  const generateBhcLaunchTokenUseCase = new GenerateBhcLaunchTokenUseCase(
    process.env.BHC_WEBHOOK_SECRET ?? "change-me"
  );

  // ── Controllers ──────────────────────────────────────────────
  const authController    = new AuthController(registerUseCase, loginUseCase, getMeUseCase);
  const webhookController = new WebhookController(
    saveBhcResultUseCase,
    process.env.BHC_WEBHOOK_SECRET ?? "change-me"
  );
  const bhcController = new BhcController(
    getBhcHistoryUseCase,
    generateBhcLaunchTokenUseCase,
    process.env.BHC_API_URL ?? "https://bhcdemo-production.up.railway.app/api/v1"
  );

  // ── Middleware ───────────────────────────────────────────────
  const authenticate = createAuthMiddleware(tokenService);

  // ── Express App ──────────────────────────────────────────────
  const app = express();

  app.use(helmet());
  // Support comma-separated origins: "https://thesmemall.netlify.app,http://localhost:3000"
  const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Webhooks MUST be registered before express.json() — the raw body
  // capture middleware reads the stream directly. express.json() would
  // consume it first and leave nothing for HMAC signature verification.
  app.use("/api/webhooks", createWebhookRouter(webhookController));

  // All other routes use JSON parsing
  app.use(express.json());

  // Brute-force protection — max 10 auth attempts per IP per 15 minutes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth",     authLimiter, createAuthRouter(authController, authenticate));
  app.use("/api/bhc",      createBhcRouter(bhcController, authenticate));

  app.use(errorHandler);
  return app;
}
