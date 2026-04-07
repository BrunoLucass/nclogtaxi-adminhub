import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Plus } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import { CreateTripModal } from '@/components/modals/CreateTripModal';
import { TripDetailModal } from '@/components/modals/TripDetailModal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Pagination, Trip, TripFilters } from '@/types/api';

const toneClasses = {
  active:  { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400',  bg: 'bg-blue-400/10' },
  done:    { dot: 'bg-green-400',              text: 'text-green-400', bg: 'bg-green-400/10' },
  pending: { dot: 'bg-primary',               text: 'text-primary',   bg: 'bg-primary/10' },
  error:   { dot: 'bg-brand-red',             text: 'text-brand-red', bg: 'bg-brand-red/10' },
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

type Props = {
  trips: Trip[];
  loading: boolean;
  onTripsChange: (trips: Trip[]) => void;
  pagination?: Pagination | null;
  onPageChange?: (page: number) => void;
  filters?: TripFilters;
  onFiltersChange?: (filters: TripFilters) => void;
  hideCreate?: boolean;
};

export function RidesTab({ trips, loading, onTripsChange, pagination, onPageChange, filters, onFiltersChange, hideCreate }: Props) {
  const [showCreate, setShowCreate]       = useState(false);
  const [selectedTrip, setSelectedTrip]   = useState<Trip | null>(null);

  function handleCancelled(updated: Trip) {
    onTripsChange(trips.map((t) => (t.id === updated.id ? updated : t)));
  }

  const totalPages  = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filters */}
        {onFiltersChange && (
          <>
            <select
              value={filters?.status ?? ''}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined, page: 1 })}
              className="h-9 bg-surface-container px-3 text-sm text-on-surface rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
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
          </>
        )}

        {!hideCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="ml-auto flex items-center gap-2 h-9 px-4 bg-brand-red hover:bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-red/20"
          >
            <Plus size={14} /> Nova Corrida
          </button>
        )}
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-surface-container-low">
        {/* Header */}
        <div className="grid grid-cols-[1fr_2fr_130px_100px_140px_32px] items-center px-4 py-2.5 bg-surface-dim">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Passageiro</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Rota</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Status</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Valor</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Criado em</span>
          <span />
        </div>

        {/* Skeleton */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_130px_100px_140px_32px] items-center gap-4 px-4 py-4 border-t border-surface-container">
            <Skeleton className="h-3.5 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="w-5 h-5 rounded" />
          </div>
        ))}

        {/* Empty */}
        {!loading && trips.length === 0 && (
          <div className="px-4 py-14 text-center text-muted text-sm border-t border-surface-container">
            Nenhuma corrida encontrada.
          </div>
        )}

        {/* Rows */}
        {!loading && trips.map((row) => {
          const tone = tripStatusTone(row.status);
          const { dot, text, bg } = toneClasses[tone];
          return (
            <div
              key={row.id}
              onClick={() => setSelectedTrip(row)}
              className="grid grid-cols-[1fr_2fr_130px_100px_140px_32px] items-center px-4 py-4 border-t border-surface-container hover:bg-surface-container transition-colors cursor-pointer group"
            >
              {/* Passenger */}
              <span className="text-sm font-semibold text-on-surface truncate">{row.passengerName ?? '—'}</span>

              {/* Route */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <MapPin size={10} className="text-brand-red shrink-0" />
                  <span className="truncate">{row.pickupAddress ?? '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                  <ChevronRight size={10} className="text-primary shrink-0" />
                  <span className="truncate">{row.dropoffAddress ?? '—'}</span>
                </div>
              </div>

              {/* Status */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${bg}`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <span className={`text-[10px] font-bold uppercase ${text}`}>{tripStatusLabel(row.status)}</span>
              </div>

              {/* Value */}
              <span className="text-sm font-mono text-on-surface">
                {typeof row.amountCents === 'number' ? formatBRLFromCents(row.amountCents) : '—'}
              </span>

              {/* Date */}
              <span className="text-[11px] text-muted">
                {row.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR') : '—'}
              </span>

              {/* Chevron */}
              <ChevronRight size={14} className="text-muted group-hover:text-primary transition-colors" />
            </div>
          );
        })}

        {/* Footer */}
        {!loading && (
          <div className="px-4 py-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-[11px] text-muted">
              {pagination ? `${pagination.total} corrida(s)` : `${trips.length} corrida(s)`}
            </span>
            {pagination && totalPages > 1 && onPageChange && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-surface-container"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-on-surface-variant px-1">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 text-muted hover:text-on-surface disabled:opacity-30 transition-colors rounded-lg hover:bg-surface-container"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
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
