import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-float">
        <span className="text-6xl font-black text-slate-200 dark:text-slate-800">404</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          The travel destination or page you are looking for doesn't exist.
        </p>
        <Link
          to="/ai-chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to AI Travel Assistant</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
