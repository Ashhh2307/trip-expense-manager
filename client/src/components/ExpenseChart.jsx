import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-xl shadow-float border border-slate-800 dark:border-slate-700 text-xs">
        <p className="font-bold text-slate-300 dark:text-slate-200 mb-1">{label}</p>
        <div className="space-y-0.5">
          <p className="text-emerald-400 font-semibold">
            Total: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.count !== undefined && (
            <p className="text-slate-400 text-[11px]">
              {payload[0].payload.count} expenses logged
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
        No spending trend data available yet.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map((item) => ({
    name: item.shortMonth || item.month,
    total: item.total || 0,
    approved: item.approved || 0,
    pending: item.pending || 0,
    count: item.count || 0,
  }));

  const strokeColor = isDark ? '#10b981' : '#0f172a';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={isDark ? 0.35 : 0.25} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickColor, fontSize: 11 }}
            tickFormatter={(val) => (val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke={strokeColor}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
