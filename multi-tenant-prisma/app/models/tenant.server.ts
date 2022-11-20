import { prismaPublic } from '~/prisma/db.server'
import { type Tenant } from '~/prisma/public'
export { type Tenant }

export function requireTenantId(request: Request) {
  const tenantId = getTenantId(request)
  if (!tenantId) {
    throw new Response('Tenant ID is required', { status: 404 })
  }
  return tenantId
}

export function getTenantId(request: Request) {
  const url = new URL(request.url)
  const parts = url.hostname.split('.')
  let tenantId: Tenant['id'] | undefined
  if (parts.length >= 3) {
    tenantId = parts[parts.length - 3]
  }

  return tenantId
}

export function getTenantById(tenantId: Tenant['id']) {
  return prismaPublic().tenant.findUnique({ where: { id: tenantId } })
}

export function addTenant(name: Tenant['name'], host: Tenant['host']) {
  return prismaPublic().tenant.create({ data: { id: host, name, host } })
}
