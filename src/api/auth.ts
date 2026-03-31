import {getApiBaseUrl, getSupabaseAnonKey} from '@/lib/env';
import {setToken} from '@/lib/auth-storage';
import type {LoginResponse} from '@/types/api';
import {formatValidationDetails} from '@/api/client';

export type LoginResult =
  | {ok: true}
  | {ok: false; message: string; details?: Record<string, string[]>};

async function parseLoginError(res: Response): Promise<{
  message: string;
  details?: Record<string, string[]>;
}> {
  const text = await res.text();
  let raw: unknown;
  try {
    raw = text ? JSON.parse(text) : undefined;
  } catch {
    return {message: text || res.statusText || 'Falha no login'};
  }
  if (raw && typeof raw === 'object') {
    const o = raw as {error?: string; message?: string; details?: Record<string, string[]>};
    const message =
      (typeof o.error === 'string' && o.error) ||
      (typeof o.message === 'string' && o.message) ||
      res.statusText ||
      'Falha no login';
    const details =
      o.details && typeof o.details === 'object' ? o.details : undefined;
    return {message, details};
  }
  return {message: res.statusText || 'Falha no login'};
}

/**
 * POST /auth/login — Supabase credentials; stores JWT in sessionStorage on success.
 * Does not use apiFetch (no Bearer; uses `apikey` header per API reference).
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const base = getApiBaseUrl();
  const anon = getSupabaseAnonKey();

  if (!base || !anon) {
    return {
      ok: false,
      message:
        'Configuração incompleta: defina VITE_API_BASE_URL e VITE_SUPABASE_ANON_KEY em .env.local.',
    };
  }

  const url = `${base}/auth/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anon,
    },
    body: JSON.stringify({email, password}),
  });

  if (!res.ok) {
    const {message, details} = await parseLoginError(res);
    return {ok: false, message, details};
  }

  const data = (await res.json()) as LoginResponse;
  if (!data.access_token) {
    return {ok: false, message: 'Resposta inválida: access_token ausente.'};
  }

  setToken(data.access_token);
  return {ok: true};
}

/** Human-readable line for UI from login error. */
export function loginErrorToDisplay(result: Extract<LoginResult, {ok: false}>): string {
  const extra = formatValidationDetails(result.details);
  return extra ? `${result.message} ${extra}` : result.message;
}
