import * as RTL from "@testing-library/react";
import * as Mocks from "~/mocks";

import { json, type LoaderArgs } from "@remix-run/node";
import * as RemixReact from "@remix-run/react";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";

let DEFAULT_MESSAGE = "Hello, World!";

type LoaderData = {
  message: string;
};

export let loader = ({ request }: LoaderArgs) => {
  let url = new URL(request.url);
  let name = url.searchParams.get("name")?.trim();

  let message = DEFAULT_MESSAGE;
  if (name) {
    message = `Hello, ${name}!`;
  }

  return json({ message });
};

export default function Index() {
  let { message } = useLoaderData<typeof loader>();
  let [searchParams] = useSearchParams();
  let defaultName = searchParams.get("name")?.trim() || undefined;

  return (
    <main>
      <h1>{message}</h1>
      <Form action="/">
        <input
          key={defaultName}
          name="name"
          placeholder="enter a name"
          defaultValue={defaultName}
        />
        <button type="submit">Submit</button>
      </Form>
      <p>
        <Link to="about">Go to the about page.</Link>
      </p>
    </main>
  );
}

if (process.env.NODE_ENV === "test" && import.meta.vitest) {
  let { describe, test, expect, vi } = import.meta.vitest;

  vi.mock("@remix-run/react", () => Mocks.createRemixReactMock({ path: "/" }));
  let RemixReactMock = Mocks.getRemixReactMock(RemixReact);

  describe("component", () => {
    beforeEach(() => {
      RemixReactMock.useLoaderData.mockReturnValue({
        message: DEFAULT_MESSAGE,
      });
      RemixReactMock.useSearchParams.mockReturnValue([new URLSearchParams()]);
    });

    test("renders message", () => {
      let { getByText } = RTL.render(<Index />);
      expect(getByText(DEFAULT_MESSAGE)).toBeDefined();
    });

    test("renders link to about", () => {
      let { getByRole } = RTL.render(<Index />);
      expect(getByRole("link").getAttribute("href")).toBe("/about");
    });

    test("defaults to name in search params", () => {
      RemixReactMock.useSearchParams.mockReturnValue([
        new URLSearchParams({
          name: "John",
        }),
      ]);
      let { getByPlaceholderText } = RTL.render(<Index />);
      expect(getByPlaceholderText("enter a name").getAttribute("value")).toBe(
        "John"
      );
    });
  });

  describe("loader", () => {
    describe("should have default message", () => {
      test("when no name is provided", async () => {
        let request = new Request("http://test.com/");
        let response = await loader({ context: {}, params: {}, request });
        expect(response.status).toBe(200);
        let data: LoaderData = await response.json();
        expect(data.message).toBe(DEFAULT_MESSAGE);
      });

      test("when name is blank string", async () => {
        let request = new Request("http://test.com/?name=");
        let response = await loader({ context: {}, params: {}, request });
        expect(response.status).toBe(200);
        let data: LoaderData = await response.json();
        expect(data.message).toBe(DEFAULT_MESSAGE);
      });
    });

    test("should name in message", async () => {
      let request = new Request("http://test.com/?name=Test");
      let response = await loader({ context: {}, params: {}, request });
      expect(response.status).toBe(200);
      let data: LoaderData = await response.json();
      expect(data.message).toBe("Hello, Test!");
    });
  });
}
