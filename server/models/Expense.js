const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Flight', 'Lodging', 'Meals', 'Transit', 'Other'],
        message: '{VALUE} is not a supported category',
      },
      default: 'Other',
    },
    merchant: {
      type: String,
      trim: true,
      default: 'N/A',
      maxlength: [100, 'Merchant name cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify an expense date'],
      default: Date.now,
    },
    trip: {
      type: String,
      trim: true,
      default: 'London Q4 Review',
      maxlength: [100, 'Trip name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
    receipt: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Add text indexing for search across title, merchant, trip, and notes
expenseSchema.index({ title: 'text', merchant: 'text', trip: 'text', notes: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
