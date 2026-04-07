import { CalendarDays, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

type TopBarProps = {
  title: string;
  description: string;
};

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TopBar({ title, description }: TopBarProps) {
  const { pathname } = useLocation();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-surface-dim">
      {/* Left — title + description */}
      <div className="flex flex-col justify-center min-w-0">
        <AnimatePresence mode="wait">
          <motion.h1
            key={pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="font-headline font-bold text-xl text-on-surface leading-none tracking-tight"
          >
            {title}
          </motion.h1>
        </AnimatePresence>
        <motion.p
          key={pathname + '-desc'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.06 }}
          className="text-xs text-muted mt-1.5 leading-none"
        >
          {description}
        </motion.p>
      </div>

      {/* Right — portal slot + date chip */}
      <div className="flex items-center gap-2">
        {/* Pages inject their own filter controls here via portal */}
        <div id="page-filters" className="contents" />

        {/* Generic filter icon */}
        <button
          aria-label="Filtros"
          className="flex items-center justify-center w-9 h-9 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container transition-all"
        >
          <SlidersHorizontal size={15} />
        </button>

        {/* Date chip */}
        <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant font-medium capitalize select-none">
          <CalendarDays size={13} className="text-muted" />
          {todayLabel()}
        </div>
      </div>
    </header>
  );
}
