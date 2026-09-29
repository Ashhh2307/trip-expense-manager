import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-slate-900 dark:text-emerald-400 mb-2`} />
      {message && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
