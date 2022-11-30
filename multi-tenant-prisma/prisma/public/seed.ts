import { PrismaClient } from '@prisma/client/public'

console.log(`seeding public...`)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

;(async function () {
  prisma.$connect()

  const tenants = await prisma.tenant.findMany()
  console.log(tenants)

  prisma.$disconnect()
})()
