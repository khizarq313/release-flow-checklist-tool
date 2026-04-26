import React, { useState, useRef, useEffect } from 'react';
import { ViewType, UserProfile } from '../App';

interface SidebarProps {
  selectedReleaseId?: string | null;
  onBack?: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedReleaseId, 
  onBack,
  isSidebarOpen,
  setIsSidebarOpen,
  currentView,
  setCurrentView,
  userProfile,
  setUserProfile
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingProfile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingProfile]);

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    if (editName.trim()) {
      const words = editName.trim().split(' ');
      const initials = words.length > 1 
        ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
        : editName.substring(0, 2).toUpperCase();
      
      setUserProfile({
        ...userProfile,
        name: editName.trim(),
        initials
      });
    } else {
      setEditName(userProfile.name); // revert if empty
    }
  };

  const navigate = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close on mobile
  };

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 pt-8 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}`}>
      <div 
        className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsEditingProfile(true)}
        title="Click to edit profile"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/30 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{userProfile.initials}</span>
        </div>
        <div className="flex flex-col min-w-0 pr-2">
          {isEditingProfile ? (
            <input 
              ref={inputRef}
              type="text"
              className="text-sm font-bold text-slate-900 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 outline-none border-b border-indigo-500 w-full"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveProfile}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveProfile()}
            />
          ) : (
            <span className="text-sm font-bold text-slate-900 dark:text-indigo-400 truncate group-hover:underline">{userProfile.name}</span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate">{userProfile.role}</span>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 px-4">
        {selectedReleaseId ? (
          <button 
            onClick={() => {
              if (onBack) onBack();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate('dashboard')}
              className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-r-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </button>
            <button 
              onClick={() => navigate('releases')}
              className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 ${currentView === 'releases' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-r-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <span className="material-symbols-outlined">format_list_bulleted</span>
              Releases
            </button>
            <button 
              onClick={() => navigate('analytics')}
              className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 ${currentView === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-r-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <span className="material-symbols-outlined">bar_chart</span>
              Analytics
            </button>
            <button 
              onClick={() => navigate('settings')}
              className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 ${currentView === 'settings' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-r-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </button>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
