import { useState } from 'react';
import { Calendar, Filter, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { deleteOrganization } from '@/api/organizations';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import type { Organization } from '@/types/api';

type ClientsTabProps = {
  organizations: Organization[];
  loading: boolean;
  onOrganizationsChange: (orgs: Organization[]) => void;
};

export function ClientsTab({ organizations, loading, onOrganizationsChange }: ClientsTabProps) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = organizations.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(org: Organization) {
    if (!confirm(`Excluir "${org.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(org.id);
    try {
      await deleteOrganization(org.id);
      onOrganizationsChange(organizations.filter((o) => o.id !== org.id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Clientes</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Organizações contratantes — <code className="text-brand-gold/90">GET /organizations</code>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
        >
          <Plus size={16} /> Nova Organização
        </button>
      </div>

      {/* Search & filters */}
      <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-muted/10 rounded-xl py-3 pl-11 pr-4 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white/5 border border-muted/10 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:border-muted/30 transition-all">
          <Filter size={14} /> Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">Organização</th>
                <th className="px-6 py-5">Mensalidade</th>
                <th className="px-6 py-5">Taxa / corrida</th>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Cadastro</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                    {search ? 'Nenhuma organização encontrada.' : 'Nenhuma organização cadastrada.'}
                  </td>
                </tr>
              ) : null}
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-xs border border-brand-red/20 group-hover:scale-105 transition-transform">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-on-surface text-sm font-bold">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-on-surface text-sm font-mono">
                    {formatBRLFromCents(org.monthlyFeeCents)}
                  </td>
                  <td className="px-6 py-5 text-on-surface text-sm font-mono">
                    {formatBRLFromCents(org.perTripFeeCents)}
                  </td>
                  <td className="px-6 py-5 text-[10px] text-muted font-mono truncate max-w-[120px]" title={org.id}>
                    {org.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <Calendar size={12} className="text-muted" />
                      {org.createdAt ? new Date(org.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleDelete(org)}
                      disabled={deletingId === org.id}
                      className="p-2 text-muted hover:text-brand-red transition-colors hover:bg-brand-red/10 rounded-lg disabled:opacity-50"
                      title="Excluir"
                    >
                      {deletingId === org.id ? <MoreVertical size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{filtered.length} organização(ões)</span>
        </div>
      </div>

      <CreateOrganizationModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(org) => onOrganizationsChange([org, ...organizations])}
      />
    </div>
  );
}
