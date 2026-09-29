import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  Compass,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowRight,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import ExpenseChart from '../components/ExpenseChart';
import CategoryChart from '../components/CategoryChart';
import ExpenseTable from '../components/ExpenseTable';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { stats, statsLoading, openDetails } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const summary = stats?.summary || {
    totalExpenses: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    totalTrips: 0,
  };

  const categories = stats?.categories || [];
  const monthlyTrends = stats?.monthlyTrends || [];
  const recentExpenses = stats?.recentExpenses || [];

  if (statsLoading && !stats) {
    return (
      <div className="py-20 flex items-center justify-center">
        <LoadingSpinner message="Calculating dashboard statistics..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Traveler'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Here's an overview of your active travel expenditures and approvals.
          </p>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.totalExpenses)}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1">
              All logged travel expenses
            </p>
          </div>
        </div>

        {/* Pending Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.pendingAmount)}
            </h3>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium mt-1">
              Awaiting manager review
            </p>
          </div>
        </div>

        {/* Approved Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.approvedAmount)}
            </h3>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-1">
              Reimbursed &amp; verified
            </p>
          </div>
        </div>

        {/* Total Trips */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Total Trips
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {summary.totalTrips}
            </h3>
            <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80 font-medium mt-1">
              Associated travel itineraries
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Section: Expense Overview & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spending Overview Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Expense Overview
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly travel expenditure timeline
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              Live Data
            </span>
          </div>

          <ExpenseChart data={monthlyTrends} />
        </div>

        {/* Right 1 Col: Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Expense Categories
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribution across categories
              </p>
            </div>
          </div>

          <CategoryChart categories={categories} />
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Expenses
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest expenditures logged to your account
            </p>
          </div>

          <button
            onClick={() => navigate('/expenses')}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span>View all expenses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ExpenseTable
          expenses={recentExpenses}
          onRowClick={(exp) => openDetails(exp)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
