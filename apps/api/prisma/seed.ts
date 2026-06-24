import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "abrahammichael054@gmail.com";
  const passwordHash = await bcrypt.hash("Speedforce123", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role:   "ADMIN",
      status: "ACTIVE",
    },
    create: {
      email,
      passwordHash,
      firstName: "Abraham",
      lastName:  "Michael",
      role:      "ADMIN",
      status:    "ACTIVE",
    },
  });

  console.log("Master admin ready:", user.email, "role:", user.role);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
