import { spawnSync } from 'node:child_process'

export function provisionTenant(tenantId: string) {
  console.log('Provisioning tenant', tenantId)
  spawnSync('prisma/prisma-migrate-dev', ['tenant', tenantId])
  console.log('Provisioning complete')
}
