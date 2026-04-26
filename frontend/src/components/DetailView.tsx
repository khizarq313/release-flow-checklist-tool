import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RELEASE_DETAIL } from '../graphql/queries';
import { DELETE_RELEASE, UPDATE_ADDITIONAL_INFO, UPDATE_STEPS } from '../graphql/mutations';
import { GET_RELEASES } from '../graphql/queries';
import DeleteReleaseDialog from './DeleteReleaseDialog';
import StepItem from './StepItem';
import StatusBadge from './StatusBadge';
import { useToast } from './Toast';
import { RELEASE_STEP_COUNT, RELEASE_STEPS } from '../lib/releaseSteps';
import { formatReleaseDate, getCompletedStepCount, ReleaseRecord } from '../lib/releaseUtils';

interface DetailViewProps {
  id: string;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ id, onBack }) => {
  const { data, loading, error } = useQuery<{ release: ReleaseRecord }>(GET_RELEASE_DETAIL, { variables: { id } });
  const [updateSteps, { loading: updatingSteps }] = useMutation(UPDATE_STEPS);
  const [updateInfo, { loading: updatingInfo }] = useMutation(UPDATE_ADDITIONAL_INFO);
  const [deleteRelease, { loading: deletingRelease }] = useMutation(DELETE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
    awaitRefetchQueries: true,
  });
  const { showToast } = useToast();

  const [localInfo, setLocalInfo] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (data?.release) {
      setLocalInfo(data.release.additionalInfo || '');
    }
  }, [data]);

  if (loading && !data) {
    return (
      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="h-9 w-2/3 rounded-full bg-slate-200" />
          <div className="h-4 w-1/3 rounded-full bg-slate-200" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-24 rounded-3xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.release) {
    return <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Unable to load release details.</div>;
  }

  const release = data.release;
  const completedCount = getCompletedStepCount(release.steps);
  const percentage = Math.round((completedCount / RELEASE_STEP_COUNT) * 100);
  const allComplete = completedCount === RELEASE_STEP_COUNT;
  const infoHasChanged = localInfo !== (release.additionalInfo || '');

  const handleToggleStep = async (index: number) => {
    const newSteps = [...release.steps];
    newSteps[index] = !newSteps[index];

    try {
      await updateSteps({
        variables: { id, steps: newSteps },
      });
    } catch (e) {
      showToast({ message: 'Error updating step', type: 'error' });
    }
  };

  const handleInfoSave = async (): Promise<boolean> => {
    if (!infoHasChanged) {
      return true;
    }

    try {
      await updateInfo({ variables: { id, additionalInfo: localInfo } });
      showToast({ message: 'Notes saved' });
      return true;
    } catch (e) {
      showToast({ message: 'Error saving', type: 'error' });
      return false;
    }
  };

  const handleBack = async () => {
    if (updatingInfo || deletingRelease) {
      return;
    }

    const didSave = await handleInfoSave();
    if (didSave) {
      onBack();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRelease({ variables: { id } });
      showToast({ message: 'Release deleted' });
      setIsDeleteDialogOpen(false);
      onBack();
    } catch (mutationError) {
      showToast({ message: 'Error deleting', type: 'error' });
    }
  };

  return (
    <>
      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="border-b border-slate-200 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              type="button"
              onClick={handleBack}
              disabled={updatingInfo || deletingRelease}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              {infoHasChanged ? 'Save and close' : 'Back to releases'}
            </button>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Release details</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">{release.name}</h2>
              <StatusBadge status={release.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Due {formatReleaseDate(release.date, true)}. Status is computed automatically from the checklist below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deletingRelease}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-wait disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            {deletingRelease ? 'Deleting...' : 'Delete release'}
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Due date</div>
            <div className="mt-3 text-lg font-bold tracking-tight text-slate-950">{formatReleaseDate(release.date, true)}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Created</div>
            <div className="mt-3 text-lg font-bold tracking-tight text-slate-950">{release.createdAt ? formatReleaseDate(release.createdAt, true) : 'Unavailable'}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last updated</div>
            <div className="mt-3 text-lg font-bold tracking-tight text-slate-950">{release.updatedAt ? formatReleaseDate(release.updatedAt, true) : 'Unavailable'}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Progress</div>
            <div className="mt-3 text-lg font-bold tracking-tight text-slate-950">{completedCount}/{RELEASE_STEP_COUNT} steps</div>
            <p className="mt-2 text-sm text-slate-500">{percentage}% complete</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">Checklist steps</h3>
              <p className="mt-1 text-sm text-slate-600">Every release uses the same shared checklist. Toggle any item on or off.</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              {completedCount}/{RELEASE_STEP_COUNT} complete
            </span>
          </div>

          <div className="space-y-3">
            {RELEASE_STEPS.map((step, index) => (
              <StepItem
                key={step.title}
                index={index}
                step={step}
                isCompleted={release.steps[index]}
                onToggle={() => handleToggleStep(index)}
                loading={updatingSteps}
              />
            ))}
          </div>

          <div className={`mt-6 rounded-[28px] border px-5 py-5 ${allComplete ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[24px] ${allComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {allComplete ? 'verified' : 'schedule'}
              </span>
              <div>
                <h4 className={`text-lg font-bold tracking-tight ${allComplete ? 'text-emerald-900' : 'text-amber-900'}`}>
                  {allComplete ? 'Release is ready to mark done.' : 'Release is still in progress.'}
                </h4>
                <p className={`mt-1 text-sm leading-6 ${allComplete ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {allComplete
                    ? 'Every checklist item has been completed, so the status is now done.'
                    : 'Planned switches to ongoing after the first completed step and becomes done only when every step is checked.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold tracking-tight text-slate-950">Additional information</h3>
              <span className="material-symbols-outlined text-slate-400">edit_note</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Capture links, rollout notes, risks, or anything the team should know before shipping.</p>
            <textarea
              value={localInfo}
              onChange={(event) => setLocalInfo(event.target.value)}
              className="mt-4 min-h-[220px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              placeholder="Add rollout notes, links, environment details, or risk context..."
            />
            <button
              type="button"
              onClick={handleInfoSave}
              disabled={updatingInfo || !infoHasChanged}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {updatingInfo ? 'Saving...' : infoHasChanged ? 'Save notes' : 'Notes saved'}
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
            <h3 className="text-lg font-bold tracking-tight text-slate-950">Status rules</h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p><span className="font-semibold text-slate-900">Planned:</span> no checklist steps have been completed yet.</p>
              <p><span className="font-semibold text-slate-900">Ongoing:</span> at least one step is complete, but not all of them.</p>
              <p><span className="font-semibold text-slate-900">Done:</span> every checklist step is complete.</p>
            </div>
          </div>
        </aside>
      </div>
      </div>

      <DeleteReleaseDialog
        open={isDeleteDialogOpen}
        releaseName={release.name}
        releaseDate={release.date}
        loading={deletingRelease}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default DetailView;
