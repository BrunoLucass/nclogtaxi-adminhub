import { useState, useMemo } from 'react';
import { Car, FileText, Link2Off, Loader2, Plus, Search, Trash2, Upload } from 'lucide-react';
import { assignDriver, createVehicle, deleteVehicle, unassignDriver, uploadVehicleLicence } from '@/api/vehicles';
import { ApiRequestError } from '@/api/client';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Driver, Vehicle } from '@/types/api';

const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Outro'];

type Props = {
  vehicles: Vehicle[];
  drivers: Driver[];
  loading: boolean;
  onVehiclesChange: (vehicles: Vehicle[]) => void;
};

export function VehiclesTab({ vehicles, drivers, loading, onVehiclesChange }: Props) {
  const [search, setSearch]         = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [formError, setFormError]   = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [plate, setPlate]   = useState('');
  const [model, setModel]   = useState('');
  const [year, setYear]     = useState(String(new Date().getFullYear()));
  const [color, setColor]   = useState('Branco');
  const [driverId, setDriverId] = useState('');

  const filtered = useMemo(
    () => vehicles.filter((v) => `${v.plate} ${v.model} ${v.color}`.toLowerCase().includes(search.toLowerCase())),
    [vehicles, search],
  );

  const availableDrivers = useMemo(
    () => drivers.filter((d) => !vehicles.some((v) => v.driverId === d.id)),
    [drivers, vehicles],
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
      const v = await createVehicle({ plate: plate.trim(), model: model.trim(), year: Number(year), color, ...(driverId ? { driverId } : {}) });
      onVehiclesChange([v, ...vehicles]);
      resetForm();
      setShowCreate(false);
    } catch (e) {
      setFormError(e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Erro ao criar veículo');
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

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            type="text"
            placeholder="Placa, modelo ou cor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-surface-container pl-9 pr-4 text-sm text-on-surface placeholder:text-muted rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="ml-auto flex items-center gap-2 h-9 px-4 bg-brand-red hover:bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-red/20"
        >
          <Plus size={14} /> Novo Veículo
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden bg-surface-container-low">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_140px_1fr_100px_80px_40px] items-center px-4 py-2.5 bg-surface-dim">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Veículo</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Placa</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Ano / Cor</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Motorista</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Licença</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Status</span>
          <span />
        </div>

        {/* Skeleton */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_140px_1fr_100px_80px_40px] items-center gap-3 px-4 py-4 border-t border-surface-container">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-lg" />
          </div>
        ))}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="px-4 py-14 text-center text-muted text-sm border-t border-surface-container">
            {search ? 'Nenhum veículo encontrado.' : 'Nenhum veículo cadastrado.'}
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((v) => {
          const assignedDriver = drivers.find((d) => d.id === v.driverId);
          return (
            <div key={v.id} className="grid grid-cols-[1fr_100px_140px_1fr_100px_80px_40px] items-center px-4 py-4 border-t border-surface-container hover:bg-surface-container transition-colors group">
              {/* Model */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
                  <Car size={14} className="text-brand-red" />
                </div>
                <span className="text-sm font-semibold text-on-surface truncate">{v.model}</span>
              </div>

              {/* Plate */}
              <span className="font-mono text-sm text-on-surface font-bold">{v.plate}</span>

              {/* Year / Color */}
              <span className="text-sm text-on-surface-variant">{v.year ?? '—'} · {v.color ?? '—'}</span>

              {/* Driver */}
              {assignedDriver ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-red/30 to-primary/30 flex items-center justify-center text-[9px] font-bold text-on-surface shrink-0">
                    {assignedDriver.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <span className="text-sm text-on-surface truncate max-w-[100px]">{assignedDriver.name}</span>
                  <button
                    onClick={() => handleUnassign(v.id)}
                    disabled={assigningId === v.id}
                    aria-label="Remover motorista"
                    title="Remover motorista"
                    className="p-1 text-muted hover:text-brand-red transition-colors rounded-md hover:bg-brand-red/10 disabled:opacity-40 shrink-0"
                  >
                    {assigningId === v.id ? <Loader2 size={12} className="animate-spin" /> : <Link2Off size={12} />}
                  </button>
                </div>
              ) : (
                <select
                  className="bg-surface-container rounded-lg px-2 py-1 text-xs text-on-surface-variant outline-none focus:ring-1 focus:ring-primary/30 max-w-[160px]"
                  value=""
                  disabled={assigningId === v.id}
                  onChange={(e) => e.target.value && handleAssign(v.id, e.target.value)}
                >
                  <option value="">— Vincular —</option>
                  {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}

              {/* Licence */}
              {v.licenceUrl ? (
                <a href={v.licenceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-xs hover:underline">
                  <FileText size={12} /> Ver
                </a>
              ) : (
                <label className="flex items-center gap-1 text-muted text-xs hover:text-primary cursor-pointer transition-colors">
                  {uploadingId === v.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Upload
                  <input type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" disabled={uploadingId === v.id}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadLicence(v.id, f); }}
                  />
                </label>
              )}

              {/* Status */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${v.isActive !== false ? 'bg-green-400/15 text-green-400' : 'bg-muted/15 text-muted'}`}>
                {v.isActive !== false ? 'Ativo' : 'Inativo'}
              </span>

              {/* Delete */}
              <button
                onClick={() => handleDelete(v)}
                disabled={deletingId === v.id}
                aria-label={`Desativar ${v.plate}`}
                className="flex items-center justify-center w-7 h-7 text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors disabled:opacity-40"
              >
                {deletingId === v.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          );
        })}

        {!loading && (
          <div className="px-4 py-3 border-t border-surface-container">
            <span className="text-[11px] text-muted">{filtered.length} veículo(s)</span>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} title="Novo Veículo" onClose={() => setShowCreate(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="vehicle-plate" className="text-[10px] font-bold tracking-widest text-muted uppercase">Placa *</label>
              <input id="vehicle-plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC-1234" required
                className="w-full bg-surface-dim border border-white/5 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary/60 outline-none transition-all font-mono uppercase" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="vehicle-year" className="text-[10px] font-bold tracking-widest text-muted uppercase">Ano *</label>
              <input id="vehicle-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} min="1990" max={new Date().getFullYear() + 1} required
                className="w-full bg-surface-dim border border-white/5 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary/60 outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vehicle-model" className="text-[10px] font-bold tracking-widest text-muted uppercase">Modelo *</label>
            <input id="vehicle-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Toyota Corolla" required
              className="w-full bg-surface-dim border border-white/5 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary/60 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vehicle-color" className="text-[10px] font-bold tracking-widest text-muted uppercase">Cor *</label>
            <select id="vehicle-color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-full bg-surface-dim border border-white/5 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary/60 outline-none transition-all">
              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vehicle-driver" className="text-[10px] font-bold tracking-widest text-muted uppercase">Motorista (opcional)</label>
            <select id="vehicle-driver" value={driverId} onChange={(e) => setDriverId(e.target.value)}
              className="w-full bg-surface-dim border border-white/5 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary/60 outline-none transition-all">
              <option value="">— Sem motorista —</option>
              {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)}
              className="flex-1 py-2.5 rounded-xl border border-muted/20 text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-maroon text-white text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Cadastrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
