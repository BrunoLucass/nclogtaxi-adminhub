import {apiFetchJson} from '@/api/client';
import type {Organization} from '@/types/api';

export function listOrganizations(): Promise<Organization[]> {
  return apiFetchJson<Organization[]>('/organizations');
}
