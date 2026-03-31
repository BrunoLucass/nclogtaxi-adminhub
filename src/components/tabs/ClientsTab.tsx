import { Calendar, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import type { Organization } from '@/types/api';

type ClientsTabProps = {
  organizations: Organization[];
  loading: boolean;
};

export function ClientsTab({ organizations, loading }: ClientsTabProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Organizações (clientes)</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Dados de <code className="text-brand-gold/90">GET /organizations</code> — empresas contratantes.
          </p>
        </div>
        <button className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95">
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou documento..."
            className="w-full bg-white/5 border border-muted/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-muted/10 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:border-muted/30 transition-all">
            <Filter size={16} /> Filtros
          </button>
          <select className="flex-1 md:flex-none bg-white/5 border border-muted/10 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant outline-none cursor-pointer hover:border-muted/30 transition-all">
            <option>Todos os Status</option>
            <option>Ativos</option>
            <option>Inativos</option>
            <option>Bloqueados</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
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
              {organizations.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhuma organização retornada (verifique permissão admin).
                  </td>
                </tr>
              ) : null}
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-xs border border-brand-red/20 group-hover:scale-105 transition-transform">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface text-sm font-bold">{org.name}</span>
                      </div>
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
                    <button className="p-2 text-muted hover:text-brand-gold transition-colors hover:bg-white/5 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-white/5 border-t border-muted/20 flex justify-between items-center">
          <span className="text-muted text-xs font-medium">
            {organizations.length} organização(ões)
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 border border-muted/10 rounded-lg text-xs font-bold text-muted hover:text-on-surface transition-all">Anterior</button>
            <button className="px-4 py-2 bg-brand-red text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-red/20 active:scale-95 transition-all">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
