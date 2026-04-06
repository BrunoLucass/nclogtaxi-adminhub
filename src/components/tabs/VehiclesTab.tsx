import { useState } from 'react';
import { Car, FileText, Link, Link2Off, Loader2, MoreVertical, Plus, Search, Trash2, Upload } from 'lucide-react';
import {
  assignDriver,
  createVehicle,
  deleteVehicle,
  unassignDriver,
  uploadVehicleLicence,
} from '@/api/vehicles';
import { ApiRequestError } from '@/api/client';
import type { Driver, Vehicle } from '@/types/api';

type VehiclesTabProps = {
  vehicles: Vehicle[];
  drivers: Driver[];
  loading: boolean;
  onVehiclesChange: (vehicles: Vehicle[]) => void;
};

const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Outro'];

export function VehiclesTab({ vehicles, drivers, loading, onVehiclesChange }: VehiclesTabProps) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState('Branco');
  const [driverId, setDriverId] = useState('');

  const filtered = vehicles.filter((v) =>
    `${v.plate} ${v.model} ${v.color}`.toLowerCase().includes(search.toLowerCase()),
  );

  function resetForm() {
    setPlate(''); setModel(''); setYear(String(new Date().getFullYear())); setColor('Branco'); setDriverId('');
    setFormError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const v = await createVehicle({
        plate: plate.trim(),
        model: model.trim(),
        year: Number(year),
        color,
        ...(driverId ? { driverId } : {}),
      });
      onVehiclesChange([v, ...vehicles]);
      resetForm();
      setShowCreate(false);
    } catch (e) {
      const msg = e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Erro ao criar veículo';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(v: Vehicle) {
    if (!confirm(`Desativar veículo "${v.plate}"?`)) return;
    setDeletingId(v.id);
    try {
      await deleteVehicle(v.id);
      onVehiclesChange(vehicles.filter((x) => x.id !== v.id));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAssign(vehicleId: string, dId: string) {
    setAssigningId(vehicleId);
    try {
      const updated = await assignDriver(vehicleId, dId);
      onVehiclesChange(vehicles.map((v) => (v.id === vehicleId ? updated : v)));
    } finally {
      setAssigningId(null);
    }
  }

  async function handleUnassign(vehicleId: string) {
    if (!confirm('Remover motorista deste veículo?')) return;
    setAssigningId(vehicleId);
    try {
      const updated = await unassignDriver(vehicleId);
      onVehiclesChange(vehicles.map((v) => (v.id === vehicleId ? updated : v)));
    } finally {
      setAssigningId(null);
    }
  }

  async function handleUploadLicence(vehicleId: string, file: File) {
    setUploadingId(vehicleId);
    try {
      const updated = await uploadVehicleLicence(vehicleId, file);
      onVehiclesChange(vehicles.map((v) => (v.id === vehicleId ? { ...v, ...updated } : v)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro no upload');
    } finally {
      setUploadingId(null);
    }
  }

  const availableDrivers = drivers.filter((d) => !vehicles.some((v) => v.driverId === d.id));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Veículos</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Frota cadastrada — <code className="text-brand-gold/90">GET /vehicles</code>
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95"
        >
          <Plus size={16} /> Novo Veículo
        </button>
      </div>

      <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Placa, modelo ou cor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-muted/10 rounded-xl py-3 pl-11 pr-4 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Veículo</th>
                <th className="px-6 py-4">Placa</th>
                <th className="px-6 py-4">Ano / Cor</th>
                <th className="px-6 py-4">Motorista</th>
                <th className="px-6 py-4">Licença</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted text-sm">
                    {search ? 'Nenhum veículo encontrado.' : 'Nenhum veículo cadastrado.'}
                  </td>
                </tr>
              ) : null}
              {filtered.map((v) => {
                const assignedDriver = drivers.find((d) => d.id === v.driverId);
                return (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                          <Car size={16} className="text-brand-red" />
                        </div>
                        <span className="text-on-surface text-sm font-bold">{v.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface font-bold">{v.plate}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{v.year ?? '—'} · {v.color ?? '—'}</td>
                    <td className="px-6 py-4">
                      {assignedDriver ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-red/30 to-brand-gold/30 flex items-center justify-center text-[9px] font-bold text-on-surface border border-white/10">
                            {assignedDriver.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="text-sm text-on-surface truncate max-w-[100px]">{assignedDriver.name}</span>
                          <button
                            onClick={() => handleUnassign(v.id)}
                            disabled={assigningId === v.id}
                            title="Remover motorista"
                            className="p-1 text-muted hover:text-brand-red transition-colors rounded-md hover:bg-brand-red/10 disabled:opacity-50"
                          >
                            {assigningId === v.id ? <Loader2 size={12} className="animate-spin" /> : <Link2Off size={12} />}
                          </button>
                        </div>
                      ) : (
                        <select
                          className="bg-white/5 border border-muted/20 rounded-lg px-2 py-1 text-xs text-on-surface-variant focus:border-brand-gold/50 outline-none"
                          value=""
                          disabled={assigningId === v.id}
                          onChange={(e) => e.target.value && handleAssign(v.id, e.target.value)}
                        >
                          <option value="">— Vincular —</option>
                          {availableDrivers.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {v.licenceUrl ? (
                        <a
                          href={v.licenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-brand-gold text-xs hover:underline"
                        >
                          <FileText size={12} /> Ver
                        </a>
                      ) : (
                        <label className="flex items-center gap-1 text-muted text-xs hover:text-brand-gold cursor-pointer transition-colors">
                          {uploadingId === v.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Upload size={12} />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            className="hidden"
                            disabled={uploadingId === v.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadLicence(v.id, file);
                            }}
                          />
                        </label>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${v.isActive !== false ? 'bg-green-400/15 text-green-400' : 'bg-muted/15 text-muted'}`}>
                        {v.isActive !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(v)}
                        disabled={deletingId === v.id}
                        className="p-2 text-muted hover:text-brand-red transition-colors hover:bg-brand-red/10 rounded-lg disabled:opacity-50"
                        title="Desativar"
                      >
                        {deletingId === v.id ? <MoreVertical size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-muted/20">
          <span className="text-muted text-xs">{filtered.length} veículo(s)</span>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container border border-muted/20 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-muted/10">
              <h2 className="text-on-surface font-headline font-extrabold text-lg">Novo Veículo</h2>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Placa *</label>
                  <input
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="ABC-1234"
                    required
                    className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all font-mono uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Ano *</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                    className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Modelo *</label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Toyota Corolla"
                  required
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Cor *</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                >
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase">Motorista (opcional)</label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full bg-white/5 border border-muted/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                >
                  <option value="">— Sem motorista —</option>
                  {availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
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
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
