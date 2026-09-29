-- ====================================================================
-- TravelWise - Supabase Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor -> New Query
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 3. Create Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  merchant TEXT DEFAULT 'N/A',
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trip TEXT DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'Pending',
  receipt TEXT DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast Indexes for Filtering and Sorting
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses (date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses (status);
CREATE INDEX IF NOT EXISTS idx_expenses_trip ON public.expenses (trip);

-- 4. Create Saved Itineraries Table (Optional Cloud Storage for AI Itineraries)
CREATE TABLE IF NOT EXISTS public.saved_itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  duration TEXT,
  total_budget NUMERIC(12, 2),
  budget_breakdown JSONB DEFAULT '[]'::jsonb,
  days JSONB DEFAULT '[]'::jsonb,
  tips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON public.saved_itineraries (user_id);

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_itineraries ENABLE ROW LEVEL SECURITY;

-- Allow full access for backend service role & authenticated API keys
DROP POLICY IF EXISTS "Allow backend API access to users" ON public.users;
CREATE POLICY "Allow backend API access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow backend API access to expenses" ON public.expenses;
CREATE POLICY "Allow backend API access to expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow backend API access to saved_itineraries" ON public.saved_itineraries;
CREATE POLICY "Allow backend API access to saved_itineraries" ON public.saved_itineraries FOR ALL USING (true) WITH CHECK (true);
