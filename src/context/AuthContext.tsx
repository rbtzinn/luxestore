import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];

type SignUpPayload = {
  email: string;
  password: string;
  username: string;
  fullName: string;
};

type AuthContextValue = {
  enabled: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfileRow | null;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (payload: SignUpPayload) => Promise<{ error: string | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  resendSignupOtp: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadUserProfile(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

async function resolveAuthenticatedUser(session: Session | null) {
  if (!supabase || !session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    await supabase.auth.signOut();
    return null;
  }

  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [isReady, setIsReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    const syncSession = async (nextSession: Session | null) => {
      if (!active) return;

      const authenticatedUser = await resolveAuthenticatedUser(nextSession);

      if (!authenticatedUser) {
        setSession(null);
        setProfile(null);
        setIsReady(true);
        return;
      }

      const normalizedSession = {
        ...nextSession!,
        user: authenticatedUser,
      };

      setSession(normalizedSession);

      const nextProfile = await loadUserProfile(authenticatedUser.id);

      if (!active) return;

      setProfile(nextProfile);
      setIsReady(true);
    };

    setIsReady(false);

    supabase.auth.getSession().then(({ data }) => {
      void syncSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setIsReady(false);
      void syncSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: isSupabaseConfigured,
      isReady,
      isAuthenticated: Boolean(session?.user),
      isAdmin: profile?.role === 'admin',
      session,
      user: session?.user ?? null,
      profile,
      signInWithPassword: async (email, password) => {
        if (!supabase) return { error: 'Supabase ainda nao foi configurado.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      signUpWithPassword: async ({ email, password, username, fullName }) => {
        if (!supabase) return { error: 'Supabase ainda nao foi configurado.' };

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
              full_name: fullName.trim(),
            },
          },
        });

        return { error: error?.message ?? null };
      },
      verifyEmailOtp: async (email, token) => {
        if (!supabase) return { error: 'Supabase ainda nao foi configurado.' };

        const primaryAttempt = await supabase.auth.verifyOtp({ email, token, type: 'email' });

        if (!primaryAttempt.error) {
          return { error: null };
        }

        const fallbackAttempt = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup' as 'email',
        });

        return {
          error: fallbackAttempt.error?.message ?? primaryAttempt.error.message ?? null,
        };
      },
      resendSignupOtp: async (email) => {
        if (!supabase) return { error: 'Supabase ainda nao foi configurado.' };
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        return { error: error?.message ?? null };
      },
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [isReady, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
