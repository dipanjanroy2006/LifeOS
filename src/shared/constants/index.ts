// Global Application Constants

export const APP_NAME = 'LifeOS' as const;

export const ROUTES = {
  WELCOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  HABITS: '/habits',
  CALENDAR: '/calendar',
  GOALS: '/goals',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const SCORE_WEIGHTS = {
  HABITS: 0.45,
  GOALS: 0.25,
  MOOD: 0.15,
  CONSISTENCY: 0.15,
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' as const;
