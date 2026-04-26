import { Release } from '@prisma/client';
import prisma from './prisma';

export const RELEASE_STEP_COUNT = 9;

function computeStatus(steps: boolean[]): 'planned' | 'ongoing' | 'done' {
  const done = steps.filter(Boolean).length;
  if (done === 0) return 'planned';
  if (done === steps.length) return 'done';
  return 'ongoing';
}

function normalizeName(name: string): string {
  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new Error('Release name is required.');
  }

  return normalizedName;
}

function normalizeDate(date: string): Date {
  const normalizedDate = new Date(date);
  if (Number.isNaN(normalizedDate.getTime())) {
    throw new Error('Release date must be a valid ISO datetime.');
  }

  return normalizedDate;
}

function normalizeAdditionalInfo(additionalInfo?: string | null): string | null {
  const normalizedInfo = additionalInfo?.trim();
  return normalizedInfo ? normalizedInfo : null;
}

function normalizeSteps(steps: unknown): boolean[] {
  if (
    !Array.isArray(steps) ||
    steps.length !== RELEASE_STEP_COUNT ||
    steps.some((step) => typeof step !== 'boolean')
  ) {
    throw new Error(`Steps must be an array of ${RELEASE_STEP_COUNT} booleans.`);
  }

  return steps;
}

function getInitialSteps(): boolean[] {
  return Array.from({ length: RELEASE_STEP_COUNT }, () => false);
}

function formatRelease(release: Release) {
  const stepsArr = normalizeSteps(release.steps as boolean[]);
  return {
    ...release,
    date: release.date.toISOString(),
    createdAt: release.createdAt.toISOString(),
    updatedAt: release.updatedAt.toISOString(),
    additionalInfo: release.additionalInfo ?? null,
    steps: stepsArr,
    status: computeStatus(stepsArr)
  };
}

export const resolvers = {
  Query: {
    releases: async () => {
      const allReleases = await prisma.release.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return allReleases.map(formatRelease);
    },
    release: async (_: any, { id }: { id: string }) => {
      const release = await prisma.release.findUnique({ where: { id } });
      return release ? formatRelease(release) : null;
    }
  },
  Mutation: {
    createRelease: async (_: any, { name, date, additionalInfo }: { name: string, date: string, additionalInfo?: string }) => {
      const newRelease = await prisma.release.create({
        data: {
          name: normalizeName(name),
          date: normalizeDate(date),
          additionalInfo: normalizeAdditionalInfo(additionalInfo),
          steps: getInitialSteps()
        }
      });
      return formatRelease(newRelease);
    },
    updateSteps: async (_: any, { id, steps }: { id: string, steps: boolean[] }) => {
      const updated = await prisma.release.update({
        where: { id },
        data: { steps: normalizeSteps(steps) }
      });
      return formatRelease(updated);
    },
    updateAdditionalInfo: async (_: any, { id, additionalInfo }: { id: string, additionalInfo: string }) => {
      const updated = await prisma.release.update({
        where: { id },
        data: { additionalInfo: normalizeAdditionalInfo(additionalInfo) }
      });
      return formatRelease(updated);
    },
    deleteRelease: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.release.delete({ where: { id } });
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};
