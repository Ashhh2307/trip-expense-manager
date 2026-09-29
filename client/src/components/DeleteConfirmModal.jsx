import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';

const DeleteConfirmModal = () => {
  const { isDeleteModalOpen, expenseToDelete, closeDeleteModal, deleteExpense } =
    useExpenses();

  if (!isDeleteModalOpen || !expenseToDelete) return null;

  const handleDelete = async () => {
    await deleteExpense(expenseToDelete._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-float border border-slate-200 dark:border-slate-800">
        <button
          onClick={closeDeleteModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Delete Expense
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900 dark:text-white">"{expenseToDelete.title}"</strong> (
          {formatCurrency(expenseToDelete.amount)})? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-colors shadow-sm"
          >
            Delete Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
