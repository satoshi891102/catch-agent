-- Vigil Database Schema
-- Run this in Supabase SQL Editor to set up the entire database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ USERS ═══
-- Extended profile beyond Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'past_due', 'canceled', 'trialing')),
  subscription_plan TEXT CHECK (subscription_plan IN ('weekly', 'monthly', 'confrontation')),
  message_count INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ CASE FILES ═══
CREATE TABLE IF NOT EXISTS public.case_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'paused', 'closed')),
  phase INTEGER NOT NULL DEFAULT 1 CHECK (phase BETWEEN 1 AND 5),
  suspicion_level TEXT NOT NULL DEFAULT 'unknown' CHECK (suspicion_level IN ('unknown', 'low', 'moderate', 'high', 'confirmed')),
  investigation_progress INTEGER NOT NULL DEFAULT 5 CHECK (investigation_progress BETWEEN 0 AND 100),
  -- Partner profile (JSONB for flexibility)
  partner_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ EVIDENCE ITEMS ═══
CREATE TABLE IF NOT EXISTS public.evidence_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_file_id UUID NOT NULL REFERENCES public.case_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('digital', 'schedule', 'financial', 'communication', 'behavioral')),
  description TEXT NOT NULL,
  date_observed TEXT,
  significance_level TEXT NOT NULL DEFAULT 'medium' CHECK (significance_level IN ('low', 'medium', 'high', 'critical')),
  module_source TEXT CHECK (module_source IN ('A', 'B', 'C', 'D', 'E')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ CONVERSATIONS ═══
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_file_id UUID REFERENCES public.case_files(id) ON DELETE SET NULL,
  title TEXT DEFAULT 'Investigation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ MESSAGES ═══
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT, -- 'haiku' | 'sonnet'
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ SUBSCRIPTIONS ═══
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('weekly', 'monthly', 'confrontation')),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ INDEXES ═══
CREATE INDEX IF NOT EXISTS idx_case_files_user ON public.case_files(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON public.evidence_items(case_file_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user ON public.evidence_items(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);

-- ═══ ROW LEVEL SECURITY ═══
-- Users can only access their own data

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Case files: users can CRUD their own
CREATE POLICY "Users can view own case files" ON public.case_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create case files" ON public.case_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own case files" ON public.case_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own case files" ON public.case_files FOR DELETE USING (auth.uid() = user_id);

-- Evidence: users can CRUD their own
CREATE POLICY "Users can view own evidence" ON public.evidence_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create evidence" ON public.evidence_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evidence" ON public.evidence_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evidence" ON public.evidence_items FOR DELETE USING (auth.uid() = user_id);

-- Conversations: users can CRUD their own
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages: users can CRUD their own
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions: users can view their own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ═══ TRIGGERS ═══

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER case_files_updated_at BEFORE UPDATE ON public.case_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER evidence_items_updated_at BEFORE UPDATE ON public.evidence_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══ SERVICE ROLE POLICIES ═══
-- For webhook/API operations that need to bypass RLS (e.g., Stripe webhooks)
CREATE POLICY "Service role full access to profiles" ON public.profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to subscriptions" ON public.subscriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to case_files" ON public.case_files FOR ALL USING (auth.role() = 'service_role');

-- ═══ DONE ═══
-- After running this schema:
-- 1. Enable Email + Anonymous auth in Supabase Auth settings
-- 2. Copy your Supabase URL and anon key to .env.local
-- 3. Copy your service role key for webhook operations
-- 4. Set up Stripe webhook to /api/stripe/webhook
