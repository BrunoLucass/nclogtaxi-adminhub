import { apiFetchJson } from '@/api/client';
import type { CreateOrganizationInput, Organization } from '@/types/api';

export function listOrganizations(): Promise<Organization[]> {
  return apiFetchJson<Organization[]>('/organizations');
}

export function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  return apiFetchJson<Organization>('/organizations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateOrganization(id: string, input: Partial<CreateOrganizationInput>): Promise<Organization> {
  return apiFetchJson<Organization>(`/organizations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteOrganization(id: string): Promise<void> {
  return apiFetchJson<void>(`/organizations/${id}`, { method: 'DELETE' });
}
