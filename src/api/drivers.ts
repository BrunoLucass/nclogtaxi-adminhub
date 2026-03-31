import {apiFetchJson} from '@/api/client';
import type {Driver} from '@/types/api';

export function listDrivers(): Promise<Driver[]> {
  return apiFetchJson<Driver[]>('/drivers');
}
