import bcrypt from 'bcryptjs'
import { prisma } from '~/prisma/db.server'
import type { Password, User } from '~/prisma/tenant'
export type { User }

export async function getUserById(tenantId: string, id: User['id']) {
  return prisma(tenantId).user.findUnique({ where: { id } })
}

export async function getUserByEmail(tenantId: string, email: User['email']) {
  return prisma(tenantId).user.findUnique({ where: { email } })
}

export async function createUser(
  tenantId: string,
  email: User['email'],
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma(tenantId).user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })
}

export async function deleteUserByEmail(
  tenantId: string,
  email: User['email'],
) {
  return prisma(tenantId).user.delete({ where: { email } })
}

export async function verifyLogin(
  tenantId: string,
  email: User['email'],
  password: Password['hash'],
) {
  const userWithPassword = await prisma(tenantId).user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}
