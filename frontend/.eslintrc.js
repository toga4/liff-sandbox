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
  rules: {},
  settings: {
    react: {
      version: "detect",
    },
  },
  root: true,
};
