import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const ReceiptModal = () => {
  const { isReceiptModalOpen, activeReceiptUrl, closeReceiptModal } = useExpenses();

  if (!isReceiptModalOpen || !activeReceiptUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-float border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Receipt Viewer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Official expense document preview</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={activeReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={activeReceiptUrl}
              download="receipt"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Download receipt"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={closeReceiptModal}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Display */}
        <div className="p-6 flex items-center justify-center bg-slate-100 dark:bg-slate-950 max-h-[75vh] overflow-auto">
          {activeReceiptUrl.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-[65vh] flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
              <iframe
                src={activeReceiptUrl}
                title="PDF Receipt"
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <img
              src={activeReceiptUrl}
              alt="Expense Receipt"
              className="max-h-[65vh] w-auto object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={closeReceiptModal}
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
