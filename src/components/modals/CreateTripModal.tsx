import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { createTrip } from '@/api/trips';
import type { Trip } from '@/types/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (trip: Trip) => void;
};

export function CreateTripModal({ open, onClose, onCreated }: Props) {
  const [passengerName, setPassengerName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  function reset() {
    setPassengerName('');
    setPickupAddress('');
    setDropoffAddress('');
    setCostCenter('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const trip = await createTrip({
        passengerName,
        pickupAddress,
        dropoffAddress,
        costCenter: costCenter || undefined,
      });
      onCreated(trip);
      reset();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title="Nova Corrida" onClose={handleClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Passageiro"
          placeholder="João Silva"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          disabled={loading}
        />
        <FormField
          label="Endereço de origem"
          placeholder="Av. Paulista, 1000, São Paulo, SP"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
          minLength={5}
          maxLength={300}
          disabled={loading}
        />
        <FormField
          label="Endereço de destino"
          placeholder="Aeroporto de Congonhas, São Paulo, SP"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
          minLength={5}
          maxLength={300}
          disabled={loading}
        />
        <FormField
          label="Centro de custo (opcional)"
          placeholder="CC-001"
          value={costCenter}
          onChange={(e) => setCostCenter(e.target.value)}
          maxLength={50}
          disabled={loading}
        />

        {error && <ApiErrorMessage error={error} />}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 h-11 bg-white/5 border border-white/10 text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-11 bg-brand-red hover:bg-brand-maroon disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-brand-red/20"
          >
            {loading ? 'Solicitando…' : 'Solicitar Corrida'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
