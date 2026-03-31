import {apiFetchJson} from '@/api/client';
import type {DailyTripReport} from '@/types/api';

export function getDailyReport(
  date: string,
  organizationId?: string,
): Promise<DailyTripReport> {
  const q = new URLSearchParams();
  q.set('date', date);
  if (organizationId) {
    q.set('organizationId', organizationId);
  }
  return apiFetchJson<DailyTripReport>(`/reports/daily?${q.toString()}`);
}
