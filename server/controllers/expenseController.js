const fs = require('fs');
const path = require('path');
const expenseService = require('../services/expenseService');

// @desc    Get all expenses for current user with filtering, search, and sorting
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      trip,
      startDate,
      endDate,
      sortBy = 'newest',
    } = req.query;

    const expenses = await expenseService.getExpenses({
      userId: req.user._id,
      search,
      category,
      status,
      trip,
      startDate,
      endDate,
      sortBy,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message,
    });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user._id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Error fetching expense by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense details',
      error: error.message,
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      merchant,
      date,
      trip,
      status,
      notes,
    } = req.body;

    if (!title || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an expense title and a valid amount',
      });
    }

    let receiptPath = req.body.receipt || null;
    if (req.file) {
      receiptPath = `/uploads/${req.file.filename}`;
    }

    const expense = await expenseService.createExpense({
      userId: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Other',
      merchant: merchant ? merchant.trim() : 'N/A',
      date: date ? new Date(date) : new Date(),
      trip: trip ? trip.trim() : 'General',
      status: status || 'Pending',
      receipt: receiptPath,
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create expense',
    });
  }
};

// @desc    Update existing expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user._id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or access denied',
      });
    }

    const updatePayload = { ...req.body };

    // If new file is uploaded
    if (req.file) {
      if (expense.receipt && expense.receipt.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', expense.receipt);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) console.warn('Could not delete old receipt file:', err.message);
          });
        }
      }
      updatePayload.receipt = `/uploads/${req.file.filename}`;
    } else if (req.body.removeReceipt === 'true' || req.body.receipt === '' || req.body.receipt === 'null') {
      if (expense.receipt && expense.receipt.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', expense.receipt);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) console.warn('Could not delete old receipt file:', err.message);
          });
        }
      }
      updatePayload.receipt = null;
    }

    const updatedExpense = await expenseService.updateExpense(
      req.params.id,
      req.user._id,
      updatePayload
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update expense',
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user._id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or access denied',
      });
    }

    // Clean up local receipt file if exists
    if (expense.receipt && expense.receipt.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', expense.receipt);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.warn('Could not delete receipt file on expense delete:', err.message);
        });
      }
    }

    await expenseService.deleteExpense(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete expense',
    });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
