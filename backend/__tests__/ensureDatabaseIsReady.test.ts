import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ensureDatabaseIsReady } from '../src/ensureDatabaseIsReady';

jest.mock('node:child_process', () => ({
  spawnSync: jest.fn(),
}));

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
}));

const spawnSyncMock = spawnSync as jest.MockedFunction<typeof spawnSync>;
const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const appRoot = resolve(__dirname, '..');
const schemaPath = resolve(appRoot, 'prisma', 'schema.prisma');
const prismaBinaryPath = resolve(
  appRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'prisma.cmd' : 'prisma'
);

function createSpawnResult(overrides: Partial<ReturnType<typeof spawnSync>> = {}) {
  return {
    output: [],
    pid: 1,
    signal: null,
    status: 0,
    stderr: null,
    stdout: null,
    ...overrides,
  } as ReturnType<typeof spawnSync>;
}

describe('ensureDatabaseIsReady', () => {
  const originalEnv = process.env;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/release_checklist',
    };
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    existsSyncMock.mockReturnValue(true);
    spawnSyncMock.mockReturnValue(createSpawnResult());
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('runs prisma migrate deploy with the local prisma binary when available', () => {
    ensureDatabaseIsReady();

    expect(spawnSyncMock).toHaveBeenCalledWith(
      prismaBinaryPath,
      ['migrate', 'deploy', '--schema', schemaPath],
      {
        cwd: appRoot,
        env: process.env,
        stdio: 'inherit',
      }
    );
  });

  it('falls back to npx when the local prisma binary is missing', () => {
    existsSyncMock.mockReturnValue(false);

    ensureDatabaseIsReady();

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'npx',
      ['--yes', 'prisma', 'migrate', 'deploy', '--schema', schemaPath],
      {
        cwd: appRoot,
        env: process.env,
        stdio: 'inherit',
      }
    );
  });

  it('skips migrations when explicitly disabled', () => {
    process.env.SKIP_PRISMA_MIGRATIONS = 'true';

    ensureDatabaseIsReady();

    expect(spawnSyncMock).not.toHaveBeenCalled();
  });

  it('fails fast when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;

    expect(() => ensureDatabaseIsReady()).toThrow('DATABASE_URL is required before starting the API.');
    expect(spawnSyncMock).not.toHaveBeenCalled();
  });

  it('throws when prisma migrate deploy exits with a non-zero status', () => {
    spawnSyncMock.mockReturnValue(createSpawnResult({ status: 1 }));

    expect(() => ensureDatabaseIsReady()).toThrow('Prisma migrations failed with exit code 1.');
  });
});
