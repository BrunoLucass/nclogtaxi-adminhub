import { apiFetch, apiFetchJson } from '@/api/client';
import type { DailyTripReport, DriverPerformanceReport, MonthlyReportEntry } from '@/types/api';

export function getDailyReport(
  date: string,
  organizationId?: string,
): Promise<DailyTripReport> {
  const q = new URLSearchParams();
  q.set('date', date);
  if (organizationId) q.set('organizationId', organizationId);
  return apiFetchJson<DailyTripReport>(`/reports/daily?${q.toString()}`);
}

export function getMonthlyReport(
  year: number,
  month: number,
  organizationId?: string,
): Promise<MonthlyReportEntry[]> {
  const q = new URLSearchParams();
  q.set('year', String(year));
  q.set('month', String(month));
  if (organizationId) q.set('organizationId', organizationId);
  return apiFetchJson<MonthlyReportEntry[]>(`/reports/monthly?${q.toString()}`);
}

export function getDriverPerformanceReport(
  driverId: string,
  startDate?: string,
  endDate?: string,
): Promise<DriverPerformanceReport> {
  const q = new URLSearchParams();
  if (startDate) q.set('startDate', startDate);
  if (endDate) q.set('endDate', endDate);
  const qs = q.toString();
  return apiFetchJson<DriverPerformanceReport>(`/reports/drivers/${driverId}${qs ? `?${qs}` : ''}`);
}

export async function exportMonthlyReportCsv(
  year: number,
  month: number,
  organizationId?: string,
): Promise<void> {
  const q = new URLSearchParams();
  q.set('year', String(year));
  q.set('month', String(month));
  if (organizationId) q.set('organizationId', organizationId);
  const res = await apiFetch(`/reports/export?${q.toString()}`);
  if (!res.ok) throw new Error(`Export falhou (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio-${year}-${String(month).padStart(2, '0')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
