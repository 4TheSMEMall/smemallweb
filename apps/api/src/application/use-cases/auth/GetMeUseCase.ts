import type { User } from "@sme-mall/shared";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { NotFoundError } from "../../../domain/errors/DomainError";

export class GetMeUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
