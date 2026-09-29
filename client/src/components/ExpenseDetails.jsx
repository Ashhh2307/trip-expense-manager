import React from 'react';
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Building2,
  Compass,
  FileText,
  Receipt as ReceiptIcon,
  ZoomIn,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

const ExpenseDetails = () => {
  const {
    isDetailsOpen,
    selectedExpense,
    closeDetails,
    openEditModal,
    openDeleteModal,
    openReceiptModal,
  } = useExpenses();

  if (!isDetailsOpen || !selectedExpense) return null;

  return (
    <>
      {/* Backdrop for mobile & small screens */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={closeDetails}
      />

      {/* Slide-over Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-float flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Expense Overview
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Expense Details</h3>
          </div>
          <button
            onClick={closeDetails}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Title & Amount Block */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <CategoryBadge category={selectedExpense.category} size="md" />
              <StatusBadge status={selectedExpense.status} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mt-3">
              {selectedExpense.title}
            </h2>

            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Amount
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(selectedExpense.amount)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Information
            </h4>

            {/* Date */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/70">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Date Logged</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(selectedExpense.date)}
                </p>
              </div>
            </div>

            {/* Merchant */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/70">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Merchant / Vendor</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {selectedExpense.merchant || 'N/A'}
                </p>
              </div>
            </div>

            {/* Trip */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/70">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Associated Trip</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {selectedExpense.trip || 'General'}
                </p>
              </div>
            </div>

            {/* Notes */}
            {selectedExpense.notes && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/70">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Notes &amp; Purpose</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedExpense.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Attached Receipt
            </h4>

            {selectedExpense.receipt ? (
              <div
                onClick={() => openReceiptModal(selectedExpense.receipt)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer shadow-subtle hover:shadow-card transition-all"
              >
                {selectedExpense.receipt.toLowerCase().endsWith('.pdf') ? (
                  <div className="p-6 flex flex-col items-center justify-center bg-rose-50/50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800 rounded-2xl text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2 shadow-xs">
                      <FileText className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      PDF Receipt Document
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Click to open full document
                    </p>
                  </div>
                ) : (
                  <>
                    <img
                      src={selectedExpense.receipt}
                      alt="Receipt Preview"
                      className="w-full h-44 object-cover object-top group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-xs transition-opacity">
                      <ZoomIn className="w-4 h-4" />
                      <span>Click to view full receipt</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-center">
                <ReceiptIcon className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  No receipt document attached
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => openDeleteModal(selectedExpense)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditModal(selectedExpense)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={closeDetails}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseDetails;
