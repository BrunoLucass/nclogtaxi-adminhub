import {apiFetchJson} from '@/api/client';
import type {Trip} from '@/types/api';

export function listTrips(): Promise<Trip[]> {
  return apiFetchJson<Trip[]>('/trips');
}
