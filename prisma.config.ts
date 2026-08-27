// ============================================================
// Prisma Configuration — O'quv Markaz
// Phase 4A: Database Architecture
//
// Prisma 7 requires the DATABASE_URL to be configured here,
// not in schema.prisma. This is a BREAKING CHANGE from Prisma 5/6.
// Reference: https://pris.ly/d/config-datasource
// ============================================================

import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
