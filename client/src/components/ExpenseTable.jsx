import React from 'react';
import { ChevronRight, Paperclip, Plus, Inbox } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import ExpenseCard from './ExpenseCard';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseTable = ({ expenses = [], onRowClick, emptyAction }) => {
  const { openAddModal } = useExpenses();

  if (!expenses || expenses.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          No expenses found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          There are no expenses matching your current filters. Try changing filters or add a new expense.
        </p>
        <button
          onClick={emptyAction || openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (hidden on md and up) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense._id}
            expense={expense}
            onClick={() => onRowClick && onRowClick(expense)}
          />
        ))}
      </div>

      {/* Desktop / Tablet Table View (hidden on small screens) */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  onClick={() => onRowClick && onRowClick(expense)}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Date */}
                  <td className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(expense.date)}
                  </td>

                  {/* Title & Merchant */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {expense.title}
                        </p>
                        {expense.merchant && expense.merchant !== 'N/A' && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {expense.merchant}
                          </p>
                        )}
                      </div>
                      {expense.receipt && (
                        <span
                          className="p-1 text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md"
                          title="Receipt attached"
                        >
                          <Paperclip className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <CategoryBadge category={expense.category} size="sm" />
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6 text-right whitespace-nowrap font-extrabold text-slate-900 dark:text-white text-xs">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <StatusBadge status={expense.status} />
                  </td>

                  {/* Chevron Action */}
                  <td className="py-4 px-4 text-right">
                    <span className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors inline-flex">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
