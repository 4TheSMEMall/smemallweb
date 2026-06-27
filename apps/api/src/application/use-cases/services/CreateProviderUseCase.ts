import crypto from "crypto";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import type { IPasswordService } from "../../interfaces/IPasswordService";
import { ProviderEntity } from "../../../domain/entities/Provider";
import { ConflictError } from "../../../domain/errors/DomainError";

export interface CreateProviderInput {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  serviceTags: string[];
  firstName: string;
  lastName: string;
}

export interface CreateProviderResult {
  provider: ProviderEntity;
  tempPassword: string;
}

/**
 * Admin onboards a new service provider — creates both their login account
 * (role PROVIDER) and their provider profile in one step. No public
 * self-serve signup yet, so admin must relay the temp password manually.
 */
export class CreateProviderUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly providerRepo: IProviderRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(input: CreateProviderInput): Promise<CreateProviderResult> {
    const existing = await this.userRepo.findByEmail(input.contactEmail.toLowerCase());
    if (existing) throw new ConflictError("An account with this email already exists");

    const tempPassword = crypto.randomBytes(9).toString("base64url"); // 12-char readable temp password
    const passwordHash = await this.passwordService.hash(tempPassword);

    const user = await this.userRepo.create({
      email: input.contactEmail.toLowerCase().trim(),
      passwordHash,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      role: "PROVIDER",
      phone: input.contactPhone,
    });

    const provider = await this.providerRepo.create({
      userId: user.id,
      businessName: input.businessName.trim(),
      serviceTags: input.serviceTags,
      contactEmail: input.contactEmail.toLowerCase().trim(),
      contactPhone: input.contactPhone,
    });

    return { provider, tempPassword };
  }
}
