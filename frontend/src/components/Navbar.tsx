import React from 'react';
import { ViewType, UserProfile } from '../App';

interface NavbarProps {
  onNewRelease: () => void;
  selectedReleaseId?: string | null;
  onBack?: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userProfile: UserProfile;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNewRelease, 
  selectedReleaseId, 
  onBack,
  isSidebarOpen,
  setIsSidebarOpen,
  currentView,
  setCurrentView,
  userProfile 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {selectedReleaseId ? (
          <>
            <button onClick={onBack} className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Release Details</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">ID: REL-{selectedReleaseId.split('-')[0]}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-400 text-2xl">rocket_launch</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight hidden sm:block">Release Flow</span>
          </div>
        )}
      </div>

      {!selectedReleaseId && (
        <div className="hidden lg:flex items-center gap-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('releases')}
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${currentView === 'releases' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Releases
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${currentView === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${currentView === 'settings' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Settings
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {selectedReleaseId && (
          <button className="hidden md:flex items-center gap-1 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span className="text-sm font-semibold">Share</span>
          </button>
        )}
        <button 
          onClick={onNewRelease}
          className="hidden md:flex bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md hover:scale-[0.98] active:scale-[0.95] transition-all"
        >
          + New Release
        </button>
        <div className="md:hidden w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/30 flex items-center justify-center">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">{userProfile.initials}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
