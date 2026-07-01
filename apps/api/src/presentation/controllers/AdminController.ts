import type { Request, Response, NextFunction } from "express";
import type { GetAdminStatsUseCase } from "../../application/use-cases/admin/GetAdminStatsUseCase";
import { SCORE_MAX, type PrismaWibgRepository, type WibgApplicationStatus, type ScoreInput } from "../../infrastructure/repositories/PrismaWibgRepository";
import type { UpdateApplicationStatusUseCase } from "../../application/use-cases/wibg/UpdateApplicationStatusUseCase";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import type { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import type { CreateProviderUseCase } from "../../application/use-cases/services/CreateProviderUseCase";
import type { AssignProviderUseCase } from "../../application/use-cases/services/AssignProviderUseCase";
import type { CancelServiceRequestUseCase } from "../../application/use-cases/services/CancelServiceRequestUseCase";
import { sendVideoReminderEmail } from "../../infrastructure/services/BrevoEmailService";
import { PrismaActivityLogRepository, type ActivityLogFilters } from "../../infrastructure/repositories/PrismaActivityLogRepository";

const activityLogRepo = new PrismaActivityLogRepository();

const VALID_STATUSES: WibgApplicationStatus[] = [
  "SUBMITTED", "UNDER_REVIEW", "TOP_20", "TOP_6",
  "WINNER_1ST", "WINNER_2ND", "WINNER_3RD", "REJECTED",
];

export class AdminController {
  constructor(
    private readonly statsUseCase: GetAdminStatsUseCase,
    private readonly wibgRepo: PrismaWibgRepository,
    private readonly updateStatusUseCase: UpdateApplicationStatusUseCase,
    private readonly userRepo: IUserRepository,
    private readonly providerRepo: IProviderRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository,
    private readonly createProviderUseCase: CreateProviderUseCase,
    private readonly assignProviderUseCase: AssignProviderUseCase,
    private readonly cancelServiceRequestUseCase: CancelServiceRequestUseCase,
  ) {}

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.statsUseCase.execute();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  };

  getApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search, page, limit } = req.query as Record<string, string>;
      const result = await this.wibgRepo.findApplications({
        status: status as WibgApplicationStatus | undefined,
        search,
        page:  page  ? parseInt(page,  10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  getApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const app = await this.wibgRepo.findApplicationById(req.params.id as string);
      if (!app) { res.status(404).json({ success: false, message: "Not found" }); return; }
      res.json({ success: true, data: app });
    } catch (err) { next(err); }
  };

  updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, adminNotes } = req.body as { status: WibgApplicationStatus; adminNotes?: string };
      if (!VALID_STATUSES.includes(status)) {
        res.status(400).json({ success: false, message: "Invalid status" }); return;
      }
      const updated = await this.updateStatusUseCase.execute(req.params.id as string, status, adminNotes);
      res.json({ success: true, data: updated });
    } catch (err) { next(err); }
  };

  sendVideoReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const app = await this.wibgRepo.findApplicationById(req.params.id as string);
      if (!app) { res.status(404).json({ success: false, message: "Not found" }); return; }
      await sendVideoReminderEmail(app.founderEmail, app.founderName, app.businessName);
      res.json({ success: true, message: "Video reminder email sent to " + app.founderEmail });
    } catch (err) { next(err); }
  };

  toggleVideoTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tagged } = req.body as { tagged: boolean };
      if (typeof tagged !== "boolean") {
        res.status(400).json({ success: false, message: "tagged must be a boolean" }); return;
      }
      const updated = await this.wibgRepo.updateVideoTagged(req.params.id as string, tagged);
      res.json({ success: true, data: updated });
    } catch (err) { next(err); }
  };

  // ── WIBG judging ────────────────────────────────────────────

  submitScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const app = await this.wibgRepo.findApplicationById(req.params.id as string);
      if (!app) { res.status(404).json({ success: false, message: "Application not found" }); return; }
      if (app.status.startsWith("WINNER_")) {
        res.status(409).json({ success: false, message: "Scoring is locked — this application has already been awarded a placement." });
        return;
      }

      const body = req.body as ScoreInput;
      const fields: (keyof typeof SCORE_MAX)[] = ["innovation", "marketViability", "teamExecution", "financialClarity", "pitchDelivery"];
      for (const f of fields) {
        const v = body[f];
        if (typeof v !== "number" || v < 0 || v > SCORE_MAX[f]) {
          res.status(400).json({ success: false, message: `${f} must be between 0 and ${SCORE_MAX[f]}` });
          return;
        }
      }

      const score = await this.wibgRepo.upsertScore(req.params.id as string, req.user!.sub, {
        innovation: body.innovation,
        marketViability: body.marketViability,
        teamExecution: body.teamExecution,
        financialClarity: body.financialClarity,
        pitchDelivery: body.pitchDelivery,
        notes: body.notes,
      });
      res.json({ success: true, data: score });
    } catch (err) { next(err); }
  };

  getApplicationScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scores = await this.wibgRepo.findScoresByApplicationId(req.params.id as string);
      res.json({ success: true, data: summarizeScores(scores) });
    } catch (err) { next(err); }
  };

  getScoreboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query as { status?: WibgApplicationStatus };
      const { applications } = await this.wibgRepo.findApplications({ status, limit: 200 });
      const ids = applications.map((a) => a.id);
      const allScores = await this.wibgRepo.findScoresByApplicationIds(ids);

      const board = applications
        .map((app) => {
          const appScores = allScores.filter((s) => s.applicationId === app.id);
          const summary = summarizeScores(appScores);
          const myScore = appScores.find((s) => s.judgeId === req.user!.sub) ?? null;
          return {
            id: app.id,
            businessName: app.businessName,
            founderName: app.founderName,
            status: app.status,
            judgeCount: summary.judgeCount,
            average: summary.average,
            myScore: myScore ? {
              innovation: myScore.innovation, marketViability: myScore.marketViability,
              teamExecution: myScore.teamExecution, financialClarity: myScore.financialClarity,
              pitchDelivery: myScore.pitchDelivery,
              total: myScore.innovation + myScore.marketViability + myScore.teamExecution + myScore.financialClarity + myScore.pitchDelivery,
            } : null,
          };
        })
        .sort((a, b) => b.average.total - a.average.total);

      res.json({ success: true, data: board });
    } catch (err) { next(err); }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, search, page, pageSize } = req.query as Record<string, string>;
      const pg   = page     ? parseInt(page,     10) : 1;
      const size = pageSize ? parseInt(pageSize, 10) : 20;
      const [users, total] = await Promise.all([
        this.userRepo.findAll({ role: role as never, search, page: pg, pageSize: size }),
        this.userRepo.count({ role: role as never, search }),
      ]);
      res.json({ success: true, data: { users: users.map((u) => u.toPublicProfile()), total, page: pg, pages: Math.ceil(total / size) } });
    } catch (err) { next(err); }
  };

  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body as { status: "ACTIVE" | "SUSPENDED" };
      if (!["ACTIVE", "SUSPENDED"].includes(status)) {
        res.status(400).json({ success: false, message: "Invalid status" }); return;
      }
      const user = await this.userRepo.update(req.params.id as string, { status });
      res.json({ success: true, data: user.toPublicProfile() });
    } catch (err) { next(err); }
  };

  // ── Service marketplace (admin-mediated) ──────────────────────

  getProviders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const providers = await this.providerRepo.findAll();
      res.json({ success: true, data: providers });
    } catch (err) { next(err); }
  };

  createProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessName, contactEmail, contactPhone, serviceTags, firstName, lastName } = req.body as {
        businessName: string; contactEmail: string; contactPhone: string; serviceTags: string[]; firstName: string; lastName: string;
      };
      if (!businessName || !contactEmail || !contactPhone || !firstName || !lastName) {
        res.status(400).json({ success: false, message: "Missing required fields" }); return;
      }
      const result = await this.createProviderUseCase.execute({
        businessName, contactEmail, contactPhone, serviceTags: serviceTags ?? [], firstName, lastName,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  getPendingServiceRequests = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await this.serviceRequestRepo.findPendingWithDetails();
      res.json({ success: true, data: requests });
    } catch (err) { next(err); }
  };

  getAssignedServiceRequests = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await this.serviceRequestRepo.findByStatusWithDetails("ASSIGNED");
      res.json({ success: true, data: requests });
    } catch (err) { next(err); }
  };

  getMandateSentRequests = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await this.serviceRequestRepo.findByStatusWithDetails("MANDATE_SENT");
      res.json({ success: true, data: requests });
    } catch (err) { next(err); }
  };

  assignServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { providerId, priceAgreed, adminNotes } = req.body as { providerId: string; priceAgreed?: string; adminNotes?: string };
      if (!providerId) {
        res.status(400).json({ success: false, message: "providerId is required" }); return;
      }
      await this.assignProviderUseCase.execute(req.params.id as string, providerId, priceAgreed ?? null, adminNotes ?? null);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  cancelServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { adminNotes } = req.body as { adminNotes?: string };
      await this.cancelServiceRequestUseCase.execute(req.params.id as string, adminNotes ?? null);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  // ── Super Admin — Team Management ───────────────────────────────────────

  /** List all admin accounts (regular + super) */
  listAdmins = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await this.userRepo.findAll({ role: "ADMIN" });
      res.json({ success: true, data: admins.map((a) => a.toPublicProfile()) });
    } catch (err) { next(err); }
  };

  /** Create a new admin account */
  createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, firstName, lastName, phone, password } = req.body as {
        email: string; firstName: string; lastName: string; phone?: string; password: string;
      };
      if (!email || !firstName || !lastName || !password) {
        res.status(400).json({ success: false, message: "email, firstName, lastName and password are required" });
        return;
      }
      const existing = await this.userRepo.findByEmail(email.toLowerCase());
      if (existing) { res.status(409).json({ success: false, message: "An account with this email already exists" }); return; }

      // Hash password — import bcryptjs inline to avoid circular deps
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash(password, 12);

      const admin = await this.userRepo.create({
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "ADMIN",
        phone,
      });
      res.status(201).json({ success: true, data: admin.toPublicProfile() });
    } catch (err) { next(err); }
  };

  /** Toggle isSuperAdmin for an admin account */
  toggleSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isSuperAdmin } = req.body as { isSuperAdmin: boolean };
      if (typeof isSuperAdmin !== "boolean") {
        res.status(400).json({ success: false, message: "isSuperAdmin must be a boolean" }); return;
      }
      // Prevent self-demotion
      if (req.params.id === req.user!.sub && !isSuperAdmin) {
        res.status(400).json({ success: false, message: "You cannot remove your own super admin rights" }); return;
      }
      const user = await this.userRepo.setSuperAdmin(req.params.id as string, isSuperAdmin);
      res.json({ success: true, data: user.toPublicProfile() });
    } catch (err) { next(err); }
  };

  // ── Super Admin — Activity Log ───────────────────────────────────────────

  getActivityLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { actorId, entityType, entityId, from, to, page, pageSize } = req.query as Record<string, string>;
      const filters: ActivityLogFilters = {
        actorId, entityType, entityId,
        from:  from  ? new Date(from)  : undefined,
        to:    to    ? new Date(to)    : undefined,
        page:  page     ? parseInt(page, 10)     : 1,
        pageSize: pageSize ? parseInt(pageSize, 10) : 40,
      };
      const result = await activityLogRepo.findAll(filters);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  getActivityStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await activityLogRepo.statsByActor();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  };
}

