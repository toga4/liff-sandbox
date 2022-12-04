module.exports = {
  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    "import/order": ["error", { alphabetize: { order: "asc" } }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  root: true,
};
