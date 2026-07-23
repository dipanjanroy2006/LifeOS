import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../shared/services/authService';
import { logger } from '../shared/services/logger';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const data = await authService.getProfile(userId);
      setProfile(data as UserProfile);
    } catch (e) {
      logger.error('Failed to resolve profile row in AuthProvider:', e);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Initial active session lookup
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    }).catch((e) => {
      logger.error('Failed lookup on initial session state:', e);
      setIsLoading(false);
    });

    // Realtime subscription listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      logger.info(`Auth State Change: Event [${event}]`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchProfile(currentSession.user.id);
        }
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await authService.logout();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const isEmailVerified = user ? !!user.email_confirmed_at : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isEmailVerified,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
