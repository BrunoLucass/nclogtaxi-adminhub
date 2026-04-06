import { apiFetchJson } from '@/api/client';
import type {
  BillingHistoryEntry,
  CreateOrganizationInput,
  Organization,
  OrganizationStatus,
  UpdateOrganizationInput,
} from '@/types/api';

export function listOrganizations(): Promise<Organization[]> {
  return apiFetchJson<Organization[]>('/organizations');
}

export function getOrganization(id: string): Promise<Organization> {
  return apiFetchJson<Organization>(`/organizations/${id}`);
}

export function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  return apiFetchJson<Organization>('/organizations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateOrganization(id: string, input: UpdateOrganizationInput): Promise<Organization> {
  return apiFetchJson<Organization>(`/organizations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function updateOrganizationStatus(id: string, status: OrganizationStatus): Promise<Organization> {
  return apiFetchJson<Organization>(`/organizations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function getOrganizationBilling(
  id: string,
  startDate?: string,
  endDate?: string,
): Promise<BillingHistoryEntry[]> {
  const q = new URLSearchParams();
  if (startDate) q.set('startDate', startDate);
  if (endDate) q.set('endDate', endDate);
  const qs = q.toString();
  return apiFetchJson<BillingHistoryEntry[]>(`/organizations/${id}/billing${qs ? `?${qs}` : ''}`);
}

export function deleteOrganization(id: string): Promise<void> {
  return apiFetchJson<void>(`/organizations/${id}`, { method: 'DELETE' });
}
