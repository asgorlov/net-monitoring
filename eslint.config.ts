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
      // игнорировать если производится установка компонентов через пропс children
      "react/no-children-prop": "off",
      // игнорировать неиспользуемые переменные, если перед ними стоит _
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // исправить на предупреждение: интерфейс без членов эквивалентен его суперклассу
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
  {
    // игнорировать правило использования var в файлах d.ts
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off",
    },
  },
  globalIgnores(["dist", "out", "logs"]),
]);
