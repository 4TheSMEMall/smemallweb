import type { PrismaWibgRepository, WibgApplicationStatus } from "../../../infrastructure/repositories/PrismaWibgRepository";
import { sendStatusEmail } from "../../../infrastructure/services/BrevoEmailService";
import { NotFoundError } from "../../../domain/errors/DomainError";

export class UpdateApplicationStatusUseCase {
  constructor(private readonly repo: PrismaWibgRepository) {}

  async execute(id: string, status: WibgApplicationStatus, adminNotes?: string) {
    const app = await this.repo.findApplicationById(id);
    if (!app) throw new NotFoundError("Application");

    const updated = await this.repo.updateApplicationStatus(id, status, adminNotes);

    sendStatusEmail(app.founderEmail, app.founderName, status).catch((err) =>
      console.error("[Email] status update email failed:", err),
    );

    return updated;
  }
}
