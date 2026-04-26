import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error';

interface ToastOptions {
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback(({ message, type = 'success' }: ToastOptions) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl px-5 py-4 shadow-xl flex items-center gap-3 animate-[fade-in_0.3s_ease-out]">
          {toast.type === 'success' ? (
            <span className="material-symbols-outlined text-green-400">check_circle</span>
          ) : (
            <span className="material-symbols-outlined text-red-400">error</span>
          )}
          <span className="text-slate-100 text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export default ToastContext;
