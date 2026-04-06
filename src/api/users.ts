import { apiFetchJson } from '@/api/client';
import type { ApiUser, CreateUserInput, UpdateUserInput } from '@/types/api';

export function getMe(): Promise<ApiUser> {
  return apiFetchJson<ApiUser>('/users/me');
}

export function listUsers(params?: { role?: string; organizationId?: string }): Promise<ApiUser[]> {
  const q = new URLSearchParams();
  if (params?.role) q.set('role', params.role);
  if (params?.organizationId) q.set('organizationId', params.organizationId);
  const qs = q.toString();
  return apiFetchJson<ApiUser[]>(`/users${qs ? `?${qs}` : ''}`);
}

export function getUser(id: string): Promise<ApiUser> {
  return apiFetchJson<ApiUser>(`/users/${id}`);
}

export function createUser(input: CreateUserInput): Promise<ApiUser> {
  return apiFetchJson<ApiUser>('/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateUser(id: string, input: UpdateUserInput): Promise<ApiUser> {
  return apiFetchJson<ApiUser>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function disableUser(id: string): Promise<void> {
  return apiFetchJson<void>(`/users/${id}`, { method: 'DELETE' });
}

export function resetUserPassword(id: string): Promise<void> {
  return apiFetchJson<void>(`/users/${id}/reset-password`, { method: 'POST' });
}
