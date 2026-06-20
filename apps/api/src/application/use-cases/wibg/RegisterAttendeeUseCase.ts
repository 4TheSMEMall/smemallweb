import type { PrismaWibgRepository, AttendeeInput } from "../../../infrastructure/repositories/PrismaWibgRepository";
import { ConflictError } from "../../../domain/errors/DomainError";

export class RegisterAttendeeUseCase {
  constructor(private readonly repo: PrismaWibgRepository) {}

  async execute(input: AttendeeInput) {
    const existing = await this.repo.findAttendeeByEmail(input.email);
    if (existing) {
      throw new ConflictError("This email address is already registered for the Grand Finale.");
    }
    return this.repo.createAttendee(input);
  }
}
