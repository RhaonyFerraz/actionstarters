import React, { useEffect } from 'react';
import { X, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: <CheckCircle size={20} className="text-green-500" />,
  warning: <AlertTriangle size={20} className="text-yellow-500" />,
  error: <TrendingDown size={20} className="text-red-500" />,
};

const BORDERS = {
  success: 'border-l-green-500',
  warning: 'border-l-yellow-500',
  error: 'border-l-red-500',
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 border-l-4 ${BORDERS[toast.type]} min-w-[300px] max-w-sm animate-in slide-in-from-right-4 fade-in duration-300`}
    >
      <div className="mt-0.5 shrink-0">{ICONS[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm">{toast.title}</p>
        <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-24 right-4 z-[100] flex flex-col gap-3">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
