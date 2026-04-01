import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { createOrganization } from '@/api/organizations';
import type { Organization } from '@/types/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (org: Organization) => void;
};

export function CreateOrganizationModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [perTripFee, setPerTripFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  function reset() {
    setName('');
    setMonthlyFee('');
    setPerTripFee('');
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
      const org = await createOrganization({
        name,
        monthlyFeeCents: Math.round(parseFloat(monthlyFee.replace(',', '.')) * 100),
        perTripFeeCents: Math.round(parseFloat(perTripFee.replace(',', '.')) * 100),
      });
      onCreated(org);
      reset();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title="Nova Organização" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nome da organização"
          placeholder="Empresa ABC"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          disabled={loading}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Mensalidade (R$)"
            placeholder="2000,00"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
            required
            disabled={loading}
          />
          <FormField
            label="Taxa por corrida (R$)"
            placeholder="20,00"
            value={perTripFee}
            onChange={(e) => setPerTripFee(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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
            {loading ? 'Criando…' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
