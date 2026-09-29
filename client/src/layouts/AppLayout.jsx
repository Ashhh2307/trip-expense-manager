import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ExpenseDetails from '../components/ExpenseDetails';
import AddExpenseModal from '../components/AddExpenseModal';
import TemplatesModal from '../components/TemplatesModal';
import SavedItinerariesModal from '../components/SavedItinerariesModal';
import EditExpenseModal from '../components/EditExpenseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ReceiptModal from '../components/ReceiptModal';
import ToastNotification from '../components/ToastNotification';

const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 relative overflow-hidden">
      {/* Floating Mobile Sidebar Trigger */}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 p-2.5 bg-white/90 dark:bg-[#111317]/90 text-slate-800 dark:text-white backdrop-blur-md border border-slate-200/90 dark:border-slate-800/80 rounded-2xl shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </button>

      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 h-screen">
        {/* Page Body */}
        <main className="flex-1 flex flex-col min-h-0 w-full h-full">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <ExpenseDetails />
      <AddExpenseModal />
      <TemplatesModal />
      <SavedItinerariesModal />
      <EditExpenseModal />
      <DeleteConfirmModal />
      <ReceiptModal />
      <ToastNotification />
    </div>
  );
};

export default AppLayout;
