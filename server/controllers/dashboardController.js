const expenseService = require('../services/expenseService');

// @desc    Get aggregated dashboard statistics for current user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all user expenses from Supabase
    const expenses = await expenseService.getAllUserExpenses(userId);

    // 1. Calculate Summary Cards
    let totalExpenses = 0;
    let pendingAmount = 0;
    let approvedAmount = 0;
    let rejectedAmount = 0;
    const tripsSet = new Set();

    const categoryTotals = {
      Flight: 0,
      Lodging: 0,
      Meals: 0,
      Transit: 0,
      Other: 0,
    };

    const categoryCounts = {
      Flight: 0,
      Lodging: 0,
      Meals: 0,
      Transit: 0,
      Other: 0,
    };

    expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      totalExpenses += amount;

      if (exp.status === 'Approved') {
        approvedAmount += amount;
      } else if (exp.status === 'Pending') {
        pendingAmount += amount;
      } else if (exp.status === 'Rejected') {
        rejectedAmount += amount;
      }

      if (exp.trip && exp.trip.trim()) {
        tripsSet.add(exp.trip.trim());
      }

      const cat = exp.category || 'Other';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += amount;
        categoryCounts[cat] += 1;
      } else {
        categoryTotals.Other += amount;
        categoryCounts.Other += 1;
      }
    });

    // 2. Format Category Breakdown
    const categories = Object.keys(categoryTotals).map((name) => {
      const amount = categoryTotals[name];
      const count = categoryCounts[name];
      const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
      return {
        name,
        amount: Number(amount.toFixed(2)),
        count,
        percentage: Number(percentage),
      };
    });

    // 3. Monthly Spending Trend (Last 6-12 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month: key,
          shortMonth: monthNames[d.getMonth()],
          year: d.getFullYear(),
          timestamp: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
          total: 0,
          approved: 0,
          pending: 0,
          count: 0,
        };
      }
      monthlyMap[key].total += Number(exp.amount) || 0;
      if (exp.status === 'Approved') monthlyMap[key].approved += Number(exp.amount) || 0;
      if (exp.status === 'Pending') monthlyMap[key].pending += Number(exp.amount) || 0;
      monthlyMap[key].count += 1;
    });

    const monthlyTrends = Object.values(monthlyMap).sort((a, b) => a.timestamp - b.timestamp);

    // If no monthly trends exist, supply placeholder months with 0
    if (monthlyTrends.length === 0) {
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyTrends.push({
          month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
          shortMonth: monthNames[d.getMonth()],
          year: d.getFullYear(),
          timestamp: d.getTime(),
          total: 0,
          approved: 0,
          pending: 0,
          count: 0,
        });
      }
    }

    // 4. Recent 5 Expenses
    const recentExpenses = expenses.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalExpenses: Number(totalExpenses.toFixed(2)),
          pendingAmount: Number(pendingAmount.toFixed(2)),
          approvedAmount: Number(approvedAmount.toFixed(2)),
          rejectedAmount: Number(rejectedAmount.toFixed(2)),
          totalTrips: tripsSet.size,
          totalExpenseCount: expenses.length,
        },
        categories,
        monthlyTrends,
        recentExpenses,
      },
    });
  } catch (error) {
    console.error('Error computing dashboard statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
