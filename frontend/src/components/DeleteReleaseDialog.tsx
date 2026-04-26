import React from 'react';
import { createPortal } from 'react-dom';
import { formatReleaseDate } from '../lib/releaseUtils';

interface DeleteReleaseDialogProps {
  open: boolean;
  releaseName: string;
  releaseDate: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteReleaseDialog: React.FC<DeleteReleaseDialogProps> = ({
  open,
  releaseName,
  releaseDate,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_32px_120px_rgba(15,23,42,0.24)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600">
            <span className="material-symbols-outlined text-[22px]">delete_forever</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Delete release</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Remove {releaseName}?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This will permanently delete the release and its checklist progress. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Target date:</span> {formatReleaseDate(releaseDate, true)}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep release
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-500 disabled:cursor-wait disabled:bg-rose-300"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            {loading ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>
      </div>
    </div>
    ,
    document.body
  );
};

export default DeleteReleaseDialog;