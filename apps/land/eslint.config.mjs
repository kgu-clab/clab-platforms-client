import { base, react } from '@clab/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const baseWithoutImport = base.filter((config) => !config.plugins || !('import' in config.plugins));

export default defineConfig([
  ...baseWithoutImport,
  ...react,
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
