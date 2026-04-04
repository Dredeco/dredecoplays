import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "core", pattern: "src/core/**/*" },
        { type: "ui", pattern: "src/ui/**/*" },
        { type: "pattern", pattern: "src/pattern/**/*" },
        { type: "layouts", pattern: "src/layouts/**/*" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "app", pattern: "src/app/**/*" },
        { type: "mocks", pattern: "src/mocks/**/*" },
        { type: "providers", pattern: "src/providers.tsx" },
        { type: "root", pattern: "*.{mjs,ts}" },
      ],
      "boundaries/ignore": ["**/*.test.ts", "**/*.test.tsx", "**/vitest-setup.ts"],
    },
    rules: {
      "boundaries/element-types": [
        "warn",
        {
          default: "allow",
          rules: [
            { from: ["core"], allow: ["core", "mocks"] },
            { from: ["ui"], allow: ["ui"] },
            { from: ["pattern"], allow: ["core", "ui", "pattern"] },
            { from: ["layouts"], allow: ["core", "ui", "layouts", "features"] },
            { from: ["features"], allow: ["core", "ui", "pattern", "features"] },
            {
              from: ["app", "providers"],
              allow: ["core", "ui", "pattern", "layouts", "features", "mocks"],
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