interface ScoreRow {
  judgeId: string;
  judge: { firstName: string; lastName: string };
  innovation: number; marketViability: number; teamExecution: number; financialClarity: number; pitchDelivery: number;
  notes: string | null;
}

function summarizeScores(scores: ScoreRow[]) {
  const total = (s: ScoreRow) => s.innovation + s.marketViability + s.teamExecution + s.financialClarity + s.pitchDelivery;
  const judgeCount = scores.length;

  const sum = (key: keyof typeof SCORE_MAX) => scores.reduce((acc, s) => acc + s[key], 0);
  const avg = (key: keyof typeof SCORE_MAX) => judgeCount ? Math.round((sum(key) / judgeCount) * 10) / 10 : 0;

  return {
    judgeCount,
    judges: scores.map((s) => ({
      judgeId: s.judgeId,
      judgeName: `${s.judge.firstName} ${s.judge.lastName}`,
      innovation: s.innovation, marketViability: s.marketViability, teamExecution: s.teamExecution,
      financialClarity: s.financialClarity, pitchDelivery: s.pitchDelivery,
      total: total(s),
      notes: s.notes,
    })),
    average: {
      innovation: avg("innovation"), marketViability: avg("marketViability"), teamExecution: avg("teamExecution"),
      financialClarity: avg("financialClarity"), pitchDelivery: avg("pitchDelivery"),
      total: judgeCount ? Math.round((scores.reduce((acc, s) => acc + total(s), 0) / judgeCount) * 10) / 10 : 0,
    },
  };
}
