import { PrismaClient as PrismaClientPublic } from '@prisma/client/public'
import { PrismaClient as PrismaClientTenant } from '@prisma/client/tenant'
import invariant from 'tiny-invariant'

declare global {
  var __db_public__: PrismaClientPublic
  var __db_clients__: Map<string, PrismaClientTenant>
}

let _public: PrismaClientPublic
let _clients: Map<string, PrismaClientTenant>

if (process.env.NODE_ENV === 'production') {
  _public = prismaPublic()
  _clients = new Map()
} else {
  if (!global.__db_public__) {
    global.__db_public__ = prismaPublic()
  }
  if (!global.__db_clients__) {
    global.__db_clients__ = new Map()
  }
  _public = global.__db_public__
  _clients = global.__db_clients__
}

export function prismaPublic() {
  let { DATABASE_URL } = process.env
  invariant(typeof DATABASE_URL === 'string', 'DATABASE_URL env var not set')
  if (_public) return _public

  let databaseUrl = `${DATABASE_URL}?schema=public`

  const client = new PrismaClientPublic({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  })
  // connect eagerly
  client.$connect()
  _public = client

  return client
}

export function prisma(tenantId: string) {
  let { DATABASE_URL } = process.env
  invariant(typeof DATABASE_URL === 'string', 'DATABASE_URL env var not set')
  if (_clients.has(tenantId)) {
    let client = _clients.get(tenantId)
    invariant(client, 'client should be defined')
    return client
  }

  let databaseUrl = `${DATABASE_URL}?schema=${tenantId}`

  const client = new PrismaClientTenant({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  })
  // connect eagerly
  client.$connect()
  _clients.set(tenantId, client)

  return client
}
