import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ExpenseTable from '../components/ExpenseTable';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
];

const Expenses = () => {
  const {
    expenses,
    loading,
    filters,
    updateFilter,
    fetchExpenses,
    openDetails,
    openAddModal,
    openTemplatesModal,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState(filters.status || 'All');

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    updateFilter('status', tabValue);
  };

  // Filtered expenses based on active tab and search
  const displayedExpenses = expenses.filter((exp) => {
    if (activeTab !== 'All' && exp.status !== activeTab) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Expenses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Manage and track your travel expenditures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchExpenses()}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs"
            title="Refresh expense records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Control Bar: Tabs, Search, and Filters */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-100/90 dark:bg-slate-800 rounded-xl w-fit">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.value;
            const count =
              tab.value === 'All'
                ? expenses.length
                : expenses.filter((e) => e.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SearchBar
            value={filters.search}
            onChange={(val) => updateFilter('search', val)}
            onClear={() => updateFilter('search', '')}
            placeholder="Search by title, merchant, trip..."
          />
          <FilterDropdown />
        </div>
      </div>

      {/* Main Expense Table */}
      {loading && expenses.length === 0 ? (
        <div className="py-20 flex items-center justify-center">
          <LoadingSpinner message="Loading travel expenses..." size="large" />
        </div>
      ) : (
        <ExpenseTable
          expenses={displayedExpenses}
          onRowClick={(exp) => openDetails(exp)}
          emptyAction={openAddModal}
        />
      )}
    </div>
  );
};

export default Expenses;
