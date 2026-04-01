import { apiFetchJson } from '@/api/client';
import type { Voucher } from '@/types/api';

export function listVouchers(): Promise<Voucher[]> {
  return apiFetchJson<Voucher[]>('/vouchers');
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
