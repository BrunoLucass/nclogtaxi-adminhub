import { useState } from 'react';
import { Plus, ChevronRight, MapPin } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import { CreateTripModal } from '@/components/modals/CreateTripModal';
import { TripDetailModal } from '@/components/modals/TripDetailModal';
import type { Trip } from '@/types/api';

const toneClasses = {
  active: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400' },
  done: { dot: 'bg-green-400', text: 'text-green-400' },
  pending: { dot: 'bg-brand-gold', text: 'text-brand-gold' },
  error: { dot: 'bg-brand-red', text: 'text-brand-red' },
} as const;

type RidesTabProps = {
  trips: Trip[];
  loading: boolean;
  onTripsChange: (trips: Trip[]) => void;
};

export function RidesTab({ trips, loading, onTripsChange }: RidesTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  function handleCancelled(updated: Trip) {
    onTripsChange(trips.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Corridas</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            <code className="text-brand-gold/90">GET /trips</code> — clique em uma linha para ver detalhes ou cancelar
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
        >
          <Plus size={16} /> Nova Corrida
        </button>
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
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {trips.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhuma corrida encontrada.
                  </td>
                </tr>
              ) : null}
              {trips.map((row) => {
                const tone = tripStatusTone(row.status);
                const { dot, text } = toneClasses[tone];
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedTrip(row)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-on-surface text-sm font-bold">{row.passengerName ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted">
                          <MapPin size={10} className="text-brand-red shrink-0" />
                          <span className="truncate max-w-[200px]">{row.pickupAddress ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                          <ChevronRight size={10} className="text-brand-gold shrink-0" />
                          <span className="truncate max-w-[200px]">{row.dropoffAddress ?? '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className={`text-[10px] font-bold uppercase ${text}`}>{tripStatusLabel(row.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface">
                      {typeof row.amountCents === 'number' ? formatBRLFromCents(row.amountCents) : '—'}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-muted">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-muted group-hover:text-brand-gold transition-colors">
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{trips.length} corrida(s)</span>
        </div>
      </div>

      <CreateTripModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(trip) => onTripsChange([trip, ...trips])}
      />

      <TripDetailModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onCancelled={handleCancelled}
      />
    </div>
  );
}
