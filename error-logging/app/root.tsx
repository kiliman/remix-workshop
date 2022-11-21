import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import tailwindCss from '~/styles/tailwind.css'

export const links = () => [{ rel: 'stylesheet', href: tailwindCss }]
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <nav className="flex gap-4 p-4 border-b">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/users/">Users</NavLink>
          </nav>
          <div className="m-4">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
