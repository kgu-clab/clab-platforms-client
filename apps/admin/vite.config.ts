import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL ?? '';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
    server: {
      proxy: apiBaseUrl
        ? undefined
        : {
            // VITE_API_BASE_URL 미설정 시 /v1 요청을 백엔드로 전달 (개발 시 .env에 VITE_API_PROXY_TARGET 설정)
            '/v1': {
              target: env.VITE_API_PROXY_TARGET ?? 'http://localhost:8080',
              changeOrigin: true,
            },
          },
    },
  };
});
