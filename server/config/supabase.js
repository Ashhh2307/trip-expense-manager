const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

let supabase = null;
let isSupabaseConfigured = false;

if (
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    isSupabaseConfigured = true;
    const isSecretKey =
      supabaseKey.startsWith('sb_secret_') ||
      supabaseKey.includes('service_role');
    console.log(
      `✅ Supabase Client initialized with ${
        isSecretKey ? 'Secret Admin Key' : 'Publishable Key'
      } (URL: ${supabaseUrl})`
    );
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('\n-------------------------------------------------------------');
  console.log('⚡ SUPABASE BACKEND READY');
  console.log('👉 To connect your live Supabase database:');
  console.log('   1. Create a project at https://supabase.com');
  console.log('   2. Run server/supabase_schema.sql in Supabase SQL Editor');
  console.log('   3. Set SUPABASE_URL and SUPABASE_KEY in server/.env');
  console.log('-------------------------------------------------------------\n');
}

/**
 * In-memory fallback repository when Supabase credentials are not yet added to .env
 */
const inMemoryStore = {
  users: [],
  expenses: [],
  savedItineraries: [],
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  inMemoryStore,
};
