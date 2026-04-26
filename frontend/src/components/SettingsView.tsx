import React from 'react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme }) => {
  return (
    <div className="pt-6 pb-20 lg:pb-12 px-4 sm:px-6 lg:px-12 max-w-[800px] mx-auto w-full animate-[fade-in_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-2">Manage your app preferences and profile.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500">palette</span> 
            Appearance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Customize the interface theme.</p>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">Theme Mode</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Switch between Light and Dark mode.</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            <button 
              onClick={() => setTheme('light')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
              Light
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <span className="material-symbols-outlined text-[18px]">dark_mode</span>
              Dark
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-indigo-500">info</span> 
          About
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">Version</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">1.0.4-stable</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">Environment</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
