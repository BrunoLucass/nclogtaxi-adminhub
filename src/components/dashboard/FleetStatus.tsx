import { motion } from 'motion/react';
import { Car, UserPlus, AlertCircle } from 'lucide-react';
import type { Driver, Trip } from '@/types/api';

type FleetStatusProps = {
  drivers: Driver[];
  trips: Trip[];
};

export function FleetStatus({ drivers, trips }: FleetStatusProps) {
  const total = Math.max(drivers.length, 1);
  const freeDrivers = drivers.filter((d) => d.isAvailable).length;
  const tripsInProgress = trips.filter((t) => (t.status ?? '').toLowerCase() === 'in_progress').length;
  const unavailableDrivers = drivers.filter((d) => d.isAvailable === false).length;
  const pendingCount = trips.filter((t) =>
    ['pending', 'dispatching'].includes((t.status ?? '').toLowerCase()),
  ).length;

  const fleetItems = [
    { label: 'Motoristas disponíveis', count: freeDrivers, color: 'bg-green-400' },
    { label: 'Corridas em curso', count: tripsInProgress, color: 'bg-brand-gold' },
    { label: 'Motoristas indisponíveis', count: unavailableDrivers, color: 'bg-brand-red' },
  ];

  return (
    <div className="bg-surface-container rounded-2xl border border-muted/20 p-6 shadow-sm">
      <h3 className="text-on-surface font-headline font-extrabold text-lg tracking-tight mb-6">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-muted/10 hover:border-brand-gold/50 transition-all group">
          <UserPlus className="text-brand-gold mb-2 group-hover:scale-110 transition-transform" size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Novo Cliente</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-muted/10 hover:border-brand-red/50 transition-all group">
          <Car className="text-brand-red mb-2 group-hover:scale-110 transition-transform" size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Novo Veículo</span>
        </button>
      </div>

      <h3 className="text-on-surface font-headline font-extrabold text-sm tracking-tight mb-4">Status da Central</h3>
      <div className="space-y-6">
        {fleetItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              <span className="text-on-surface text-xs font-bold">{item.count}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / total) * 100}%` }}
                className={`h-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-brand-red/5 rounded-xl border border-brand-red/10 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <AlertCircle className="text-brand-red" size={18} />
          <span className="text-on-surface text-xs font-bold">Solicitações Pendentes</span>
        </div>
        <p className="text-on-surface-variant text-[10px] leading-relaxed relative z-10">
          {pendingCount === 0
            ? 'Nenhuma corrida pendente ou em despacho no momento.'
            : `Existem ${pendingCount} corrida(s) pendente(s) ou em despacho aguardando motorista.`}
        </p>
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-red/5 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-brand-red/10 transition-colors" />
      </div>
    </div>
  );
}
