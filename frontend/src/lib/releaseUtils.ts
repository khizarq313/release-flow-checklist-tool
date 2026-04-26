export type ReleaseStatus = 'planned' | 'ongoing' | 'done';

export interface ReleaseRecord {
  id: string;
  name: string;
  date: string;
  status: ReleaseStatus;
  steps: boolean[];
  additionalInfo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatReleaseDate(dateValue: string, includeTime = false): string {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return includeTime ? dateTimeFormatter.format(parsedDate) : dateFormatter.format(parsedDate);
}

export function getCompletedStepCount(steps: boolean[]): number {
  return steps.filter(Boolean).length;
}

export function getCompletionPercentage(steps: boolean[]): number {
  if (steps.length === 0) {
    return 0;
  }

  return Math.round((getCompletedStepCount(steps) / steps.length) * 100);
}