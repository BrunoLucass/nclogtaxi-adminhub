import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { VoucherActionsModal } from '@/components/modals/VoucherActionsModal';
import type { Voucher, VoucherFilters } from '@/types/api';

const statusStyle: Record<string, string> = {
  open: 'bg-brand-gold/15 text-brand-gold',
  closed: 'bg-green-400/15 text-green-400',
  disputed: 'bg-red-400/15 text-red-400',
};

const statusLabel: Record<string, string> = {
  open: 'Aberto',
  closed: 'Fechado',
  disputed: 'Disputado',
};

type FinanceTabProps = {
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

export function FinanceTab({
  vouchers,
  loading,
  onVouchersChange,
  total,
  page = 1,
  limit = 50,
  onPageChange,
  filters,
  onFiltersChange,
}: FinanceTabProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  function handleUpdated(updated: Voucher) {
    onVouchersChange(vouchers.map((v) => (v.id === updated.id ? updated : v)));
  }

  const totalCount = total ?? vouchers.length;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Financeiro</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          <code className="text-brand-gold/90">GET /vouchers</code> — clique em um voucher para fechar ou disputar
        </p>
      </div>

      {/* Filters */}
      {onFiltersChange && (
        <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-wrap gap-4 shadow-sm">
          <select
            value={filters?.status ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined, page: 1 })}
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
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
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
          />
          <input
            type="date"
            value={filters?.endDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined, page: 1 })}
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
          />
          {(filters?.status || filters?.startDate || filters?.endDate) && (
            <button
              onClick={() => onFiltersChange({ page: 1, limit: filters?.limit })}
              className="text-xs text-muted hover:text-brand-gold transition-colors font-bold uppercase tracking-wider"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Corrida</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fechado em</th>
                <th className="px-6 py-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm animate-pulse">
                    Carregando...
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhum voucher encontrado.
                  </td>
                </tr>
              ) : null}
              {vouchers.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVoucher(v)}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[100px]" title={v.id}>{v.id}</td>
                  <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[100px]" title={v.tripId ?? ''}>{v.tripId ?? '—'}</td>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-on-surface">{formatBRLFromCents(v.amountCents)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle[(v.status ?? '').toLowerCase()] ?? 'bg-muted/15 text-muted'}`}>
                      {statusLabel[(v.status ?? '').toLowerCase()] ?? v.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-muted">
                    {v.closedAt ? new Date(v.closedAt).toLocaleString('pt-BR') : '—'}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-muted">
                    {v.createdAt ? new Date(v.createdAt).toLocaleString('pt-BR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-muted/20 flex items-center justify-between">
          <span className="text-muted text-xs">{totalCount} voucher(s)</span>
          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-white/10"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-on-surface-variant">{page} / {totalPages}</span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-white/10"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <VoucherActionsModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
