import { useState, useEffect, useCallback } from 'react';
import { ApiRequestError } from '@/api/client';
import { listVouchers } from '@/api/vouchers';
import type { Voucher, VoucherFilters } from '@/types/api';
import { FinanceTab } from '@/components/tabs/FinanceTab';

export function ClientFinancePage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<VoucherFilters>({ page: 1, limit: 50 });

  const load = useCallback(async () => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    try {
      const res = await listVouchers(filters);
      if (!cancelled) {
        setVouchers(res.data);
        setTotal(res.total);
      }
    } catch (e) {
      if (!cancelled) {
        const msg =
          e instanceof ApiRequestError
            ? `${e.message} (${e.status})`
            : e instanceof Error
              ? e.message
              : 'Erro ao carregar financeiro';
        setLoadError(msg);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true; };
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {loadError && (
        <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loadError}
        </div>
      )}
      <FinanceTab
        vouchers={vouchers}
        loading={loading}
        onVouchersChange={setVouchers}
        total={total}
        page={filters.page ?? 1}
        limit={filters.limit ?? 50}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </>
  );
}
