import { apiFetchJson } from '@/api/client';
import type { CreateTripInput, PaginatedResponse, Trip, TripFilters } from '@/types/api';

export function listTrips(filters?: TripFilters): Promise<PaginatedResponse<Trip>> {
  const q = new URLSearchParams();
  if (filters?.status) q.set('status', filters.status);
  if (filters?.organizationId) q.set('organizationId', filters.organizationId);
  if (filters?.driverId) q.set('driverId', filters.driverId);
  if (filters?.startDate) q.set('startDate', filters.startDate);
  if (filters?.endDate) q.set('endDate', filters.endDate);
  if (filters?.page) q.set('page', String(filters.page));
  if (filters?.limit) q.set('limit', String(filters.limit));
  const qs = q.toString();
  return apiFetchJson<PaginatedResponse<Trip>>(`/trips${qs ? `?${qs}` : ''}`);
}

export function getTrip(id: string): Promise<Trip> {
  return apiFetchJson<Trip>(`/trips/${id}`);
}

export function createTrip(input: CreateTripInput): Promise<Trip> {
  return apiFetchJson<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function cancelTrip(id: string): Promise<Trip> {
  return apiFetchJson<Trip>(`/trips/${id}/cancel`, { method: 'PATCH' });
}
