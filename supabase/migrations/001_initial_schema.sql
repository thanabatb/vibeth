-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  facebook_url TEXT,
  line_id TEXT,
  contact_is_public BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  screenshot_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'submitted' CHECK (source IN ('scraped', 'submitted')),
  source_fb_comment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claim requests
CREATE TABLE claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  claimer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PDPA consent log
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT
);

-- Stats cache (updated by daily cron)
CREATE TABLE stats_cache (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed stats_cache keys
INSERT INTO stats_cache (key, value) VALUES
  ('total_projects', 0),
  ('total_builders', 0),
  ('total_categories', 0);

-- updated_at trigger for projects
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Full-text search index on projects
CREATE INDEX projects_search_idx ON projects USING GIN (
  to_tsvector('simple', name || ' ' || COALESCE(description, ''))
);

-- Index for gallery queries
CREATE INDEX projects_category_idx ON projects(category);
CREATE INDEX projects_owner_idx ON projects(owner_id);
CREATE INDEX projects_created_idx ON projects(created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- profiles: public read, owner write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- projects: public read, owner write (or null owner for scraped)
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_owner_insert" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "projects_owner_update" ON projects FOR UPDATE USING (auth.uid() = owner_id);

-- claim_requests: owner only
CREATE POLICY "claims_owner_read" ON claim_requests FOR SELECT USING (auth.uid() = claimer_id);
CREATE POLICY "claims_owner_insert" ON claim_requests FOR INSERT WITH CHECK (auth.uid() = claimer_id);

-- user_consents: owner only
CREATE POLICY "consents_owner_read" ON user_consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "consents_owner_insert" ON user_consents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consents_owner_update" ON user_consents FOR UPDATE USING (auth.uid() = user_id);

-- stats_cache: public read only (writes via service role cron)
CREATE POLICY "stats_public_read" ON stats_cache FOR SELECT USING (true);

-- categories: public read only
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
