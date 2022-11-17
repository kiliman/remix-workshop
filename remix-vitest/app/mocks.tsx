import type { Form, Link, Outlet } from "@remix-run/react";
import type { ComponentProps, ComponentType } from "react";
import { createPath, resolvePath } from "react-router";

type CreateRemixReactMockOptions = {
  path: string;
  Outlet?: ComponentType<ComponentProps<typeof Outlet>>;
};

export function createRemixReactMock(options: CreateRemixReactMockOptions) {
  let MockedForm = vi.fn(
    ({
      action,
      reloadDocument,
      replace,
      children,
      ...rest
    }: ComponentProps<typeof Form>) => {
      let href = createPath(resolvePath(action || ".", options.path));
      return (
        <form
          {...rest}
          action={href}
          test-reloaddocument={reloadDocument ? "true" : undefined}
          test-replace={replace ? "true" : undefined}
        >
          {children}
        </form>
      );
    }
  );

  let MockedLink = vi.fn(
    ({
      to,
      reloadDocument,
      replace,
      state,
      prefetch,
      children,
      ...rest
    }: React.ComponentProps<typeof Link>) => {
      let href = createPath(resolvePath(to, options.path));
      return (
        <a
          {...rest}
          href={href}
          test-reloaddocument={reloadDocument ? "true" : undefined}
          test-replace={replace ? "true" : undefined}
          test-state={state ? JSON.stringify(state) : undefined}
          test-prefetch={prefetch}
        >
          {children}
        </a>
      );
    }
  );

  return {
    useLoaderData: vi.fn(),
    useSearchParams: vi.fn(),
    Form: MockedForm,
    Link: MockedLink,
    Links: vi.fn(() => <link data-testid="remix-meta" />),
    LiveReload: vi.fn(() => <script data-testid="remix-live-reload" />),
    Meta: vi.fn(() => <title data-testid="remix-meta">remix-meta</title>),
    Outlet: options.Outlet || vi.fn(() => null),
    ScrollRestoration: vi.fn(() => (
      <script data-testid="remix-scroll-restoration" />
    )),
    Scripts: vi.fn(() => <script data-testid="remix-scripts" />),
  };
}
