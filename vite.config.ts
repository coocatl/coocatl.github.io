import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

type RuntimeProcess = {
  env: Record<string, string | undefined>;
};

const runtimeProcess = (globalThis as unknown as { process?: RuntimeProcess }).process;
const [repositoryOwner = '', repositoryName = ''] =
  runtimeProcess?.env.GITHUB_REPOSITORY?.split('/') ?? [];
const configuredBase = runtimeProcess?.env.VITE_BASE_PATH;
const isGitHubUserSite =
  repositoryOwner.length > 0 &&
  repositoryName.toLowerCase() === `${repositoryOwner.toLowerCase()}.github.io`;
const automaticBase = runtimeProcess?.env.GITHUB_ACTIONS
  ? isGitHubUserSite
    ? '/'
    : `/${repositoryName}/`
  : '/';

export default defineConfig({
  base: configuredBase ?? automaticBase,
  plugins: [react()],
  build: { sourcemap: true },
  server: { host: '127.0.0.1' },
});
