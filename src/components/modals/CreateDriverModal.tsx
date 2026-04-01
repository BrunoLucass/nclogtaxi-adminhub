import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { createDriver } from '@/api/drivers';
import type { Driver } from '@/types/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (driver: Driver) => void;
};

export function CreateDriverModal({ open, onClose, onCreated }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  function reset() {
    setId('');
    setName('');
    setPhone('');
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
      const driver = await createDriver({ id, name, phone: phone || undefined });
      onCreated(driver);
      reset();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title="Novo Motorista" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="UUID Supabase Auth (user.id)"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          disabled={loading}
          hint="O usuário já deve existir no Supabase Auth antes de cadastrar aqui."
        />
        <FormField
          label="Nome completo"
          placeholder="Carlos Motorista"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          disabled={loading}
        />
        <FormField
          label="Telefone (opcional)"
          placeholder="+5511999990000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
            {loading ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
