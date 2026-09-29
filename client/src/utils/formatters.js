export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCategoryMeta = (category) => {
  switch (category) {
    case 'Flight':
      return {
        label: 'Flight',
        color: 'text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/60 dark:border-sky-800/80',
        dotColor: 'bg-sky-500',
        chartColor: '#0284c7',
      };
    case 'Lodging':
      return {
        label: 'Lodging',
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/60 dark:border-indigo-800/80',
        dotColor: 'bg-indigo-500',
        chartColor: '#6366f1',
      };
    case 'Meals':
      return {
        label: 'Meals',
        color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800/80',
        dotColor: 'bg-amber-500',
        chartColor: '#f59e0b',
      };
    case 'Transit':
      return {
        label: 'Transit',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800/80',
        dotColor: 'bg-emerald-500',
        chartColor: '#10b981',
      };
    case 'Other':
    default:
      return {
        label: 'Other',
        color: 'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800/80 dark:border-slate-700',
        dotColor: 'bg-slate-500',
        chartColor: '#64748b',
      };
  }
};

export const getStatusMeta = (status) => {
  switch (status) {
    case 'Approved':
      return {
        label: 'Approved',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/80',
        dotClass: 'bg-emerald-500',
      };
    case 'Pending':
      return {
        label: 'Pending',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/80',
        dotClass: 'bg-amber-500',
      };
    case 'Rejected':
      return {
        label: 'Rejected',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/80',
        dotClass: 'bg-rose-500',
      };
    default:
      return {
        label: status || 'Pending',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dotClass: 'bg-slate-400',
      };
  }
};
