import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getExpenses as apiGetExpenses,
  getDashboardStats as apiGetDashboardStats,
  createExpense as apiCreateExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
} from '../services/expenseService';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Modals & Drawer state
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialData, setAddModalInitialData] = useState(null);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptUrl, setActiveReceiptUrl] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    trip: 'All',
    sortBy: 'newest',
    startDate: '',
    endDate: '',
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch expenses with current or custom filters
  const fetchExpenses = useCallback(
    async (customFilters = {}) => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const queryParams = { ...filters, ...customFilters };
        const res = await apiGetExpenses(queryParams);
        if (res.success && res.data) {
          setExpenses(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        showToast(
          error.response?.data?.message || 'Failed to load expenses',
          'error'
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, filters, showToast]
  );

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setStatsLoading(true);
    try {
      const res = await apiGetDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
      fetchStats();
    } else {
      setExpenses([]);
      setStats(null);
    }
  }, [isAuthenticated, fetchExpenses, fetchStats]);

  // Add Expense
  const addExpense = async (formData) => {
    try {
      const res = await apiCreateExpense(formData);
      if (res.success && res.data) {
        showToast('Expense created successfully!', 'success');
        fetchExpenses();
        fetchStats();
        setIsAddModalOpen(false);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Could not add expense' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add expense';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Edit Expense
  const editExpense = async (id, formData) => {
    try {
      const res = await apiUpdateExpense(id, formData);
      if (res.success && res.data) {
        showToast('Expense updated successfully!', 'success');
        // Update current list immediately
        setExpenses((prev) =>
          prev.map((item) => (item._id === id ? res.data : item))
        );
        if (selectedExpense && selectedExpense._id === id) {
          setSelectedExpense(res.data);
        }
        fetchStats();
        setIsEditModalOpen(false);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Could not update expense' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update expense';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      const res = await apiDeleteExpense(id);
      if (res.success) {
        showToast('Expense deleted successfully', 'success');
        setExpenses((prev) => prev.filter((item) => item._id !== id));
        if (selectedExpense && selectedExpense._id === id) {
          setIsDetailsOpen(false);
          setSelectedExpense(null);
        }
        fetchStats();
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
        return { success: true };
      }
      return { success: false, message: res.message || 'Could not delete expense' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete expense';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // UI Handlers
  const openDetails = (expense) => {
    setSelectedExpense(expense);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedExpense(null);
  };

  const openAddModal = (initialData = null) => {
    setAddModalInitialData(initialData);
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddModalInitialData(null);
  };

  const openTemplatesModal = () => setIsTemplatesModalOpen(true);
  const closeTemplatesModal = () => setIsTemplatesModalOpen(false);

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setExpenseToDelete(null);
  };

  const openReceiptModal = (receiptUrl) => {
    setActiveReceiptUrl(receiptUrl);
    setIsReceiptModalOpen(true);
  };
  const closeReceiptModal = () => {
    setActiveReceiptUrl(null);
    setIsReceiptModalOpen(false);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      status: 'All',
      trip: 'All',
      sortBy: 'newest',
      startDate: '',
      endDate: '',
    });
  };

  const value = {
    expenses,
    loading,
    stats,
    statsLoading,
    selectedExpense,
    isDetailsOpen,
    isAddModalOpen,
    addModalInitialData,
    isTemplatesModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    expenseToDelete,
    isReceiptModalOpen,
    activeReceiptUrl,
    filters,
    toast,
    fetchExpenses,
    fetchStats,
    addExpense,
    editExpense,
    deleteExpense,
    openDetails,
    closeDetails,
    openAddModal,
    closeAddModal,
    openTemplatesModal,
    closeTemplatesModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openReceiptModal,
    closeReceiptModal,
    updateFilter,
    resetFilters,
    showToast,
    hideToast,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
