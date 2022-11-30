// import { prisma } from '../../app/prisma/db.server';
import { PrismaClient } from '@prisma/client/tenant'

const tenantId = process.argv[2]
console.log(`seeding ${tenantId}...`)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

;(async function () {
  prisma.$connect()

  const user = await prisma.user.findFirst()
  console.log(user)

  prisma.$disconnect()
})()
