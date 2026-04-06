import { apiFetchJson } from '@/api/client';
import type { FlatPaginatedResponse, Voucher, VoucherFilters } from '@/types/api';

export function listVouchers(filters?: VoucherFilters): Promise<FlatPaginatedResponse<Voucher>> {
  const q = new URLSearchParams();
  if (filters?.organizationId) q.set('organizationId', filters.organizationId);
  if (filters?.status) q.set('status', filters.status);
  if (filters?.startDate) q.set('startDate', filters.startDate);
  if (filters?.endDate) q.set('endDate', filters.endDate);
  if (filters?.page) q.set('page', String(filters.page));
  if (filters?.limit) q.set('limit', String(filters.limit));
  const qs = q.toString();
  return apiFetchJson<FlatPaginatedResponse<Voucher>>(`/vouchers${qs ? `?${qs}` : ''}`);
}

export function getVoucher(id: string): Promise<Voucher> {
  return apiFetchJson<Voucher>(`/vouchers/${id}`);
}

export function closeVoucher(id: string, amountCents: number): Promise<Voucher> {
  return apiFetchJson<Voucher>(`/vouchers/${id}/close`, {
    method: 'PATCH',
    body: JSON.stringify({ amountCents }),
  });
}

export function disputeVoucher(id: string): Promise<Voucher> {
  return apiFetchJson<Voucher>(`/vouchers/${id}/dispute`, { method: 'PATCH' });
}
