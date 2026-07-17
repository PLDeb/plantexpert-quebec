import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Évite de recréer un client (et d'épuiser les connexions Postgres) à chaque
// rechargement à chaud en développement.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

/**
 * Client créé à la demande (pas au chargement du module) : importer ce fichier
 * ne doit jamais échouer si DATABASE_URL est absente, seul un appel réel doit.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
