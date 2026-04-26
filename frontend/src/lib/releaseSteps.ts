export interface ReleaseStepDefinition {
  title: string;
  description: string;
}

export const RELEASE_STEPS: ReleaseStepDefinition[] = [
  {
    title: 'Scope freeze',
    description: 'Confirm the release scope and stop adding new work.',
  },
  {
    title: 'Regression suite',
    description: 'Run the shared automated test suite for the target branch.',
  },
  {
    title: 'QA sign-off',
    description: 'Record manual verification from QA for the release candidate.',
  },
  {
    title: 'Security review',
    description: 'Complete dependency, secret, and vulnerability checks.',
  },
  {
    title: 'Staging deployment',
    description: 'Ship the build to staging and verify the smoke checks.',
  },
  {
    title: 'Release notes',
    description: 'Prepare customer-facing notes and internal rollout context.',
  },
  {
    title: 'Stakeholder approval',
    description: 'Collect the final go-ahead from engineering and product owners.',
  },
  {
    title: 'Production rollout',
    description: 'Execute the production deployment and monitor the initial rollout.',
  },
  {
    title: 'Post-release verification',
    description: 'Confirm metrics, logs, and alerts stay healthy after launch.',
  },
];

export const RELEASE_STEP_COUNT = RELEASE_STEPS.length;