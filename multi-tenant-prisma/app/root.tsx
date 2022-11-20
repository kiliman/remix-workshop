import {
  json,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { getTenantById, getTenantId } from './models/tenant.server'

import { getUser } from './session.server'
import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Notes',
  viewport: 'width=device-width,initial-scale=1',
})

export async function loader({ request }: LoaderArgs) {
  let url = new URL(request.url)
  const user = await getUser(request)
  const tenantId = getTenantId(request)
  if (!user && tenantId && url.pathname === '/') {
    return redirect('/login')
  }
  if (user && tenantId && url.pathname === '/') {
    return redirect('/notes')
  }

  const tenant = tenantId ? await getTenantById(tenantId) : null
  return json({ user, tenant })
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
