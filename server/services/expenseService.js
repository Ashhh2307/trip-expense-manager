const { supabase, isSupabaseConfigured, inMemoryStore } = require('../config/supabase');

/**
 * Format expense object for seamless frontend compatibility (_id and id, userId and user_id)
 */
const formatExpense = (exp) => {
  if (!exp) return null;
  const id = exp.id || exp._id;
  const userId = exp.user_id || exp.userId;
  return {
    ...exp,
    _id: id,
    id: id,
    userId: userId,
    user_id: userId,
    amount: Number(exp.amount),
    date: exp.date || exp.created_at,
    createdAt: exp.created_at || exp.createdAt || new Date().toISOString(),
    updatedAt: exp.updated_at || exp.updatedAt || new Date().toISOString(),
  };
};

const isTableMissingError = (err) => {
  return err && (err.message?.includes('schema cache') || err.message?.includes('does not exist') || err.code === 'PGRST204' || err.code === 'PGRST205' || err.code === '42P01');
};

/**
 * Get expenses with search, filtering, and sorting
 */
const getExpenses = async ({
  userId,
  search,
  category,
  status,
  trip,
  startDate,
  endDate,
  sortBy = 'newest',
}) => {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('expenses').select('*').eq('user_id', userId);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (trip && trip !== 'All') {
        query = query.eq('trip', trip);
      }
      if (startDate) {
        query = query.gte('date', new Date(startDate).toISOString());
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('date', end.toISOString());
      }
      if (search && search.trim()) {
        const s = `%${search.trim()}%`;
        query = query.or(`title.ilike.${s},merchant.ilike.${s},trip.ilike.${s},notes.ilike.${s},category.ilike.${s}`);
      }

      if (sortBy === 'oldest') {
        query = query.order('date', { ascending: true });
      } else if (sortBy === 'highest') {
        query = query.order('amount', { ascending: false });
      } else if (sortBy === 'lowest') {
        query = query.order('amount', { ascending: true });
      } else {
        query = query.order('date', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase getExpenses error:', error);
          throw new Error(error.message);
        }
      } else {
        return (data || []).map(formatExpense);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // In-memory fallback
  let items = inMemoryStore.expenses.filter((e) => e.user_id === userId || e.userId === userId);

  if (category && category !== 'All') {
    items = items.filter((e) => e.category === category);
  }
  if (status && status !== 'All') {
    items = items.filter((e) => e.status === status);
  }
  if (trip && trip !== 'All') {
    items = items.filter((e) => e.trip === trip);
  }
  if (startDate) {
    const start = new Date(startDate).getTime();
    items = items.filter((e) => new Date(e.date).getTime() >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    items = items.filter((e) => new Date(e.date).getTime() <= end.getTime());
  }
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    items = items.filter(
      (e) =>
        (e.title && e.title.toLowerCase().includes(term)) ||
        (e.merchant && e.merchant.toLowerCase().includes(term)) ||
        (e.trip && e.trip.toLowerCase().includes(term)) ||
        (e.notes && e.notes.toLowerCase().includes(term)) ||
        (e.category && e.category.toLowerCase().includes(term))
    );
  }

  if (sortBy === 'oldest') {
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'highest') {
    items.sort((a, b) => b.amount - a.amount);
  } else if (sortBy === 'lowest') {
    items.sort((a, b) => a.amount - b.amount);
  } else {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return items.map(formatExpense);
};

/**
 * Get single expense by ID and userId
 */
const getExpenseById = async (id, userId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase getExpenseById error:', error);
          throw new Error(error.message);
        }
      } else if (data) {
        return formatExpense(data);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  const found = inMemoryStore.expenses.find(
    (e) => (e.id === id || e._id === id) && (e.user_id === userId || e.userId === userId)
  );
  return formatExpense(found);
};

/**
 * Create a new expense
 */
const createExpense = async ({
  userId,
  title,
  amount,
  category = 'Other',
  merchant = 'N/A',
  date,
  trip = 'General',
  status = 'Pending',
  receipt = null,
  notes = '',
}) => {
  const expenseData = {
    user_id: userId,
    title: title.trim(),
    amount: Number(amount),
    category,
    merchant: merchant ? merchant.trim() : 'N/A',
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    trip: trip ? trip.trim() : 'General',
    status: status || 'Pending',
    receipt: receipt || null,
    notes: notes ? notes.trim() : '',
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase createExpense error:', error);
          throw new Error(error.message);
        }
      } else {
        return formatExpense(data);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // In-memory fallback
  const newExp = {
    ...expenseData,
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    _id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inMemoryStore.expenses.unshift(newExp);
  return formatExpense(newExp);
};

/**
 * Update an existing expense
 */
const updateExpense = async (id, userId, updates) => {
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) updatePayload.title = updates.title.trim();
  if (updates.amount !== undefined) updatePayload.amount = Number(updates.amount);
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.merchant !== undefined) updatePayload.merchant = updates.merchant.trim();
  if (updates.date !== undefined) updatePayload.date = new Date(updates.date).toISOString();
  if (updates.trip !== undefined) updatePayload.trip = updates.trip.trim();
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.receipt !== undefined) updatePayload.receipt = updates.receipt;
  if (updates.notes !== undefined) updatePayload.notes = updates.notes.trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase updateExpense error:', error);
          throw new Error(error.message);
        }
      } else {
        return formatExpense(data);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // In-memory fallback
  const idx = inMemoryStore.expenses.findIndex(
    (e) => (e.id === id || e._id === id) && (e.user_id === userId || e.userId === userId)
  );
  if (idx === -1) return null;

  inMemoryStore.expenses[idx] = {
    ...inMemoryStore.expenses[idx],
    ...updatePayload,
  };
  return formatExpense(inMemoryStore.expenses[idx]);
};

/**
 * Delete an expense
 */
const deleteExpense = async (id, userId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase deleteExpense error:', error);
          throw new Error(error.message);
        }
      } else {
        return true;
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  const idx = inMemoryStore.expenses.findIndex(
    (e) => (e.id === id || e._id === id) && (e.user_id === userId || e.userId === userId)
  );
  if (idx !== -1) {
    inMemoryStore.expenses.splice(idx, 1);
    return true;
  }
  return false;
};

/**
 * Get all expenses for a user (for stats aggregation)
 */
const getAllUserExpenses = async (userId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `expenses` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase getAllUserExpenses error:', error);
          throw new Error(error.message);
        }
      } else {
        return (data || []).map(formatExpense);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  return inMemoryStore.expenses
    .filter((e) => e.user_id === userId || e.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(formatExpense);
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getAllUserExpenses,
};
