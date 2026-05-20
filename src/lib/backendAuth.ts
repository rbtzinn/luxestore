import type { Database } from '@/types/supabase';

export type BackendUser = {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  createdAt: string;
  updatedAt: string;
};

export type BackendProfile = Database['public']['Tables']['user_profiles']['Row'];

export type BackendAuthResponse = {
  accessToken: string;
  user: BackendUser;
  profile: BackendProfile;
};

type BackendRequestOptions = {
  body?: unknown;
  method?: string;
  token?: string | null;
};

export const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL?.trim().replace(/\/$/, '') || '';
export const isBackendConfigured = Boolean(backendApiUrl);

export const backendTokenStorageKey = 'luxestore:backend-token';

export async function backendRequest<T>(path: string, options: BackendRequestOptions = {}) {
  if (!backendApiUrl) {
    throw new Error('Backend ainda nao foi configurado.');
  }

  const response = await fetch(`${backendApiUrl}${path}`, {
    method: options.method || (options.body ? 'POST' : 'GET'),
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Nao foi possivel falar com o backend.');
  }

  return payload as T;
}
