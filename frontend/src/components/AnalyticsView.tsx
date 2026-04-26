import React from 'react';

const AnalyticsView: React.FC = () => {
  return (
    <div className="pt-8 pb-12 px-6 lg:px-12 max-w-[1100px] mx-auto w-full animate-[fade-in_0.3s_ease-out]">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Analytics Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Track your deployment frequency and team performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Releases</h3>
            <span className="material-symbols-outlined text-indigo-500">inventory_2</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">42</div>
          <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span> +12% this month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Avg Lead Time</h3>
            <span className="material-symbols-outlined text-indigo-500">timer</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">4.2d</div>
          <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_down</span> -0.5d this month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Success Rate</h3>
            <span className="material-symbols-outlined text-indigo-500">task_alt</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">98.5%</div>
          <p className="text-xs font-semibold text-slate-400 mt-2">Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Deployment Frequency</h3>
          <div className="flex-1 flex items-end gap-2 justify-between">
            {/* Dummy Bar Chart */}
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-400"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-semibold text-slate-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 animate-pulse">donut_large</span>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">More analytics coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
