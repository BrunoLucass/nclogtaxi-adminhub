import { useState } from 'react';
import { Plus, Trash2, MoreVertical } from 'lucide-react';
import { deleteDriver } from '@/api/drivers';
import { CreateDriverModal } from '@/components/modals/CreateDriverModal';
import type { Driver } from '@/types/api';

type DriversTabProps = {
  drivers: Driver[];
  loading: boolean;
  onDriversChange: (drivers: Driver[]) => void;
};

export function DriversTab({ drivers, loading, onDriversChange }: DriversTabProps) {
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Motoristas</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Fila e cadastro — <code className="text-brand-gold/90">GET /drivers</code>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
        >
          <Plus size={16} /> Novo Motorista
        </button>
      </div>

      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Disponível</th>
                <th className="px-6 py-4">Fila</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {drivers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhum motorista cadastrado.
                  </td>
                </tr>
              ) : null}
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-red/30 to-brand-gold/30 flex items-center justify-center text-[10px] font-bold text-on-surface border border-white/10">
                        {d.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="text-on-surface text-sm font-bold">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{d.phone ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${d.isAvailable ? 'bg-green-400/15 text-green-400' : 'bg-muted/15 text-muted'}`}>
                      {d.isAvailable ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">
                    {d.queuePosition != null ? `#${d.queuePosition}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[160px]">{d.id}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(d)}
                      disabled={deletingId === d.id}
                      className="p-2 text-muted hover:text-brand-red transition-colors hover:bg-brand-red/10 rounded-lg disabled:opacity-50"
                      title="Excluir"
                    >
                      {deletingId === d.id ? <MoreVertical size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{drivers.length} motorista(s)</span>
        </div>
      </div>

      <CreateDriverModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(driver) => onDriversChange([driver, ...drivers])}
      />
    </div>
  );
}
