/**
 * Prisma Client Singleton — Prisma 7 with PostgreSQL Driver Adapter
 *
 * In Next.js development mode, hot-reload causes the module cache to be
 * cleared, which would create a new PrismaClient instance on every reload
 * and exhaust the database connection pool.
 *
 * This singleton pattern stores a single instance on the `globalThis` object
 * so it survives hot-reloads in development while being a plain singleton in
 * production (where the module cache is stable).
 *
 * Prisma 7 BREAKING CHANGE: PrismaClient requires a driver adapter.
 * We use @prisma/adapter-pg (pg driver) with DATABASE_URL from the environment.
 *
 * Reference: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })
}


export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
