import { useState } from 'react';
import { formatBRLFromCents } from '@/lib/format';
import { VoucherActionsModal } from '@/components/modals/VoucherActionsModal';
import type { Voucher } from '@/types/api';

const statusStyle: Record<string, string> = {
  open: 'bg-brand-gold/15 text-brand-gold',
  closed: 'bg-green-400/15 text-green-400',
  disputed: 'bg-red-400/15 text-red-400',
};

type FinanceTabProps = {
  vouchers: Voucher[];
  loading: boolean;
  onVouchersChange: (vouchers: Voucher[]) => void;
};

export function FinanceTab({ vouchers, loading, onVouchersChange }: FinanceTabProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  function handleUpdated(updated: Voucher) {
    onVouchersChange(vouchers.map((v) => (v.id === updated.id ? updated : v)));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Financeiro</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          <code className="text-brand-gold/90">GET /vouchers</code> — clique em um voucher para fechar ou disputar
        </p>
      </div>

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
              {vouchers.length === 0 && !loading ? (
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
                      {v.status ?? '—'}
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
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{vouchers.length} voucher(s)</span>
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
