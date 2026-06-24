import type { PrismaWibgRepository, ApplicationInput } from "../../../infrastructure/repositories/PrismaWibgRepository";
import { ConflictError } from "../../../domain/errors/DomainError";

export class SubmitApplicationUseCase {
  constructor(private readonly repo: PrismaWibgRepository) {}

  async execute(input: ApplicationInput) {
    const existing = await this.repo.findApplicationByEmail(input.founderEmail);
    if (existing) {
      throw new ConflictError(
        "An application with this email address already exists. Each business may only submit one application.",
      );
    }
    return this.repo.createApplication(input);
  }
}
