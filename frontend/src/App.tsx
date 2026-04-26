import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import CreateReleaseModal from './components/CreateReleaseModal';
import { ToastProvider } from './components/Toast';
import { GET_RELEASES } from './graphql/queries';
import { getCompletedStepCount, getCompletionPercentage, ReleaseRecord } from './lib/releaseUtils';

export type ViewType = 'dashboard' | 'releases' | 'analytics' | 'settings';
export type UserProfile = { name: string; role: string; initials: string };

interface SummaryCardProps {
  label: string;
  value: string;
  hint: string;
  icon: string;
}

function SummaryCard({ label, value, hint, icon }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</span>
        <span className="material-symbols-outlined text-[20px] text-sky-600">{icon}</span>
      </div>
      <div className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function AppContent() {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error } = useQuery<{ releases: ReleaseRecord[] }>(GET_RELEASES);
  const releases = data?.releases ?? [];

  useEffect(() => {
    if (selectedReleaseId && !releases.some((release) => release.id === selectedReleaseId)) {
      setSelectedReleaseId(null);
    }
  }, [releases, selectedReleaseId]);

  const summary = useMemo(() => {
    const totalReleases = releases.length;
    const plannedReleases = releases.filter((release) => release.status === 'planned').length;
    const ongoingReleases = releases.filter((release) => release.status === 'ongoing').length;
    const completedReleases = releases.filter((release) => release.status === 'done').length;
    const averageCompletion = totalReleases === 0
      ? 0
      : Math.round(
          releases.reduce((total, release) => total + getCompletionPercentage(release.steps), 0) / totalReleases
        );
    const openChecks = releases.reduce(
      (total, release) => total + (release.steps.length - getCompletedStepCount(release.steps)),
      0
    );

    return {
      totalReleases,
      plannedReleases,
      ongoingReleases,
      completedReleases,
      averageCompletion,
      openChecks,
    };
  }, [releases]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.75),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(186,230,253,0.7),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_48%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-8 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  <span className="material-symbols-outlined text-[16px]">checklist</span>
                  Release Checklist Tool
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.8rem]">
                  Keep every release visible, verified, and easy to ship.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Create releases, track one shared checklist, and let status update automatically as work moves from planned to ongoing to done.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setSelectedReleaseId(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                  Browse releases
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New release
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total releases"
                value={String(summary.totalReleases)}
                hint={`${summary.completedReleases} completed so far`}
                icon="stacked_bar_chart"
              />
              <SummaryCard
                label="In progress"
                value={String(summary.ongoingReleases)}
                hint={`${summary.plannedReleases} still planned`}
                icon="autorenew"
              />
              <SummaryCard
                label="Average completion"
                value={`${summary.averageCompletion}%`}
                hint="Across all current releases"
                icon="check_circle"
              />
              <SummaryCard
                label="Open checklist items"
                value={String(summary.openChecks)}
                hint="Remaining unchecked steps"
                icon="assignment_late"
              />
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
          <Dashboard
            releases={releases}
            loading={loading}
            error={error}
            selectedReleaseId={selectedReleaseId}
            onSelectRelease={setSelectedReleaseId}
            onNewRelease={() => setIsModalOpen(true)}
          />

          {releases.length > 0 && selectedReleaseId ? (
            <div className="order-1 xl:order-2">
              <DetailView id={selectedReleaseId} onBack={() => setSelectedReleaseId(null)} />
            </div>
          ) : (
            <section className="hidden rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-8 text-slate-500 shadow-[0_16px_40px_rgba(15,23,42,0.05)] xl:flex xl:min-h-[640px] xl:flex-col xl:justify-center">
              <div className="max-w-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <span className="material-symbols-outlined text-[28px]">touch_app</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-950">Select a release to manage its checklist.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The detail panel lets you update steps, edit additional information, and watch the status change automatically.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>

      {isModalOpen && (
        <CreateReleaseModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={(id) => {
            setIsModalOpen(false);
            setSelectedReleaseId(id);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
