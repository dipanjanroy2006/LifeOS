import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastItem, ToastType } from '../../../contexts/ToastContext';

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/25 bg-emerald-950/20';
      case 'error':
        return 'border-rose-500/25 bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/25 bg-amber-950/20';
      case 'info':
        return 'border-indigo-500/25 bg-indigo-950/20';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg ${getBorderColor(
        toast.type
      )}`}
    >
      <div className="flex items-center gap-3">
        {getIcon(toast.type)}
        <p className="text-xs font-semibold text-zinc-100 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-200 transition-colors pl-3 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
