// Game phases
export const PHASES = {
  SPLASH: 'splash',
  RECON: 'recon',
  BOSS_BATTLE: 'boss_battle',
  SECURITY_ALERT: 'security_alert',
  SHOWCASE: 'showcase',
  VICTORY: 'victory',
} as const;

export type Phase = typeof PHASES[keyof typeof PHASES];

// Personal email domains to reject
export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'mail.com',
  'live.com',
  'msn.com',
];

// Event types for analytics
export const EVENT_TYPES = {
  EMAIL_ENTERED: 'email_entered',
  PHASE_CHANGED: 'phase_changed',
  CHALLENGE_ATTEMPT: 'challenge_attempt',
  CHALLENGE_WON: 'challenge_won',
  LINKEDIN_CLICKED: 'linkedin_clicked',
  EMAIL_SENT: 'email_sent',
} as const;

// Game constants
export const MAX_CHALLENGE_ATTEMPTS = 5;
export const TYPEWRITER_SPEED = 15; // ms per character
