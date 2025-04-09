import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import prettier from "eslint-config-prettier"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    rules: {
      camelcase: "warn",
      "no-unused-vars": "warn",
    },
    extends: [js.configs.recommended, prettier],
  },
])
