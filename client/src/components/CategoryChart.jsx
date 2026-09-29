import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, getCategoryMeta } from '../utils/formatters';
import { getCategoryIcon } from './CategoryBadge';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 dark:bg-slate-800 text-white p-2.5 rounded-xl shadow-float border border-slate-800 dark:border-slate-700 text-xs">
        <p className="font-bold text-slate-100">{data.name}</p>
        <p className="text-emerald-400 font-semibold">{formatCurrency(data.value)}</p>
        <p className="text-slate-400 dark:text-slate-400 text-[11px]">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
        No category breakdown data available yet.
      </div>
    );
  }

  // Filter categories with amount > 0 or at least one non-zero
  const totalAmount = categories.reduce((acc, curr) => acc + curr.amount, 0);
  const pieData = categories
    .filter((cat) => cat.amount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.amount,
      percentage: cat.percentage,
      color: getCategoryMeta(cat.name).chartColor,
    }));

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="h-44 sm:h-48 relative flex items-center justify-center">
        {pieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Total
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
            No expenses logged yet
          </div>
        )}
      </div>

      {/* Category Progress Bars Breakdown */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const meta = getCategoryMeta(cat.name);
          return (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  {getCategoryIcon(cat.name, 'w-3.5 h-3.5 text-slate-500 dark:text-slate-400')}
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(cat.amount)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 min-w-[32px] text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.min(cat.percentage, 100)}%`,
                    backgroundColor: meta.chartColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
