import {apiFetchJson} from '@/api/client';
import type {Voucher} from '@/types/api';

export function listVouchers(): Promise<Voucher[]> {
  return apiFetchJson<Voucher[]>('/vouchers');
}
