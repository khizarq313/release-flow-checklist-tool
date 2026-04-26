import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import DeleteReleaseDialog from './DeleteReleaseDialog';
import { useMutation } from '@apollo/client';
import { DELETE_RELEASE } from '../graphql/mutations';
import { GET_RELEASES } from '../graphql/queries';
import { useToast } from './Toast';
import { RELEASE_STEP_COUNT } from '../lib/releaseSteps';
import { formatReleaseDate, getCompletedStepCount, ReleaseRecord } from '../lib/releaseUtils';

interface ReleaseCardProps {
  release: ReleaseRecord;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release, isSelected, onClick }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { showToast } = useToast();
  
  const [deleteRelease, { loading: deletingRelease }] = useMutation(DELETE_RELEASE, {
    variables: { id: release.id },
    refetchQueries: [{ query: GET_RELEASES }],
    awaitRefetchQueries: true,
    onCompleted: () => showToast({ message: 'Release deleted' }),
    onError: () => showToast({ message: 'Error deleting', type: 'error' })
  });
  
  const completedCount = getCompletedStepCount(release.steps || []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteRelease();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div 
        onClick={() => onClick(release.id)}
        className={`relative rounded-[28px] border p-5 transition cursor-pointer shadow-sm ${isSelected ? 'border-sky-400 bg-sky-50/80 shadow-sky-100' : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'}`}
      >
        <div className="absolute top-4 right-4">
          <button onClick={handleDeleteClick} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white hover:text-rose-500" disabled={deletingRelease}>
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>

        <div className="mb-4 flex items-start justify-between gap-3 pr-10">
          <StatusBadge status={release.status} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {completedCount}/{RELEASE_STEP_COUNT} done
          </span>
        </div>
        
        <h3 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">{release.name}</h3>
        <p className="mt-2 text-sm text-slate-500">
          Target: {formatReleaseDate(release.date, true)}
        </p>

        <div className="mt-5">
          <ProgressBar completed={completedCount} total={RELEASE_STEP_COUNT} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Status updates automatically
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
            Open details
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </span>
        </div>
      </div>

      <DeleteReleaseDialog
        open={isDeleteDialogOpen}
        releaseName={release.name}
        releaseDate={release.date}
        loading={deletingRelease}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </>
  );
};

export default ReleaseCard;
