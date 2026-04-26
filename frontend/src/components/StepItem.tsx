import React from 'react';
import { RELEASE_STEPS, ReleaseStepDefinition } from '../lib/releaseSteps';

export type StepDef = ReleaseStepDefinition;
export const FIXED_STEPS = RELEASE_STEPS;

interface StepItemProps {
  step: StepDef;
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
  loading: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, index, isCompleted, onToggle, loading }) => {
  return (
    <button
      type="button"
      onClick={() => !loading && onToggle()}
      disabled={loading}
      className={`flex w-full items-start gap-4 rounded-[24px] border p-4 text-left transition sm:p-5 ${isCompleted ? 'border-emerald-200 bg-emerald-50/80' : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50'} ${loading ? 'cursor-wait opacity-70' : ''}`}
      aria-pressed={isCompleted}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold ${isCompleted ? 'border-emerald-300 bg-emerald-500 text-white' : 'border-slate-300 bg-slate-50 text-slate-600'}`}>
        {isCompleted ? <span className="material-symbols-outlined text-[20px]">check</span> : index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className={`text-base font-semibold tracking-tight sm:text-lg ${isCompleted ? 'text-emerald-900' : 'text-slate-950'}`}>
              {step.title}
            </h4>
            <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
          </div>
          <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {isCompleted ? 'Done' : 'Pending'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default StepItem;
