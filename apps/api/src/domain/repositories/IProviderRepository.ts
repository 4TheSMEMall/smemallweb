import type { ProviderEntity } from "../entities/Provider";

export interface CreateProviderData {
  userId: string;
  businessName: string;
  serviceTags: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface IProviderRepository {
  findAll(): Promise<ProviderEntity[]>;
  findById(id: string): Promise<ProviderEntity | null>;
  findByUserId(userId: string): Promise<ProviderEntity | null>;
  create(data: CreateProviderData): Promise<ProviderEntity>;
  recordRating(providerId: string, newStarRating: number): Promise<void>;
}
