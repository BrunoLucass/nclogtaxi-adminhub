import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Plus } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import { CreateTripModal } from '@/components/modals/CreateTripModal';
import { TripDetailModal } from '@/components/modals/TripDetailModal';
import type { Pagination, Trip, TripFilters } from '@/types/api';

const toneClasses = {
  active: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400' },
  done: { dot: 'bg-green-400', text: 'text-green-400' },
  pending: { dot: 'bg-brand-gold', text: 'text-brand-gold' },
  error: { dot: 'bg-brand-red', text: 'text-brand-red' },
} as const;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'dispatching', label: 'Despachando' },
  { value: 'accepted', label: 'Aceita' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
];

type RidesTabProps = {
  trips: Trip[];
  loading: boolean;
  onTripsChange: (trips: Trip[]) => void;
  pagination?: Pagination | null;
  onPageChange?: (page: number) => void;
  filters?: TripFilters;
  onFiltersChange?: (filters: TripFilters) => void;
  /** When true, hides the "Nova Corrida" button (e.g., admin doesn't create from this view) */
  hideCreate?: boolean;
};

export function RidesTab({
  trips,
  loading,
  onTripsChange,
  pagination,
  onPageChange,
  filters,
  onFiltersChange,
  hideCreate,
}: RidesTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  function handleCancelled(updated: Trip) {
    onTripsChange(trips.map((t) => (t.id === updated.id ? updated : t)));
  }

  const totalPages = pagination ? pagination.totalPages : 1;
  const currentPage = pagination ? pagination.page : 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Corridas</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            <code className="text-brand-gold/90">GET /trips</code> — clique em uma linha para ver detalhes ou cancelar
          </p>
        </div>
        {!hideCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
          >
            <Plus size={16} /> Nova Corrida
          </button>
        )}
      </div>

      {/* Filters */}
      {onFiltersChange && (
        <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-wrap gap-4 shadow-sm">
          <select
            value={filters?.status ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined, page: 1 })}
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters?.startDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value || undefined, page: 1 })}
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
            placeholder="De"
          />
          <input
            type="date"
            value={filters?.endDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined, page: 1 })}
            className="bg-white/5 border border-muted/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
            placeholder="Até"
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
                <th className="px-6 py-4">Passageiro</th>
                <th className="px-6 py-4">Origem / Destino</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm animate-pulse">
                    Carregando...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
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

        {/* Footer: count + pagination */}
        <div className="p-4 bg-white/5 border-t border-muted/20 flex items-center justify-between">
          <span className="text-muted text-xs">
            {pagination ? `${pagination.total} corrida(s)` : `${trips.length} corrida(s)`}
          </span>
          {pagination && totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-white/10"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-on-surface-variant">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-white/10"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
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
