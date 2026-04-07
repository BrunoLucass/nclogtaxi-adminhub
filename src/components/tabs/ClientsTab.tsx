import { useState, useMemo } from 'react';
import { Calendar, ChevronDown, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import { deleteOrganization, updateOrganizationStatus } from '@/api/organizations';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Organization, OrganizationStatus } from '@/types/api';

const STATUS_STYLE: Record<OrganizationStatus, string> = {
  active:     'bg-green-400/15 text-green-400',
  suspended:  'bg-primary/15 text-primary',
  delinquent: 'bg-red-400/15 text-red-400',
};

const STATUS_LABEL: Record<OrganizationStatus, string> = {
  active:     'Ativa',
  suspended:  'Suspensa',
  delinquent: 'Inadimplente',
};

type Props = {
  organizations: Organization[];
  loading: boolean;
  onOrganizationsChange: (orgs: Organization[]) => void;
};

const COLS = ['w-8 h-8 rounded-full shrink-0', 'h-4 flex-1', 'h-4 w-24 shrink-0', 'h-4 w-20 shrink-0', 'h-6 w-16 rounded-full shrink-0', 'h-4 w-20 shrink-0', 'w-7 h-7 rounded-lg shrink-0'];

export function ClientsTab({ organizations, loading, onOrganizationsChange }: Props) {
  const [search, setSearch]               = useState('');
  const [showCreate, setShowCreate]       = useState(false);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [openStatusMenu, setOpenStatusMenu]     = useState<string | null>(null);

  const filtered = useMemo(
    () => organizations.filter((o) => o.name.toLowerCase().includes(search.toLowerCase())),
    [organizations, search],
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

  async function handleStatusChange(org: Organization, status: OrganizationStatus) {
    setOpenStatusMenu(null);
    setStatusUpdatingId(org.id);
    try {
      const updated = await updateOrganizationStatus(org.id, status);
      onOrganizationsChange(organizations.map((o) => (o.id === org.id ? { ...o, ...updated } : o)));
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Click-away overlay for status dropdown */}
      {openStatusMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenStatusMenu(null)} />
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            type="text"
            placeholder="Buscar organização..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-surface-container pl-9 pr-4 text-sm text-on-surface placeholder:text-muted rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto flex items-center gap-2 h-9 px-4 bg-brand-red hover:bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-red/20"
        >
          <Plus size={14} /> Nova Organização
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-surface-container-low">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_110px_130px_110px_40px] items-center px-4 py-2.5 bg-surface-dim">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Organização</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Mensalidade</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Taxa / corrida</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Status</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Cadastro</span>
          <span />
        </div>

        {/* Skeleton rows */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_110px_130px_110px_40px] items-center gap-4 px-4 py-4 border-t border-surface-container">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            {COLS.slice(1).map((cls, j) => <Skeleton key={j} className={cls} />)}
          </div>
        ))}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="px-4 py-14 text-center text-muted text-sm border-t border-surface-container">
            {search ? 'Nenhuma organização encontrada.' : 'Nenhuma organização cadastrada.'}
          </div>
        )}

        {/* Data rows */}
        {!loading && filtered.map((org) => {
          const status = (org.status ?? 'active') as OrganizationStatus;
          return (
            <div
              key={org.id}
              className="grid grid-cols-[1fr_120px_110px_130px_110px_40px] items-center px-4 py-4 border-t border-surface-container hover:bg-surface-container transition-colors group"
            >
              {/* Org */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-red/15 border border-brand-red/20 flex items-center justify-center text-brand-red font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                  {org.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{org.name}</p>
                  <p className="text-[9px] font-mono text-muted truncate">{org.id.slice(0, 8)}…</p>
                </div>
              </div>

              {/* Mensalidade */}
              <span className="text-sm font-mono text-on-surface-variant">{formatBRLFromCents(org.monthlyFeeCents)}</span>

              {/* Taxa */}
              <span className="text-sm font-mono text-on-surface-variant">{formatBRLFromCents(org.perTripFeeCents)}</span>

              {/* Status dropdown */}
              <div className="relative z-20">
                <button
                  onClick={() => setOpenStatusMenu(openStatusMenu === org.id ? null : org.id)}
                  disabled={statusUpdatingId === org.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all hover:opacity-80 disabled:opacity-50 ${STATUS_STYLE[status] ?? 'bg-muted/15 text-muted'}`}
                >
                  {statusUpdatingId === org.id ? '…' : STATUS_LABEL[status] ?? status}
                  <ChevronDown size={10} />
                </button>
                {openStatusMenu === org.id && (
                  <div className="absolute left-0 top-full mt-1 bg-surface-container-high rounded-xl shadow-xl z-30 py-1 min-w-[140px]">
                    {(['active', 'suspended', 'delinquent'] as OrganizationStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(org, s)}
                        className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-surface-container transition-colors ${s === status ? 'text-primary' : 'text-on-surface-variant'}`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted">
                <Calendar size={11} />
                {org.createdAt ? new Date(org.createdAt).toLocaleDateString('pt-BR') : '—'}
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(org)}
                disabled={deletingId === org.id}
                aria-label={`Excluir ${org.name}`}
                className="flex items-center justify-center w-7 h-7 text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors disabled:opacity-40"
              >
                {deletingId === org.id
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Trash2 size={14} />}
              </button>
            </div>
          );
        })}

        {/* Footer count */}
        {!loading && (
          <div className="px-4 py-3 border-t border-surface-container">
            <span className="text-[11px] text-muted">{filtered.length} organização(ões)</span>
          </div>
        )}
      </div>

      <CreateOrganizationModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(org) => onOrganizationsChange([org, ...organizations])}
      />
    </div>
  );
}
