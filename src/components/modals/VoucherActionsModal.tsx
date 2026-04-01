import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { closeVoucher, disputeVoucher } from '@/api/vouchers';
import { formatBRLFromCents } from '@/lib/format';
import type { Voucher } from '@/types/api';

type Props = {
  voucher: Voucher | null;
  onClose: () => void;
  onUpdated: (voucher: Voucher) => void;
};

export function VoucherActionsModal({ voucher, onClose, onUpdated }: Props) {
  const [amountStr, setAmountStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  if (!voucher) return null;

  const isActionable = !['closed', 'disputed'].includes((voucher.status ?? '').toLowerCase());

  async function handleClose() {
    if (!voucher) return;
    setError(null);
    setLoading(true);
    try {
      const cents = Math.round(parseFloat(amountStr.replace(',', '.')) * 100);
      const updated = await closeVoucher(voucher.id, cents);
      onUpdated(updated);
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDispute() {
    if (!voucher) return;
    setError(null);
    setLoading(true);
    try {
      const updated = await disputeVoucher(voucher.id);
      onUpdated(updated);
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={!!voucher} title="Voucher" onClose={onClose}>
      <div className="space-y-4">
        {/* Info */}
        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Valor atual</span>
            <span className="text-on-surface font-mono font-bold">{formatBRLFromCents(voucher.amountCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Status</span>
            <span className="text-brand-gold font-bold uppercase">{voucher.status ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Corrida ID</span>
            <span className="text-on-surface-variant font-mono truncate max-w-[180px]">{voucher.tripId ?? '—'}</span>
          </div>
        </div>

        {isActionable ? (
          <>
            <FormField
              label="Novo valor para fechamento (R$)"
              placeholder="20,00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              disabled={loading}
              hint="Deixe em branco para disputar sem fechar."
            />

            {error && <ApiErrorMessage error={error} />}

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-11 bg-white/5 border border-white/10 text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDispute}
                disabled={loading}
                className="flex-1 h-11 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-60 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                {loading ? '…' : 'Disputar'}
              </button>
              <button
                onClick={handleClose}
                disabled={loading || !amountStr}
                className="flex-1 h-11 bg-brand-red hover:bg-brand-maroon disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-brand-red/20"
              >
                {loading ? 'Fechando…' : 'Fechar'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted text-sm text-center py-2">
              Este voucher já está <strong className="text-on-surface">{voucher.status}</strong> e não pode ser alterado.
            </p>
            <button
              onClick={onClose}
              className="w-full h-11 bg-white/5 border border-white/10 text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
