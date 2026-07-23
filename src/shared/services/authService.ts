// Authentication Domain Service
import { supabase } from '../../lib/supabase';
import { logger } from './logger';
import type { User, Session } from '@supabase/supabase-js';

export const authService = {
  /**
   * Triggers the Google OAuth Redirect flow.
   */
  async signInWithGoogle() {
    logger.auth('google_redirect_attempt', undefined, 'attempt');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      logger.auth('google_redirect_failed', undefined, 'failed');
      throw error;
    }
  },

  /**
   * Standard Email & Password Authentication
   */
  async login(email: string, password: string) {
    logger.auth('login_attempt', email, 'attempt');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      logger.auth('login_failed', email, 'failed');
      throw error;
    }
    logger.auth('login_success', email, 'success');
    return data;
  },

  /**
   * User Signup
   */
  async signUp(email: string, password: string, fullName: string) {
    logger.auth('signup_attempt', email, 'attempt');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        },
      },
    });
    if (error) {
      logger.auth('signup_failed', email, 'failed');
      throw error;
    }
    logger.auth('signup_success', email, 'success');
    return data;
  },

  /**
   * Request Password Reset Link (Forgot Password)
   */
  async sendPasswordResetEmail(email: string) {
    logger.auth('forgot_password_attempt', email, 'attempt');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      logger.auth('forgot_password_failed', email, 'failed');
      throw error;
    }
    logger.auth('forgot_password_success', email, 'success');
  },

  /**
   * Update Password (Reset Password Workflow)
   */
  async updatePassword(password: string) {
    logger.auth('reset_password_attempt', undefined, 'attempt');
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      logger.auth('reset_password_failed', undefined, 'failed');
      throw error;
    }
    logger.auth('reset_password_success', undefined, 'success');
  },

  /**
   * Resend Signup / Verification Email
   */
  async resendVerificationEmail(email: string) {
    logger.auth('resend_verification_attempt', email, 'attempt');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      logger.auth('resend_verification_failed', email, 'failed');
      throw error;
    }
    logger.auth('resend_verification_success', email, 'success');
  },

  /**
   * Terminate Current Auth Session
   */
  async logout() {
    logger.auth('logout_attempt', undefined, 'attempt');
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.auth('logout_failed', undefined, 'failed');
      throw error;
    }
    logger.auth('logout_success', undefined, 'success');
  },

  /**
   * Fetch current active session from Supabase
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Failed to get session:', error);
      throw error;
    }
    return session;
  },

  /**
   * Fetch Profile row linked to the authenticated user ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      logger.error('Failed to fetch user profile:', error);
      throw error;
    }
    return data;
  }
};
