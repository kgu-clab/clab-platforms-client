import { reactBase } from "@clab/config/eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
  globalIgnores(["dist"]),
  ...reactBase,
  reactRefresh.configs.vite,
  storybook.configs["flat/recommended"],
]);
