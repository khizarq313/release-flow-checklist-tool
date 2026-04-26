import React from 'react';

interface EmptyStateProps {
  onNewRelease: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewRelease }) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-sm shadow-slate-200">
        <span className="material-symbols-outlined text-[32px]">rocket_launch</span>
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">No releases yet</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
        Create your first release to start tracking due dates, checklist progress, and release notes.
      </p>
      
      <button 
        onClick={onNewRelease}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:bg-slate-800"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New release
      </button>
    </div>
  );
};

export default EmptyState;
