import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { deleteDriver } from '@/api/drivers';
import { CreateDriverModal } from '@/components/modals/CreateDriverModal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Driver } from '@/types/api';

type Props = {
  drivers: Driver[];
  loading: boolean;
  onDriversChange: (drivers: Driver[]) => void;
};

export function DriversTab({ drivers, loading, onDriversChange }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(driver: Driver) {
    if (!confirm(`Excluir motorista "${driver.name}"?`)) return;
    setDeletingId(driver.id);
    try {
      await deleteDriver(driver.id);
      onDriversChange(drivers.filter((d) => d.id !== driver.id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toolbar */}
      <div className="flex items-center">
        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto flex items-center gap-2 h-9 px-4 bg-brand-red hover:bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-red/20"
        >
          <Plus size={14} /> Novo Motorista
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-surface-container-low">
        {/* Header */}
        <div className="grid grid-cols-[1fr_140px_100px_80px_1fr_40px] items-center px-4 py-2.5 bg-surface-dim">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Motorista</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Telefone</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Disponível</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Fila</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">ID</span>
          <span />
        </div>

        {/* Skeleton */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_140px_100px_80px_1fr_40px] items-center gap-4 px-4 py-4 border-t border-surface-container">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-3.5 w-8" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="w-7 h-7 rounded-lg" />
          </div>
        ))}

        {/* Empty */}
        {!loading && drivers.length === 0 && (
          <div className="px-4 py-14 text-center text-muted text-sm border-t border-surface-container">
            Nenhum motorista cadastrado.
          </div>
        )}

        {/* Rows */}
        {!loading && drivers.map((d) => {
          const initials = d.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
          return (
            <div
              key={d.id}
              className="grid grid-cols-[1fr_140px_100px_80px_1fr_40px] items-center px-4 py-4 border-t border-surface-container hover:bg-surface-container transition-colors"
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-red/30 to-primary/30 flex items-center justify-center text-[10px] font-bold text-on-surface shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-on-surface truncate">{d.name}</span>
              </div>

              {/* Phone */}
              <span className="text-sm text-on-surface-variant">{d.phone ?? '—'}</span>

              {/* Available */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${d.isAvailable ? 'bg-green-400/15 text-green-400' : 'bg-muted/15 text-muted'}`}>
                {d.isAvailable ? 'Sim' : 'Não'}
              </span>

              {/* Queue */}
              <span className="text-sm text-on-surface-variant">
                {d.queuePosition != null ? `#${d.queuePosition}` : '—'}
              </span>

              {/* ID */}
              <span className="text-[10px] font-mono text-muted truncate">{d.id}</span>

              {/* Delete */}
              <button
                onClick={() => handleDelete(d)}
                disabled={deletingId === d.id}
                aria-label={`Excluir ${d.name}`}
                className="flex items-center justify-center w-7 h-7 text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors disabled:opacity-40"
              >
                {deletingId === d.id
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Trash2 size={14} />}
              </button>
            </div>
          );
        })}

        {!loading && (
          <div className="px-4 py-3 border-t border-surface-container">
            <span className="text-[11px] text-muted">{drivers.length} motorista(s)</span>
          </div>
        )}
      </div>

      <CreateDriverModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(driver) => onDriversChange([driver, ...drivers])}
      />
    </div>
  );
}
