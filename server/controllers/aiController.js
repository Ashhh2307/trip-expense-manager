const { parseExpenseMessage } = require('../utils/aiParser');
const expenseService = require('../services/expenseService');

// @desc    Parse natural language expense message
// @route   POST /api/ai/parse-expense
// @access  Private
const parseExpense = async (req, res) => {
  try {
    const { message, autoCreate = false, trip } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message describing the expense',
      });
    }

    const parsedData = await parseExpenseMessage(message);

    if (trip) {
      parsedData.trip = trip;
    }

    // If autoCreate is true and parsing was complete with a valid amount, save directly
    let createdExpense = null;
    if (autoCreate && parsedData.isComplete && parsedData.amount > 0) {
      createdExpense = await expenseService.createExpense({
        userId: req.user._id,
        title: parsedData.title,
        amount: parsedData.amount,
        category: parsedData.category,
        merchant: parsedData.merchant,
        date: parsedData.date ? new Date(parsedData.date) : new Date(),
        trip: parsedData.trip || 'General',
        status: 'Pending',
        notes: parsedData.notes || `AI logged: ${message}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense message parsed successfully',
      data: {
        ...parsedData,
        createdExpense,
      },
    });
  } catch (error) {
    console.error('Error in AI expense parsing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse expense message',
      error: error.message,
    });
  }
};

module.exports = {
  parseExpense,
};
