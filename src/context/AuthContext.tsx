import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  backendRequest,
  backendTokenStorageKey,
  isBackendConfigured,
  type BackendAuthResponse,
  type BackendProfile,
  type BackendUser,
} from '@/lib/backendAuth';

type AuthSession = {
  access_token: string;
  user: BackendUser;
} | null;

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
  session: AuthSession;
  user: BackendUser | null;
  profile: BackendProfile | null;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (payload: SignUpPayload) => Promise<{ error: string | null }>;
  updateProfile: (payload: { fullName?: string; username?: string }) => Promise<{ error: string | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  resendSignupOtp: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function backendSession(accessToken: string, user: BackendUser): AuthSession {
  return {
    access_token: accessToken,
    user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [profile, setProfile] = useState<BackendProfile | null>(null);
  const [isReady, setIsReady] = useState(!isBackendConfigured);

  useEffect(() => {
    if (!isBackendConfigured) return;

    let active = true;
    const token = window.localStorage.getItem(backendTokenStorageKey);

    if (!token) {
      setIsReady(true);
      return () => {
        active = false;
      };
    }

    setIsReady(false);

    backendRequest<Omit<BackendAuthResponse, 'accessToken'>>('/api/auth/me', { token })
      .then(({ user, profile: nextProfile }) => {
        if (!active) return;
        setSession(backendSession(token, user));
        setProfile(nextProfile);
        setIsReady(true);
      })
      .catch(() => {
        if (!active) return;
        window.localStorage.removeItem(backendTokenStorageKey);
        setSession(null);
        setProfile(null);
        setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: isBackendConfigured,
      isReady,
      isAuthenticated: Boolean(session?.user),
      isAdmin: profile?.role === 'admin',
      session,
      user: session?.user ?? null,
      profile,
      signInWithPassword: async (email, password) => {
        if (!isBackendConfigured) return { error: 'Backend ainda nao foi configurado.' };

        try {
          const data = await backendRequest<BackendAuthResponse>('/api/auth/login', {
            body: { email, password },
          });

          window.localStorage.setItem(backendTokenStorageKey, data.accessToken);
          setSession(backendSession(data.accessToken, data.user));
          setProfile(data.profile);
          return { error: null };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Erro ao entrar.' };
        }
      },
      signUpWithPassword: async ({ email, password, username, fullName }) => {
        if (!isBackendConfigured) return { error: 'Backend ainda nao foi configurado.' };

        try {
          const data = await backendRequest<BackendAuthResponse>('/api/auth/signup', {
            body: { email, password, username, fullName },
          });

          window.localStorage.setItem(backendTokenStorageKey, data.accessToken);
          setSession(backendSession(data.accessToken, data.user));
          setProfile(data.profile);
          return { error: null };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Erro ao cadastrar.' };
        }
      },
      updateProfile: async ({ fullName, username }) => {
        if (!isBackendConfigured) return { error: 'Backend ainda nao foi configurado.' };
        const token = session?.access_token;

        if (!token) {
          return { error: 'Entre na conta para atualizar o perfil.' };
        }

        try {
          const data = await backendRequest<Omit<BackendAuthResponse, 'accessToken'>>('/api/profile', {
            method: 'PATCH',
            token,
            body: {
              ...(fullName !== undefined ? { fullName } : {}),
              ...(username !== undefined ? { username } : {}),
            },
          });

          setSession(backendSession(token, data.user));
          setProfile(data.profile);
          return { error: null };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Erro ao atualizar perfil.' };
        }
      },
      verifyEmailOtp: async () => ({ error: null }),
      resendSignupOtp: async () => ({ error: null }),
      signOut: async () => {
        const token = session?.access_token;

        if (token) {
          await backendRequest('/api/auth/logout', { method: 'POST', token }).catch(() => undefined);
        }

        window.localStorage.removeItem(backendTokenStorageKey);
        setSession(null);
        setProfile(null);
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
