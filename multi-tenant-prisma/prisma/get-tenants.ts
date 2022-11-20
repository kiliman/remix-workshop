import { prismaPublic } from '../app/prisma/db.server'

export const getTenants = async () => {
  return await prismaPublic().tenant.findMany()
}
;(async function () {
  const tenantIds = (
    await prismaPublic().tenant.findMany({
      select: { id: true },
    })
  ).map(({ id }: { id: string }) => id)

  console.log(tenantIds.join('\n'))
})()
