import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindCss from "~/styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCss },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Multi-Page Forms",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="m-4">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
