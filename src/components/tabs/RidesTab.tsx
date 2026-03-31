import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel } from '@/lib/trip-status';
import type { Trip } from '@/types/api';

type RidesTabProps = {
  trips: Trip[];
  loading: boolean;
};

export function RidesTab({ trips, loading }: RidesTabProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Corridas</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          <code className="text-brand-gold/90">GET /trips</code> — lista conforme sua role no JWT.
        </p>
      </div>
      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Passageiro</th>
                <th className="px-6 py-4">Origem / Destino</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {trips.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhuma corrida retornada.
                  </td>
                </tr>
              ) : null}
              {trips.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-on-surface text-sm font-bold">{row.passengerName ?? '—'}</td>
                  <td className="px-6 py-4 text-[10px] text-muted">
                    <div>{row.pickupAddress ?? '—'}</div>
                    <div className="text-on-surface-variant text-[10px] mt-1">{row.dropoffAddress ?? '—'}</div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-brand-gold">
                    {tripStatusLabel(row.status)}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {typeof row.amountCents === 'number' ? formatBRLFromCents(row.amountCents) : '—'}
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
