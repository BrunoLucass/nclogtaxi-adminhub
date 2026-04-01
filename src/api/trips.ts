import { apiFetchJson } from '@/api/client';
import type { CreateTripInput, Trip } from '@/types/api';

export function listTrips(): Promise<Trip[]> {
  return apiFetchJson<Trip[]>('/trips');
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
