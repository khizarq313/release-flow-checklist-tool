import React, { useMemo, useState } from 'react';
import ReleaseCard from './ReleaseCard';
import EmptyState from './EmptyState';
import { ReleaseRecord, ReleaseStatus } from '../lib/releaseUtils';

interface DashboardProps {
  releases: ReleaseRecord[];
  loading: boolean;
  error?: Error;
  selectedReleaseId: string | null;
  onSelectRelease: (id: string) => void;
  onNewRelease: () => void;
}

type FilterValue = 'all' | ReleaseStatus;

const filterOptions: Array<{ label: string; value: FilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Planned', value: 'planned' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Done', value: 'done' },
];

const Dashboard: React.FC<DashboardProps> = ({
  releases,
  loading,
  error,
  selectedReleaseId,
  onSelectRelease,
  onNewRelease,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filteredReleases = useMemo(() => {
    if (activeFilter === 'all') {
      return releases;
    }

    return releases.filter((release) => release.status === activeFilter);
  }, [activeFilter, releases]);

  return (
    <section className={`rounded-[32px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 ${selectedReleaseId ? 'order-2 xl:order-1' : 'order-1'}`}>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Releases</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Track every ship date in one place.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Select a release to toggle checklist steps and update supporting notes.</p>
          </div>
          <button
            type="button"
            onClick={onNewRelease}
            className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex sm:items-center sm:gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${activeFilter === option.value ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="h-3 w-24 rounded-full bg-slate-200" />
                <div className="mt-4 h-6 w-2/3 rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200" />
                <div className="mt-5 h-2 w-full rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            Unable to load releases right now. {error.message}
          </div>
        ) : releases.length === 0 ? (
          <EmptyState onNewRelease={onNewRelease} />
        ) : filteredReleases.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No releases match the current filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReleases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                isSelected={release.id === selectedReleaseId}
                onClick={onSelectRelease}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
