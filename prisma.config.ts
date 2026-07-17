import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// On réutilise .env.local (convention Next.js) plutôt qu'un .env séparé.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Les migrations (CLI) ont besoin de la connexion DIRECTE à Postgres (port 5432),
  // pas de la connexion "pooled" via PgBouncer utilisée par l'app à l'exécution.
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
