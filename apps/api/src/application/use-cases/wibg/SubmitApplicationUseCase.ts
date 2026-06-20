import type { PrismaWibgRepository, ApplicationInput } from "../../../infrastructure/repositories/PrismaWibgRepository";

export class SubmitApplicationUseCase {
  constructor(private readonly repo: PrismaWibgRepository) {}

  async execute(input: ApplicationInput) {
    return this.repo.createApplication(input);
  }
}
