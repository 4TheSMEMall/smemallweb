import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { prisma } from "./infrastructure/database/prisma.client";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaBhcResultRepository } from "./infrastructure/repositories/PrismaBhcResultRepository";
import { PrismaBhcGapRepository } from "./infrastructure/repositories/PrismaBhcGapRepository";
import { PrismaProviderRepository } from "./infrastructure/repositories/PrismaProviderRepository";
import { PrismaServiceRequestRepository } from "./infrastructure/repositories/PrismaServiceRequestRepository";
import { BcryptPasswordService } from "./infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./infrastructure/services/JwtTokenService";
import { PrismaWibgRepository } from "./infrastructure/repositories/PrismaWibgRepository";
import { SubmitApplicationUseCase } from "./application/use-cases/wibg/SubmitApplicationUseCase";
import { RegisterAttendeeUseCase } from "./application/use-cases/wibg/RegisterAttendeeUseCase";
import { WibgController } from "./presentation/controllers/WibgController";
import { RegisterUseCase } from "./application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "./application/use-cases/auth/LoginUseCase";
import { GetMeUseCase } from "./application/use-cases/auth/GetMeUseCase";
import { SaveBhcResultUseCase } from "./application/use-cases/bhc/SaveBhcResultUseCase";
import { GetBhcHistoryUseCase } from "./application/use-cases/bhc/GetBhcHistoryUseCase";
import { GetMyGapsUseCase } from "./application/use-cases/bhc/GetMyGapsUseCase";
import { RequestServiceUseCase } from "./application/use-cases/services/RequestServiceUseCase";
import { AssignProviderUseCase } from "./application/use-cases/services/AssignProviderUseCase";
import { UpdateJobStatusUseCase } from "./application/use-cases/services/UpdateJobStatusUseCase";
import { RateServiceUseCase } from "./application/use-cases/services/RateServiceUseCase";
import { CreateProviderUseCase } from "./application/use-cases/services/CreateProviderUseCase";
import { CancelServiceRequestUseCase } from "./application/use-cases/services/CancelServiceRequestUseCase";
import { PrismaMandateRepository } from "./infrastructure/repositories/PrismaMandateRepository";
import { CreateOrUpdateMandateUseCase } from "./application/use-cases/mandate/CreateOrUpdateMandateUseCase";
import { SendMandateUseCase } from "./application/use-cases/mandate/SendMandateUseCase";
import { RespondToMandateUseCase } from "./application/use-cases/mandate/RespondToMandateUseCase";
import { MandateController } from "./presentation/controllers/MandateController";
import { GenerateBhcLaunchTokenUseCase } from "./application/use-cases/bhc/GenerateBhcLaunchTokenUseCase";
import { AuthController } from "./presentation/controllers/AuthController";
import { WebhookController } from "./presentation/controllers/WebhookController";
import { BhcController } from "./presentation/controllers/BhcController";
import { ServiceController } from "./presentation/controllers/ServiceController";
import { ProviderController } from "./presentation/controllers/ProviderController";
import { createAuthRouter } from "./presentation/routes/auth.routes";
import { createWebhookRouter } from "./presentation/routes/webhook.routes";
import { createBhcRouter } from "./presentation/routes/bhc.routes";
import { createProviderRouter } from "./presentation/routes/provider.routes";
import { createWibgRouter } from "./presentation/routes/wibg.routes";
import { createAdminRouter } from "./presentation/routes/admin.routes";
import { createAuthMiddleware } from "./presentation/middleware/authenticate";
import { errorHandler } from "./presentation/middleware/errorHandler";
import { UpdateApplicationStatusUseCase } from "./application/use-cases/wibg/UpdateApplicationStatusUseCase";
import { GetAdminStatsUseCase } from "./application/use-cases/admin/GetAdminStatsUseCase";
import { AdminController } from "./presentation/controllers/AdminController";

