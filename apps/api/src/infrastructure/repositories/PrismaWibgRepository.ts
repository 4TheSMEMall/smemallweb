import type { PrismaClient } from "@prisma/client";

export interface ApplicationInput {
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  businessName: string;
  cacStatus: string;
  cacNumber?: string;
  problem: string;
  solution: string;
  market: string;
  traction: string;
  revenue3m: number;
  proj12m: number;
  bhcRef: string;
  bizStage: string;
  pitchVideoLink?: string;
}

export interface AttendeeInput {
  name: string;
  email: string;
  phone: string;
  role: string;
  notes?: string;
}

export class PrismaWibgRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createApplication(data: ApplicationInput) {
    return this.prisma.wibgApplication.create({ data });
  }

  async createAttendee(data: AttendeeInput) {
    return this.prisma.wibgAttendee.create({ data });
  }

  async findAttendeeByEmail(email: string) {
    return this.prisma.wibgAttendee.findUnique({ where: { email } });
  }
}
