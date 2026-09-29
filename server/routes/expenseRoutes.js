const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All expense routes require authentication
router.use(protect);

router
  .route('/')
  .get(getExpenses)
  .post(upload.single('receipt'), createExpense);

router
  .route('/:id')
  .get(getExpenseById)
  .put(upload.single('receipt'), updateExpense)
  .delete(deleteExpense);

module.exports = router;
