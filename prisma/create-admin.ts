/**
 * Admin Creation Script — CLI / Development Tool
 *
 * Creates or updates an administrator account using environment variables.
 * Usage: npx tsx prisma/create-admin.ts
 *
 * Environment variables used:
 *   ADMIN_USERNAME (default: admin)
 *   ADMIN_EMAIL    (default: admin@example.com)
 *   ADMIN_PASSWORD (default: admin123456)
 *   ADMIN_NAME     (default: Bosh Administrator)
 *
 * IMPORTANT:
 * - Password will be hashed using bcryptjs before database storage.
 * - Never log or print the raw password.
 */

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"


const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })


async function main() {
  const username = (process.env.ADMIN_USERNAME || "admin").trim()
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").trim()
  const password = process.env.ADMIN_PASSWORD || "admin123456"
  const name = (process.env.ADMIN_NAME || "Bosh Administrator").trim()

  if (password.length < 6) {
    console.error("❌ Error: ADMIN_PASSWORD must be at least 6 characters long.")
    process.exit(1)
  }

  console.log("🔐 Creating/Updating administrator account...")

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      email,
      name,
      passwordHash,
      isActive: true,
    },
    create: {
      username,
      email,
      name,
      passwordHash,
      isActive: true,
    },
  })

  console.log(`✅ Administrator account created/updated successfully!`)
  console.log(`   ID: ${admin.id}`)
  console.log(`   Username: ${admin.username}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Name: ${admin.name}`)
  console.log(`   Status: Active`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Failed to create administrator:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
