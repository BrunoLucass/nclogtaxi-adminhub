import { motion } from 'motion/react';
import { Route, Users, UserPlus, TrendingUp } from 'lucide-react';
import { formatBRLFromCents } from '@/lib/format';
import type { DailyTripReport, Driver } from '@/types/api';

type StatsGridProps = {
  report: DailyTripReport | null;
  drivers: Driver[];
  loading: boolean;
};

export function StatsGrid({ report, drivers, loading }: StatsGridProps) {
  const stats = [
    {
      label: 'Corridas no dia',
      value: report != null ? String(report.totalTrips) : loading ? '…' : '—',
      trend: report ? `${report.completedTrips} concluídas` : '',
      icon: Route,
      color: 'text-brand-red',
    },
    {
      label: 'Motoristas disponíveis',
      value:
        drivers.length > 0
          ? String(drivers.filter((d) => d.isAvailable).length)
          : loading
            ? '…'
            : '—',
      trend: drivers.length ? `de ${drivers.length} cadastrados` : '',
      icon: Users,
      color: 'text-brand-gold',
    },
    {
      label: 'Corridas canceladas',
      value: report != null ? String(report.cancelledTrips) : loading ? '…' : '—',
      trend: '',
      icon: UserPlus,
      color: 'text-green-400',
    },
    {
      label: 'Faturamento (dia)',
      value:
        report != null
          ? formatBRLFromCents(report.totalAmountCents)
          : loading
            ? '…'
            : '—',
      trend: '',
      icon: TrendingUp,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface-container p-6 rounded-2xl border border-muted/20 hover:border-brand-gold/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-brand-gold/5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
              <stat.icon size={24} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-muted'}`}>
              {stat.trend}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</span>
            <span className="text-on-surface font-headline font-extrabold text-2xl tracking-tight">{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
