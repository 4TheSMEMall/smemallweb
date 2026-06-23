import type { Request, Response, NextFunction } from "express";
import type { GetAdminStatsUseCase } from "../../application/use-cases/admin/GetAdminStatsUseCase";
import type { PrismaWibgRepository, WibgApplicationStatus } from "../../infrastructure/repositories/PrismaWibgRepository";
import type { UpdateApplicationStatusUseCase } from "../../application/use-cases/wibg/UpdateApplicationStatusUseCase";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";

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
}
