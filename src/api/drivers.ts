import { apiFetch, apiFetchJson } from '@/api/client';
import type {
  CreateDriverInput,
  Driver,
  DriverDocument,
  DriverStats,
  FlatPaginatedResponse,
  Trip,
  UpdateDriverInput,
} from '@/types/api';

export function listDrivers(): Promise<Driver[]> {
  return apiFetchJson<Driver[]>('/drivers');
}

export function getDriver(id: string): Promise<Driver> {
  return apiFetchJson<Driver>(`/drivers/${id}`);
}

export function createDriver(input: CreateDriverInput): Promise<Driver> {
  return apiFetchJson<Driver>('/drivers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateDriver(id: string, input: UpdateDriverInput): Promise<Driver> {
  return apiFetchJson<Driver>(`/drivers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteDriver(id: string): Promise<void> {
  return apiFetchJson<void>(`/drivers/${id}`, { method: 'DELETE' });
}

export function getDriverStats(
  id: string,
  startDate?: string,
  endDate?: string,
): Promise<DriverStats> {
  const q = new URLSearchParams();
  if (startDate) q.set('startDate', startDate);
  if (endDate) q.set('endDate', endDate);
  const qs = q.toString();
  return apiFetchJson<DriverStats>(`/drivers/${id}/stats${qs ? `?${qs}` : ''}`);
}

export function getDriverTripHistory(
  id: string,
  params?: { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number },
): Promise<FlatPaginatedResponse<Trip>> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.startDate) q.set('startDate', params.startDate);
  if (params?.endDate) q.set('endDate', params.endDate);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const qs = q.toString();
  return apiFetchJson<FlatPaginatedResponse<Trip>>(`/drivers/${id}/trips${qs ? `?${qs}` : ''}`);
}

export function listDriverDocuments(id: string): Promise<DriverDocument[]> {
  return apiFetchJson<DriverDocument[]>(`/drivers/${id}/documents`);
}

export async function uploadDriverDocument(
  id: string,
  file: File,
  type: 'cnh' | 'vehicle_doc' | 'other',
): Promise<DriverDocument> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch(`/drivers/${id}/documents?type=${type}`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload falhou (${res.status})`);
  }
  return res.json() as Promise<DriverDocument>;
}
