import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: { "react-hooks": pluginReactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  eslintConfigPrettier,
  {
    rules: {
      // игнорировать использование any
      "@typescript-eslint/no-explicit-any": "off",
      // игнорировать обязательную установку displayName для компонентов
      "react/display-name": "off",
      // игнорировать прокидывание компонентов через пропс
      "react/no-children-prop": "off",
      // игнорировать несипользуемые переменные, если перед ними стоить _
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // исправить на предупреждение: интерфейс без членов эквивалентен его суперклассу
      "@typescript-eslint/no-empty-object-type": ["warn"],
    },
  },
  globalIgnores(["dist", "out", "logs"]),
]);
