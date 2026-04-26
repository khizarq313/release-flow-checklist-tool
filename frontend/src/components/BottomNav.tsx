import React from 'react';
import { ViewType } from '../App';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around pb-1">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'}`}
      >
        <span className="material-symbols-outlined text-xl">dashboard</span>
        <span className="text-[10px] font-medium">Dashboard</span>
      </button>
      <button 
        onClick={() => setCurrentView('releases')}
        className={`flex flex-col items-center gap-1 ${currentView === 'releases' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'}`}
      >
        <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
        <span className="text-[10px] font-medium">Releases</span>
      </button>
      <button 
        onClick={() => setCurrentView('analytics')}
        className={`flex flex-col items-center gap-1 ${currentView === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'}`}
      >
        <span className="material-symbols-outlined text-xl">bar_chart</span>
        <span className="text-[10px] font-medium">Analytics</span>
      </button>
      <button 
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'}`}
      >
        <span className="material-symbols-outlined text-xl">settings</span>
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </nav>
  );
};

export default BottomNav;
