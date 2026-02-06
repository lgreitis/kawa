/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // project: true
    project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.web.json"],
  },
  ignorePatterns: ["out", ".eslintrc.cjs", "postcss.config.cjs", "tailwind.config.js"],
  plugins: [
    "@typescript-eslint",
    "react-refresh",
    "unused-imports",
    "eslint-plugin-react-compiler",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "error",
    "react-hooks/set-state-in-effect": "warn",
    "react-hooks/refs": "warn",
  },
};
