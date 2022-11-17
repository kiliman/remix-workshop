import react from "@vitejs/plugin-react";
import * as path from "path";
import * as VitestConfig from "vitest/config";

export default VitestConfig.defineConfig({
  test: {
    // See the list of config options in the Config Reference:
    // https://vitest.dev/config/
    environment: "jsdom",
    globals: true,
    includeSource: ["app/**/*.{ts,tsx}"],
    exclude: ["node_modules", "e2e"],
    coverage: {
      exclude: ["vitest.setup.ts", "app/mocks.tsx"],
      reporter: process.env.CI ? "json" : "html-spa",
    },
    setupFiles: ["vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [react()],
});
