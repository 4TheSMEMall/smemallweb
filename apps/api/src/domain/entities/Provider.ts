export class ProviderEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly businessName: string,
    public readonly serviceTags: string[],
    public readonly contactEmail: string,
    public readonly contactPhone: string,
    public readonly active: boolean,
    public readonly avgRating: number,
    public readonly reviewCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
