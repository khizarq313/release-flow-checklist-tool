import { RELEASE_STEP_COUNT, resolvers } from '../src/resolvers';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../src/prisma';

jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: (jest.requireActual('jest-mock-extended') as typeof import('jest-mock-extended')).mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe('Resolvers', () => {
  it('createRelease sets status to "planned" and all steps to false', async () => {
    const mockDate = new Date();
    const mockRelease = {
      id: "123",
      name: "Test Release",
      date: mockDate,
      additionalInfo: null,
      steps: Array.from({ length: RELEASE_STEP_COUNT }, () => false),
      createdAt: mockDate,
      updatedAt: mockDate
    };
    
    prismaMock.release.create.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.createRelease(null, {
      name: "Test Release",
      date: mockDate.toISOString(),
      additionalInfo: undefined
    });

    expect(result.status).toBe('planned');
    expect(result.steps.every((s: boolean) => s === false)).toBe(true);
  });

  it('updateSteps sets status to "ongoing" when some steps are true', async () => {
    const mockDate = new Date();
    const partialSteps = [true, false, false, false, false, false, false, false, false];
    const mockRelease = {
      id: '123',
      name: 'Test Release',
      date: mockDate,
      additionalInfo: null,
      steps: partialSteps,
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    prismaMock.release.update.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.updateSteps(null, {
      id: '123',
      steps: partialSteps,
    });

    expect(result.status).toBe('ongoing');
  });

  it('updateSteps sets status to "done" when all steps are true', async () => {
    const mockDate = new Date();
    const trueSteps = Array.from({ length: RELEASE_STEP_COUNT }, () => true);
    const mockRelease = {
      id: "123",
      name: "Test Release",
      date: mockDate,
      additionalInfo: null,
      steps: trueSteps,
      createdAt: mockDate,
      updatedAt: mockDate
    };

    prismaMock.release.update.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.updateSteps(null, {
      id: "123",
      steps: trueSteps
    });

    expect(result.status).toBe('done');
  });

  it('updateSteps rejects a payload with the wrong number of steps', async () => {
    await expect(
      resolvers.Mutation.updateSteps(null, {
        id: '123',
        steps: [true, false],
      })
    ).rejects.toThrow(`Steps must be an array of ${RELEASE_STEP_COUNT} booleans.`);

    expect(prismaMock.release.update).not.toHaveBeenCalled();
  });

  it('updateAdditionalInfo trims blank content to null', async () => {
    const mockDate = new Date();
    const mockRelease = {
      id: '123',
      name: 'Test Release',
      date: mockDate,
      additionalInfo: null,
      steps: Array.from({ length: RELEASE_STEP_COUNT }, () => false),
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    prismaMock.release.update.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.updateAdditionalInfo(null, {
      id: '123',
      additionalInfo: '   ',
    });

    expect(prismaMock.release.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { additionalInfo: null },
    });
    expect(result.additionalInfo).toBeNull();
  });
});
