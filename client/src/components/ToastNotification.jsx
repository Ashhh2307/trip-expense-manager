import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const ToastNotification = () => {
  const { toast, hideToast } = useExpenses();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-float border ${
          isSuccess
            ? 'bg-slate-900 text-white border-slate-800'
            : isError
            ? 'bg-rose-900 text-white border-rose-800'
            : 'bg-slate-800 text-white border-slate-700'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}

        <p className="text-sm font-medium pr-2">{toast.message}</p>

        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
