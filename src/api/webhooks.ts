import { apiFetchJson } from '@/api/client';
import type { Webhook } from '@/types/api';

export function listWebhooks(organizationId?: string): Promise<Webhook[]> {
  const q = new URLSearchParams();
  if (organizationId) q.set('organizationId', organizationId);
  const qs = q.toString();
  return apiFetchJson<Webhook[]>(`/webhooks${qs ? `?${qs}` : ''}`);
}

export function createWebhook(url: string): Promise<Webhook> {
  return apiFetchJson<Webhook>('/webhooks', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function deleteWebhook(id: string): Promise<void> {
  return apiFetchJson<void>(`/webhooks/${id}`, { method: 'DELETE' });
}
