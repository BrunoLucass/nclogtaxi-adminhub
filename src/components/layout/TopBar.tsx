import { Bell } from 'lucide-react';

type TopBarProps = {
  activeTabLabel: string;
};

export function TopBar({ activeTabLabel }: TopBarProps) {
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="h-16 bg-surface-container/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <h2 className="text-on-surface font-headline font-extrabold text-lg tracking-tight">
            {activeTabLabel}
          </h2>
        </div>
        <div className="h-4 w-px bg-muted/30" />
        <span className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-60">
          {today}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 text-muted hover:text-on-surface transition-colors bg-white/5 rounded-full border border-transparent hover:border-muted/20">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border-2 border-surface-container" />
        </button>
      </div>
    </header>
  );
}
