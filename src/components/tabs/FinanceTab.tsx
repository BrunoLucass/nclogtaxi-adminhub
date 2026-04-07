import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { VoucherActionsModal } from '@/components/modals/VoucherActionsModal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Voucher, VoucherFilters } from '@/types/api';

const statusStyle: Record<string, string> = {
  open:     'bg-primary/15 text-primary',
  closed:   'bg-green-400/15 text-green-400',
  disputed: 'bg-red-400/15 text-red-400',
};

const statusLabel: Record<string, string> = {
  open:     'Aberto',
  closed:   'Fechado',
  disputed: 'Disputado',
};

type Props = {
  vouchers: Voucher[];
  loading: boolean;
  onVouchersChange: (vouchers: Voucher[]) => void;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  filters?: VoucherFilters;
  onFiltersChange?: (filters: VoucherFilters) => void;
};

export function FinanceTab({ vouchers, loading, onVouchersChange, total, page = 1, limit = 50, onPageChange, filters, onFiltersChange }: Props) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  function handleUpdated(updated: Voucher) {
    onVouchersChange(vouchers.map((v) => (v.id === updated.id ? updated : v)));
  }

  const totalCount = total ?? vouchers.length;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Filters toolbar */}
      {onFiltersChange && (
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters?.status ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined, page: 1 })}
            className="h-9 bg-surface-container px-3 text-sm text-on-surface rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Todos os status</option>
            <option value="open">Aberto</option>
            <option value="closed">Fechado</option>
            <option value="disputed">Disputado</option>
          </select>
          <input
            type="date"
            value={filters?.startDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value || undefined, page: 1 })}
            className="h-9 bg-surface-container px-3 text-sm text-on-surface rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <input
            type="date"
            value={filters?.endDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined, page: 1 })}
            className="h-9 bg-surface-container px-3 text-sm text-on-surface rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {(filters?.status || filters?.startDate || filters?.endDate) && (
            <button
              onClick={() => onFiltersChange({ page: 1, limit: filters?.limit })}
              className="text-xs text-muted hover:text-primary transition-colors font-bold uppercase tracking-wider"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-surface-container-low">
        {/* Header */}
        <div className="grid grid-cols-[100px_100px_1fr_120px_140px_140px] items-center px-4 py-2.5 bg-surface-dim">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">ID</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Corrida</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Valor</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Status</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Fechado em</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Criado em</span>
        </div>

        {/* Skeleton */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[100px_100px_1fr_120px_140px_140px] items-center gap-4 px-4 py-4 border-t border-surface-container">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}

        {/* Empty */}
        {!loading && vouchers.length === 0 && (
          <div className="px-4 py-14 text-center text-muted text-sm border-t border-surface-container">
            Nenhum voucher encontrado.
          </div>
        )}

        {/* Rows */}
        {!loading && vouchers.map((v) => {
          const s = (v.status ?? '').toLowerCase();
          return (
            <div
              key={v.id}
              onClick={() => setSelectedVoucher(v)}
              className="grid grid-cols-[100px_100px_1fr_120px_140px_140px] items-center px-4 py-4 border-t border-surface-container hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-mono text-muted truncate" title={v.id}>{v.id.slice(0, 8)}…</span>
              <span className="text-[10px] font-mono text-muted truncate" title={v.tripId ?? ''}>{v.tripId ? v.tripId.slice(0, 8) + '…' : '—'}</span>
              <span className="text-sm font-mono font-bold text-on-surface">{formatBRLFromCents(v.amountCents)}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${statusStyle[s] ?? 'bg-muted/15 text-muted'}`}>
                {statusLabel[s] ?? v.status ?? '—'}
              </span>
              <span className="text-[11px] text-muted">{v.closedAt ? new Date(v.closedAt).toLocaleString('pt-BR') : '—'}</span>
              <span className="text-[11px] text-muted">{v.createdAt ? new Date(v.createdAt).toLocaleString('pt-BR') : '—'}</span>
            </div>
          );
        })}

        {/* Footer */}
        {!loading && (
          <div className="px-4 py-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-[11px] text-muted">{totalCount} voucher(s)</span>
            {totalPages > 1 && onPageChange && (
              <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-surface-container">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-on-surface-variant px-1">{page} / {totalPages}</span>
                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-surface-container">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <VoucherActionsModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
