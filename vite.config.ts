import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const runtimeProcess = (globalThis as unknown as { process?: { env: Record<string, string | undefined> } }).process;
const repositoryName = runtimeProcess?.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const configuredBase = runtimeProcess?.env.VITE_BASE_PATH;

export default defineConfig({
  base: configuredBase ?? (runtimeProcess?.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/'),
  plugins: [react()],
  build: { sourcemap: true },
  server: { host: '127.0.0.1' }
});
