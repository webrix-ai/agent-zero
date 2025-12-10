import { PERSONAL_EMAIL_DOMAINS } from './constants';

/**
 * Validate if an email is a work email (not personal)
 */
export function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
}

/**
 * Extract name from email address
 */
export function extractNameFromEmail(email: string): string | null {
  const local = email.split('@')[0];
  if (!local) return null;
  
  // Try to extract name from formats like "john.doe" or "john_doe"
  if (local.includes('.')) {
    return local.split('.').map(capitalize).join(' ');
  }
  if (local.includes('_')) {
    return local.split('_').map(capitalize).join(' ');
  }
  // Just capitalize the first letter if no separator
  return capitalize(local);
}

/**
 * Convert domain to company name
 */
export function domainToCompanyName(domain: string): string {
  const name = domain.split('.')[0];
  return capitalize(name);
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Generate a random alphanumeric code
 */
export function generateCode(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
