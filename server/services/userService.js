const bcrypt = require('bcryptjs');
const { supabase, isSupabaseConfigured, inMemoryStore } = require('../config/supabase');

/**
 * Normalize user object so both `id` and `_id` are available
 */
const formatUser = (user, includePassword = false) => {
  if (!user) return null;
  const formatted = {
    ...user,
    _id: user.id || user._id,
    id: user.id || user._id,
  };
  if (!includePassword) {
    delete formatted.password;
  }
  return formatted;
};

const isTableMissingError = (err) => {
  return (
    err &&
    (err.message?.includes('schema cache') ||
      err.message?.includes('does not exist') ||
      err.code === 'PGRST204' ||
      err.code === 'PGRST205' ||
      err.code === '42P01')
  );
};

/**
 * Find user by email (checks public.users and auth.users)
 */
const findByEmail = async (email, includePassword = false) => {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `users` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase findByEmail error:', error);
          throw new Error(error.message);
        }
      } else if (data) {
        return formatUser(data, includePassword);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // Fallback to memory store
  const user = inMemoryStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  return formatUser(user, includePassword);
};

/**
 * Find user by ID
 */
const findById = async (id, includePassword = false) => {
  if (!id) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `users` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase findById error:', error);
          throw new Error(error.message);
        }
      } else if (data) {
        return formatUser(data, includePassword);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // Fallback to memory store
  const user = inMemoryStore.users.find((u) => u.id === id || u._id === id);
  return formatUser(user, includePassword);
};

/**
 * Create a new user in BOTH Supabase Auth (`auth.users`) and Database Table (`public.users`)
 */
const createUser = async ({ name, email, password }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (isSupabaseConfigured && supabase) {
    let authUserId = null;

    // 1. Create in Supabase Auth (appears in Authentication -> Users tab)
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: password,
        email_confirm: true,
        user_metadata: { name: name.trim() },
      });

      if (!authError && authData && authData.user) {
        authUserId = authData.user.id;
        console.log(`✅ User registered in Supabase Auth tab: ${normalizedEmail} (ID: ${authUserId})`);
      } else if (authError) {
        console.warn('Supabase Auth admin notice:', authError.message);
      }
    } catch (authErr) {
      console.warn('Supabase Auth admin exception:', authErr.message);
    }

    // 2. Insert into public.users table (appears in Table Editor -> users)
    try {
      const payload = {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      };
      if (authUserId) {
        payload.id = authUserId;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('⚠️ Supabase `users` table not found. Please run server/supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.error('Supabase createUser error:', error);
          throw new Error(error.message);
        }
      } else {
        return formatUser(data, false);
      }
    } catch (err) {
      if (!isTableMissingError(err)) throw err;
    }
  }

  // Fallback to memory store
  const newUser = {
    id: `user-${Date.now()}`,
    _id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inMemoryStore.users.push(newUser);
  return formatUser(newUser, false);
};

/**
 * Verify plain password against hashed password
 */
const matchPassword = async (enteredPassword, storedHashedPassword) => {
  if (!enteredPassword || !storedHashedPassword) return false;
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  matchPassword,
};
