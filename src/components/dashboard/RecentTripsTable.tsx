import { ChevronRight, MapPin } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import type { Trip } from '@/types/api';

type RecentTripsTableProps = {
  trips: Trip[];
  loading: boolean;
};

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?'
  );
}

const toneClasses = {
  active: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400' },
  done: { dot: 'bg-green-400', text: 'text-green-400' },
  pending: { dot: 'bg-brand-gold', text: 'text-brand-gold' },
  error: { dot: 'bg-brand-red', text: 'text-brand-red' },
} as const;

export function RecentTripsTable({ trips, loading }: RecentTripsTableProps) {
  return (
    <div className="lg:col-span-2 bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-muted/20 flex justify-between items-center bg-white/5">
        <h3 className="text-on-surface font-headline font-extrabold text-lg tracking-tight">Últimas Corridas</h3>
        <button className="text-brand-gold text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
          Ver Tudo <ChevronRight size={14} />
        </button>
      </div>
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
                  Nenhuma corrida retornada pela API.
                </td>
              </tr>
            ) : null}
            {trips.slice(0, 8).map((row) => {
              const name = row.passengerName ?? '—';
              const tone = tripStatusTone(row.status);
              const { dot, text } = toneClasses[tone];
              const amount = typeof row.amountCents === 'number' ? formatBRLFromCents(row.amountCents) : '—';

              return (
                <tr key={row.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px] font-bold text-brand-gold border border-brand-gold/20">
                        {getInitials(name)}
                      </div>
                      <span className="text-on-surface text-xs font-bold">{name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <MapPin size={10} className="text-brand-red" />
                        {row.pickupAddress ?? '—'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                        <ChevronRight size={10} className="text-brand-gold" />
                        {row.dropoffAddress ?? '—'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className={`text-[10px] font-bold uppercase ${text}`}>
                        {tripStatusLabel(row.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface text-xs font-mono font-bold">{amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