export function createApp(): Express {
  // ── Infrastructure ───────────────────────────────────────────
  const userRepo       = new PrismaUserRepository(prisma);
  const bhcResultRepo  = new PrismaBhcResultRepository(prisma);
  const bhcGapRepo     = new PrismaBhcGapRepository(prisma);
  const providerRepo   = new PrismaProviderRepository(prisma);
  const serviceRequestRepo = new PrismaServiceRequestRepository(prisma);
  const mandateRepo        = new PrismaMandateRepository(prisma);
  const wibgRepo       = new PrismaWibgRepository(prisma);
  const passwordService = new BcryptPasswordService();
  const tokenService   = new JwtTokenService(
    process.env.JWT_SECRET  ?? "change-me-in-production",
    process.env.JWT_EXPIRES_IN ?? "7d"
  );

  // ── Use Cases ────────────────────────────────────────────────
  const registerUseCase    = new RegisterUseCase(userRepo, passwordService, tokenService);
  const loginUseCase       = new LoginUseCase(userRepo, passwordService, tokenService);
  const getMeUseCase       = new GetMeUseCase(userRepo);
  const saveBhcResultUseCase       = new SaveBhcResultUseCase(bhcResultRepo, userRepo, bhcGapRepo);
  const getBhcHistoryUseCase       = new GetBhcHistoryUseCase(bhcResultRepo);
  const getMyGapsUseCase           = new GetMyGapsUseCase(bhcGapRepo);
  const requestServiceUseCase      = new RequestServiceUseCase(bhcGapRepo, serviceRequestRepo);
  const assignProviderUseCase      = new AssignProviderUseCase(serviceRequestRepo, providerRepo);
  const updateJobStatusUseCase     = new UpdateJobStatusUseCase(serviceRequestRepo, bhcGapRepo);
  const rateServiceUseCase         = new RateServiceUseCase(serviceRequestRepo, bhcGapRepo, providerRepo);
  const createProviderUseCase      = new CreateProviderUseCase(userRepo, providerRepo, passwordService);
  const cancelServiceRequestUseCase = new CancelServiceRequestUseCase(serviceRequestRepo, bhcGapRepo);
  const createOrUpdateMandateUseCase = new CreateOrUpdateMandateUseCase(mandateRepo, serviceRequestRepo);
  const sendMandateUseCase           = new SendMandateUseCase(mandateRepo, serviceRequestRepo);
  const respondToMandateUseCase      = new RespondToMandateUseCase(mandateRepo, serviceRequestRepo);
  const generateBhcLaunchTokenUseCase = new GenerateBhcLaunchTokenUseCase(
    process.env.BHC_WEBHOOK_SECRET ?? "change-me"
  );
  const submitApplicationUseCase  = new SubmitApplicationUseCase(wibgRepo);
  const registerAttendeeUseCase   = new RegisterAttendeeUseCase(wibgRepo);
  const updateStatusUseCase       = new UpdateApplicationStatusUseCase(wibgRepo);
  const adminStatsUseCase         = new GetAdminStatsUseCase(prisma);

  // ── Controllers ──────────────────────────────────────────────
  const authController    = new AuthController(registerUseCase, loginUseCase, getMeUseCase);
  const webhookController = new WebhookController(
    saveBhcResultUseCase,
    process.env.BHC_WEBHOOK_SECRET ?? "change-me"
  );
  const wibgController = new WibgController(submitApplicationUseCase, registerAttendeeUseCase, wibgRepo);

  const bhcController = new BhcController(
    getBhcHistoryUseCase,
    generateBhcLaunchTokenUseCase,
    getMyGapsUseCase,
    process.env.BHC_API_URL ?? "https://bhcdemo-production.up.railway.app/api/v1"
  );

  const serviceController = new ServiceController(requestServiceUseCase, rateServiceUseCase, serviceRequestRepo);
  const mandateController = new MandateController(createOrUpdateMandateUseCase, sendMandateUseCase, respondToMandateUseCase, mandateRepo);

  const providerController = new ProviderController(updateJobStatusUseCase, providerRepo, serviceRequestRepo);

  const adminController = new AdminController(
    adminStatsUseCase,
    wibgRepo,
    updateStatusUseCase,
    userRepo,
    providerRepo,
    serviceRequestRepo,
    createProviderUseCase,
    assignProviderUseCase,
    cancelServiceRequestUseCase,
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
  app.use("/api/bhc",      createBhcRouter(bhcController, serviceController, mandateController, authenticate));
  app.use("/api/provider", createProviderRouter(providerController, tokenService));
  app.use("/api/wibg",     createWibgRouter(wibgController, authenticate));
  app.use("/api/admin",    createAdminRouter(adminController, mandateController, tokenService));

  app.use(errorHandler);
  return app;
}
