import { formatBRLFromCents } from '@/lib/format';
import type { Voucher } from '@/types/api';

type FinanceTabProps = {
  vouchers: Voucher[];
  loading: boolean;
};

export function FinanceTab({ vouchers, loading }: FinanceTabProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Financeiro</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          <code className="text-brand-gold/90">GET /vouchers</code> — vales da organização (admin / client_manager).
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
                <th className="px-6 py-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {vouchers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhum voucher retornado.
                  </td>
                </tr>
              ) : null}
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[100px]">{v.id}</td>
                  <td className="px-6 py-4 text-[10px] font-mono text-muted">{v.tripId ?? '—'}</td>
                  <td className="px-6 py-4">{formatBRLFromCents(v.amountCents)}</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase">{v.status ?? '—'}</td>
                  <td className="px-6 py-4 text-[11px] text-muted">
                    {v.createdAt ? new Date(v.createdAt).toLocaleString('pt-BR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
