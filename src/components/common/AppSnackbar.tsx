import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface SnackbarProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const AppSnackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-emerald-50 border-emerald-700/50 shadow-emerald-950/20',
    error: 'bg-rose-900/90 text-rose-50 border-rose-700/50 shadow-rose-950/20',
    info: 'bg-slate-900/90 text-slate-50 border-slate-700/50 shadow-slate-950/20',
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-lg ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0 opacity-90" />
        <p className="text-sm font-medium flex-1 tracking-tight leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};
