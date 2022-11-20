import { prisma } from '~/prisma/db.server'
import type { Note, User } from '~/prisma/tenant'

export function getNote(
  tenantId: string,
  {
    id,
    userId,
  }: Pick<Note, 'id'> & {
    userId: User['id']
  },
) {
  return prisma(tenantId).note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  })
}

export function getNoteListItems(
  tenantId: string,
  { userId }: { userId: User['id'] },
) {
  return prisma(tenantId).note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export function createNote(
  tenantId: string,
  {
    body,
    title,
    userId,
  }: Pick<Note, 'body' | 'title'> & {
    userId: User['id']
  },
) {
  return prisma(tenantId).note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export function deleteNote(
  tenantId: string,
  { id, userId }: Pick<Note, 'id'> & { userId: User['id'] },
) {
  return prisma(tenantId).note.deleteMany({
    where: { id, userId },
  })
}
