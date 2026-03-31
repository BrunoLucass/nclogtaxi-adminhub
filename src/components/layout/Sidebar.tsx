import { motion } from 'motion/react';
import { Car, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  menuItems: MenuItem[];
  activeTab: string;
  isSidebarCollapsed: boolean;
  onTabChange: (id: string) => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
};

export function Sidebar({
  menuItems,
  activeTab,
  isSidebarCollapsed,
  onTabChange,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      className="bg-surface-container border-r border-white/5 flex flex-col justify-between pb-6 relative z-30 shadow-2xl"
    >
      <div>
        {/* Logo & Toggle */}
        <div className={`h-16 px-6 flex items-center relative ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-8 h-8 bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20"
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
              >
                <Car className="text-white w-4 h-4" />
              </div>
              <div className="flex items-center tracking-tight leading-none">
                <span className="text-on-surface font-headline font-bold text-lg">NCLOG</span>
                <span className="text-brand-gold font-headline font-bold text-lg ml-1">TÁXI</span>
              </div>
            </motion.div>
          )}
          {isSidebarCollapsed && (
            <div
              className="w-10 h-10 bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20"
              style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
            >
              <Car className="text-white w-5 h-5" />
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 text-muted hover:text-brand-gold transition-colors border border-white/10 rounded-lg hover:bg-white/5 ${isSidebarCollapsed ? 'absolute -right-3 top-1/2 -translate-y-1/2 bg-surface-container shadow-md' : ''}`}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="px-6">
          <div className="h-px bg-white/5 w-full" />
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1.5 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                activeTab === item.id
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon
                size={20}
                className={activeTab === item.id ? 'text-white' : 'group-hover:text-brand-gold transition-colors'}
              />
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] font-semibold tracking-wide uppercase"
                >
                  {item.label}
                </motion.span>
              )}
              {isSidebarCollapsed && activeTab === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-brand-gold rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* User & Logout */}
      <div className="px-3">
        <div className="h-px bg-white/5 mb-6 mx-2" />

        <div className={`relative overflow-hidden rounded-2xl p-3 transition-all ${isSidebarCollapsed ? 'flex flex-col items-center gap-4' : 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl'}`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-red to-brand-gold flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  BA
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container rounded-full shadow-sm" />
              </div>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <span className="text-on-surface text-[11px] font-semibold truncate">Bruno Almeida</span>
                  <span className="text-brand-gold/80 text-[8px] font-semibold uppercase tracking-widest truncate">Admin Master</span>
                </motion.div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={onLogout}
                className="p-2 text-on-surface-variant hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {isSidebarCollapsed && (
            <button
              onClick={onLogout}
              className="p-2 text-on-surface-variant hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
            >
              <LogOut size={20} />
            </button>
          )}

          {!isSidebarCollapsed && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl -mr-12 -mt-12" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}
