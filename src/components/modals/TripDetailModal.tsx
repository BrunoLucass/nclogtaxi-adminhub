import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { cancelTrip } from '@/api/trips';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import { formatBRLFromCents } from '@/lib/format';
import { MapPin, ChevronRight, Calendar, Hash, Building2 } from 'lucide-react';
import type { Trip } from '@/types/api';

const toneClasses = {
  active: 'bg-blue-400/15 text-blue-400',
  done: 'bg-green-400/15 text-green-400',
  pending: 'bg-brand-gold/15 text-brand-gold',
  error: 'bg-brand-red/15 text-brand-red',
} as const;

type Props = {
  trip: Trip | null;
  onClose: () => void;
  onCancelled: (trip: Trip) => void;
};

export function TripDetailModal({ trip, onClose, onCancelled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  if (!trip) return null;

  const tone = tripStatusTone(trip.status);
  const canCancel = ['pending', 'dispatching'].includes((trip.status ?? '').toLowerCase());

  async function handleCancel() {
    if (!trip) return;
    setError(null);
    setLoading(true);
    try {
      const updated = await cancelTrip(trip.id);
      onCancelled(updated);
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={!!trip} title="Detalhes da Corrida" onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Status badge */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${toneClasses[tone]}`}>
            {tripStatusLabel(trip.status)}
          </span>
          {trip.amountCents != null && (
            <span className="text-on-surface font-mono font-bold text-sm">
              {formatBRLFromCents(trip.amountCents)}
            </span>
          )}
        </div>

        {/* Passenger */}
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <Row icon={<Hash size={14} className="text-muted" />} label="Passageiro" value={trip.passengerName ?? '—'} />
          <div className="h-px bg-white/5" />
          <Row icon={<MapPin size={14} className="text-brand-red" />} label="Origem" value={trip.pickupAddress ?? '—'} />
          <Row icon={<ChevronRight size={14} className="text-brand-gold" />} label="Destino" value={trip.dropoffAddress ?? '—'} />
        </div>

        {/* Meta */}
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          {trip.costCenter && (
            <Row icon={<Building2 size={14} className="text-muted" />} label="Centro de custo" value={trip.costCenter} />
          )}
          {trip.organizationId && (
            <Row icon={<Building2 size={14} className="text-muted" />} label="Organização ID" value={trip.organizationId} mono />
          )}
          <Row
            icon={<Calendar size={14} className="text-muted" />}
            label="Criado em"
            value={trip.createdAt ? new Date(trip.createdAt).toLocaleString('pt-BR') : '—'}
          />
          <Row icon={<Hash size={14} className="text-muted" />} label="ID" value={trip.id} mono />
        </div>

        {error && <ApiErrorMessage error={error} />}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-white/5 border border-white/10 text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Fechar
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 h-11 bg-brand-red/20 hover:bg-brand-red/30 border border-brand-red/30 disabled:opacity-60 text-brand-red rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              {loading ? 'Cancelando…' : 'Cancelar Corrida'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Row({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-widest text-muted mb-0.5">{label}</div>
        <div className={`text-on-surface text-xs truncate ${mono ? 'font-mono' : 'font-medium'}`}>{value}</div>
      </div>
    </div>
  );
}
