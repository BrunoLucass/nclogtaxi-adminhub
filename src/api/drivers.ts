import { apiFetchJson } from '@/api/client';
import type { CreateDriverInput, Driver } from '@/types/api';

export function listDrivers(): Promise<Driver[]> {
  return apiFetchJson<Driver[]>('/drivers');
}

export function createDriver(input: CreateDriverInput): Promise<Driver> {
  return apiFetchJson<Driver>('/drivers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteDriver(id: string): Promise<void> {
  return apiFetchJson<void>(`/drivers/${id}`, { method: 'DELETE' });
}
