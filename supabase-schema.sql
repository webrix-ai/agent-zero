-- Operation MCP - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Table: sessions
-- Stores each visitor's complete session data
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Lead data
  email TEXT NOT NULL,
  full_name TEXT,
  job_title TEXT,
  company_name TEXT,
  company_size TEXT,
  industry TEXT,
  
  -- Survey responses
  blocked_mcps TEXT, -- 'has_blocked' | 'none' | <free text with MCP names>
  agent_trust_level TEXT, -- '1' to '5' scale
  security_blocker TEXT, -- 'yes' | 'no'
  ai_fears TEXT, -- 'has_fears' | 'none' | <free text with fears>
  
  -- Game state
  current_phase TEXT DEFAULT 'splash', -- splash | recon | boss_battle | security_alert | showcase | victory
  challenge_attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0, -- Number of hints used (0-3)
  challenge_started_at TIMESTAMP WITH TIME ZONE, -- When user started first challenge attempt
  challenge_completed BOOLEAN DEFAULT FALSE,
  challenge_winning_prompt TEXT,
  
  -- Completion
  giveaway_code TEXT,
  linkedin_followed BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Full conversation log
  conversation JSONB DEFAULT '[]'::jsonb
);

-- Index for lookups
CREATE INDEX idx_sessions_email ON sessions(email);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Table: events
-- Granular event log for analytics
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT NOT NULL, -- 'email_entered' | 'phase_changed' | 'challenge_attempt' | 'challenge_won' | 'linkedin_clicked' | 'email_sent'
  event_data JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_type ON events(event_type);
