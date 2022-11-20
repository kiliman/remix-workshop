import { createCookieSessionStorage, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

import type { User } from '~/models/user.server'
import { getUserById } from '~/models/user.server'
import { getTenantId, requireTenantId } from './models/tenant.server'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const USER_SESSION_KEY = 'userId'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getUserId(
  request: Request,
): Promise<User['id'] | undefined> {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

export async function getUser(request: Request) {
  const tenantId = getTenantId(request)
  const userId = await getUserId(request)
  if (userId === undefined) return null

  if (tenantId) {
    const user = await getUserById(tenantId, userId)
    if (user) return user
  }

  return null
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function requireUser(request: Request) {
  const tenantId = requireTenantId(request)
  const userId = await requireUserId(request)

  const user = await getUserById(tenantId, userId)
  if (user) return user

  throw await logout(request)
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request
  userId: string
  remember: boolean
  redirectTo: string
}) {
  const url = new URL(request.url)
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        domain: url.hostname, // session only for current tenant
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}

export async function logout(request: Request) {
  const url = new URL(request.url)
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session, {
        domain: url.hostname,
      }),
    },
  })
}
