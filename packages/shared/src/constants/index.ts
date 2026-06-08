export const USER_ROLES = {
  BUSINESS_OWNER: "BUSINESS_OWNER",
  ADMIN: "ADMIN",
  PARTNER: "PARTNER",
  CONSULTANT: "CONSULTANT",
} as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  BUSINESS_OWNER: "Business Owner",
  ADMIN: "Administrator",
  PARTNER: "Partner / Lender",
  CONSULTANT: "Consultant / Advisor",
};

export const SERVICES = [
  {
    id: "bhc",
    name: "Business Health Checker",
    shortName: "BHC",
    description: "Assess your loan readiness and business health score",
    path: "/services/bhc",
  },
  {
    id: "sme-paddy",
    name: "SME Paddy",
    shortName: "SME Paddy",
    description: "Business management, bookkeeping and financial tracking",
    path: "/services/sme-paddy",
  },
  {
    id: "wibg",
    name: "Women in Business Growth",
    shortName: "WIBG",
    description: "Resources and support for women entrepreneurs",
    path: "/services/wibg",
  },
] as const;

export const BRAND = {
  primaryColor: "#0B1F3A",
  accentColor: "#FF2D4A",
  font: "Plus Jakarta Sans",
} as const;
