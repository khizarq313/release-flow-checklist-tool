import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function getPrismaCommand(appRoot: string, schemaPath: string) {
  const prismaBinaryName = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';
  const prismaBinaryPath = resolve(appRoot, 'node_modules', '.bin', prismaBinaryName);
  const migrateArgs = ['migrate', 'deploy', '--schema', schemaPath];

  if (existsSync(prismaBinaryPath)) {
    return {
      command: prismaBinaryPath,
      args: migrateArgs,
    };
  }

  return {
    command: 'npx',
    args: ['--yes', 'prisma', ...migrateArgs],
  };
}

export function ensureDatabaseIsReady() {
  if (process.env.SKIP_PRISMA_MIGRATIONS === 'true') {
    console.log('Skipping Prisma migrations because SKIP_PRISMA_MIGRATIONS=true.');
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required before starting the API.');
  }

  const appRoot = resolve(__dirname, '..');
  const schemaPath = resolve(appRoot, 'prisma', 'schema.prisma');
  const { command, args } = getPrismaCommand(appRoot, schemaPath);

  console.log('Applying Prisma migrations...');

  const result = spawnSync(command, args, {
    cwd: appRoot,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw new Error(`Failed to run Prisma migrations: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Prisma migrations failed with exit code ${result.status ?? 'unknown'}.`);
  }

  console.log('Prisma migrations are up to date.');
}
