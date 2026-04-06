import { useState, useEffect } from 'react';
import {
  KeyRound,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  ShieldOff,
} from 'lucide-react';
import { ApiRequestError } from '@/api/client';
import { listUsers, createUser, disableUser, resetUserPassword } from '@/api/users';
import { listOrganizations } from '@/api/organizations';
import type { ApiUser, Organization } from '@/types/api';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  requester: 'Solicitante',
  driver: 'Motorista',
  client_manager: 'Gestor de Cliente',
};

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-brand-red/15 text-brand-red',
  requester: 'bg-blue-400/15 text-blue-400',
  driver: 'bg-brand-gold/15 text-brand-gold',
  client_manager: 'bg-green-400/15 text-green-400',
};

export function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'requester' | 'client_manager' | 'driver'>('requester');
  const [orgId, setOrgId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Actions
  const [disablingId, setDisablingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const params: { role?: string; organizationId?: string } = {};
        if (roleFilter) params.role = roleFilter;
        const [us, orgs] = await Promise.all([listUsers(params), listOrganizations()]);
        if (!cancelled) {
          setUsers(us);
          setOrganizations(orgs);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar usuários';
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [roleFilter]);

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()),
  );

  function resetForm() {
    setEmail(''); setPassword(''); setRole('requester'); setOrgId('');
    setName(''); setPhone(''); setFormError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const u = await createUser({
        email,
        password,
        role,
        ...(orgId ? { organizationId: orgId } : {}),
        ...(role === 'driver' ? { name, phone } : {}),
      });
      setUsers((prev) => [u, ...prev]);
      resetForm();
      setShowCreate(false);
    } catch (e) {
      const msg = e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Erro ao criar usuário';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisable(u: ApiUser) {
    if (!confirm(`Desabilitar usuário "${u.email}"? O acesso será bloqueado.`)) return;
    setDisablingId(u.id);
    try {
      await disableUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } finally {
      setDisablingId(null);
    }
  }

  async function handleResetPassword(u: ApiUser) {
    if (!confirm(`Enviar e-mail de redefinição de senha para "${u.email}"?`)) return;
    setResettingId(u.id);
    try {
      await resetUserPassword(u.id);
      alert('E-mail de redefinição enviado com sucesso.');
    } finally {
      setResettingId(null);
    }
  }

  function getOrgName(id?: string | null) {
    if (!id) return '—';
    return organizations.find((o) => o.id === id)?.name ?? id.slice(0, 8) + '…';
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Usuários</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Gestão de acesso — <code className="text-brand-gold/90">GET /users</code>
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loadError}
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Buscar por e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-muted/10 rounded-xl py-3 pl-11 pr-4 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white/5 border border-muted/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
        >
          <option value="">Todos os roles</option>
          <option value="admin">Admin</option>
          <option value="requester">Solicitante</option>
          <option value="driver">Motorista</option>
          <option value="client_manager">Gestor de Cliente</option>
        </select>
      </div>

      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Organização</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted text-sm">
                    {search ? 'Nenhum usuário encontrado.' : 'Nenhum usuário cadastrado.'}
                  </td>
                </tr>
              ) : null}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-red/30 to-brand-gold/30 flex items-center justify-center text-[10px] font-bold text-on-surface border border-white/10">
                        {u.email[0].toUpperCase()}
                      </div>
                      <span className="text-on-surface text-sm font-bold">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[u.role] ?? 'bg-muted/15 text-muted'}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{getOrgName(u.organizationId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.bannedUntil ? 'bg-red-400/15 text-red-400' : 'bg-green-400/15 text-green-400'}`}>
                      {u.bannedUntil ? 'Desabilitado' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleResetPassword(u)}
                        disabled={resettingId === u.id}
                        title="Enviar redefinição de senha"
                        className="p-2 text-muted hover:text-brand-gold transition-colors hover:bg-brand-gold/10 rounded-lg disabled:opacity-50"
                      >
                        {resettingId === u.id ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                      </button>
                      <button
                        onClick={() => handleDisable(u)}
                        disabled={disablingId === u.id}
                        title="Desabilitar usuário"
                        className="p-2 text-muted hover:text-brand-red transition-colors hover:bg-brand-red/10 rounded-lg disabled:opacity-50"
                      >
                        {disablingId === u.id ? <MoreVertical size={15} className="animate-spin" /> : <ShieldOff size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{filtered.length} usuário(s)</span>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container border border-muted/20 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-muted/10">
              <h2 className="text-on-surface font-headline font-extrabold text-lg">Novo Usuário</h2>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {formError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">E-mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@empresa.com"
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Senha *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
                >
                  <option value="requester">Solicitante</option>
                  <option value="client_manager">Gestor de Cliente</option>
                  <option value="driver">Motorista</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Organização</label>
                <select
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none"
                >
                  <option value="">— Selecionar —</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              {role === 'driver' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Nome completo *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={role === 'driver'}
                      placeholder="Nome do motorista"
                      className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Telefone *</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={role === 'driver'}
                      placeholder="+5511999990000"
                      className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-muted/20 text-on-surface-variant text-sm font-bold hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-maroon text-white text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
