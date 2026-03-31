import { getApiBaseUrl } from '@/lib/env';
import { clearToken, getToken } from '@/lib/auth-storage';
import type { ApiSimpleErrorBody, ApiValidationErrorBody } from '@/types/api';

type UnauthorizedListener = () => void;
let onUnauthorized: UnauthorizedListener | null = null;

export function setOnUnauthorized(listener: UnauthorizedListener | null): void {
  onUnauthorized = listener;
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Authenticated API requests. Sends `Authorization: Bearer` when a token exists.
 * On 401, clears the token and notifies the optional unauthorized listener.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  const url = joinUrl(base || '', path);

  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (
    init.body != null &&
    typeof init.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {...init, headers});

  if (res.status === 401) {
    clearToken();
    onUnauthorized?.();
  }

  return res;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]>;
  readonly body?: unknown;

  constructor(
    message: string,
    status: number,
    options?: {details?: Record<string, string[]>; body?: unknown},
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = options?.details;
    this.body = options?.body;
  }
}

async function parseErrorBody(res: Response): Promise<{
  message: string;
  details?: Record<string, string[]>;
  raw: unknown;
}> {
  const text = await res.text();
  let raw: unknown;
  try {
    raw = text ? JSON.parse(text) : undefined;
  } catch {
    raw = text;
  }

  if (raw && typeof raw === 'object') {
    const v = raw as ApiValidationErrorBody & ApiSimpleErrorBody;
    const msg =
      (typeof v.error === 'string' && v.error) ||
      (typeof (v as ApiSimpleErrorBody).message === 'string' &&
        (v as ApiSimpleErrorBody).message) ||
      res.statusText ||
      'Request failed';
    const details =
      v.details && typeof v.details === 'object' ? v.details : undefined;
    return {message: msg, details, raw};
  }

  return {
    message: typeof raw === 'string' ? raw : res.statusText || 'Request failed',
    raw,
  };
}

/** Throws ApiRequestError if response is not ok. */
export async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  if (res.ok) {
    if (res.status === 204) {
      return undefined as T;
    }
    return res.json() as Promise<T>;
  }
  const {message, details, raw} = await parseErrorBody(res);
  throw new ApiRequestError(message, res.status, {details, body: raw});
}

export function formatValidationDetails(details?: Record<string, string[]>): string {
  if (!details || Object.keys(details).length === 0) {
    return '';
  }
  return Object.entries(details)
    .flatMap(([field, msgs]) =>
      msgs.map((m) => (field ? `${field}: ${m}` : m)),
    )
    .join(' · ');
}
