import React from 'react';
import { ChevronRight, Paperclip } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

const ExpenseCard = ({ expense, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card transition-all cursor-pointer space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {formatDate(expense.date)}
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug mt-0.5">
            {expense.title}
          </h4>
          {expense.merchant && expense.merchant !== 'N/A' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{expense.merchant}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(expense.amount)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CategoryBadge category={expense.category} size="sm" />
          {expense.receipt && (
            <span
              className="inline-flex items-center p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              title="Receipt attached"
            >
              <Paperclip className="w-3 h-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={expense.status} />
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
