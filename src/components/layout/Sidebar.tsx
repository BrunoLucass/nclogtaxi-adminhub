import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AuthUser } from '@/context/AuthContext';

// ── Types ────────────────────────────────────────────────────────────────────

export type SidebarItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type SidebarProps = {
  items: SidebarItem[];
  isSidebarCollapsed: boolean;
  user: AuthUser | null;
  onToggleCollapse: () => void;
  onLogout: () => void;
};

// ── Sub-components ───────────────────────────────────────────────────────────

function SidebarBrand({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <div className="h-16 px-3 flex items-center gap-2">
      {/* Logo / wordmark */}
      <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${collapsed ? 'justify-center' : ''}`}>
        <img
          src="/nclog-logo.png"
          alt="NCLOG"
          className="h-7 w-auto object-contain mix-blend-lighten shrink-0"
          decoding="async"
        />
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center leading-none tracking-tight truncate"
          >
            <span className="font-headline font-bold text-sm text-on-surface">NCLOG</span>
            <span className="font-headline font-bold text-sm text-primary ml-1">TÁXI</span>
          </motion.div>
        )}
      </div>

      {/* Toggle — always in normal flow, never absolute */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        className="shrink-0 p-1.5 text-muted hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}

function SidebarNav({ items, collapsed }: { items: SidebarItem[]; collapsed: boolean }) {
  return (
    <nav className="px-3 space-y-0.5 mt-4" aria-label="Menu principal">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
              isActive
                ? 'bg-surface-container-high text-on-surface'
                : 'text-muted hover:text-on-surface-variant hover:bg-surface-container'
            } ${collapsed ? 'justify-center' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                size={18}
                className={`shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-on-surface-variant transition-colors'}`}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[11px] font-semibold tracking-wide truncate ${isActive ? 'text-on-surface' : ''}`}
                >
                  {item.label}
                </motion.span>
              )}
              {collapsed && isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-0.5 h-5 bg-primary rounded-r-full"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarUser({
  user,
  collapsed,
  onLogout,
}: {
  user: AuthUser | null;
  collapsed: boolean;
  onLogout: () => void;
}) {
  return (
    <div className={`px-3 ${collapsed ? 'flex flex-col items-center gap-3' : ''}`}>
      {/* User row */}
      <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'gap-3 px-2 py-2'}`}>
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-red to-primary flex items-center justify-center text-surface font-bold text-[10px]">
            {user?.initials ?? '??'}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-surface-dim rounded-full" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-on-surface truncate">{user?.name ?? '—'}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 truncate">{user?.roleLabel ?? '—'}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          aria-label="Sair"
          title="Sair"
          className="p-1.5 text-muted hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10 shrink-0"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Brand footer */}
      {!collapsed && (
        <p className="text-[9px] text-muted/30 text-center tracking-wide mt-3 select-none">
          © NCLOG Tecnologia 2026
        </p>
      )}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({ items, isSidebarCollapsed, user, onToggleCollapse, onLogout }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-surface-dim flex flex-col justify-between pb-5 relative z-30 overflow-hidden shrink-0"
    >
      <div className="flex flex-col gap-0 min-h-0 flex-1">
        <SidebarBrand collapsed={isSidebarCollapsed} onToggle={onToggleCollapse} />

        {/* Separator via color shift — no border */}
        <div className="mx-3 h-px bg-surface-container shrink-0" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <SidebarNav items={items} collapsed={isSidebarCollapsed} />
        </div>
      </div>

      {/* Separator */}
      <div className="mx-3 h-px bg-surface-container mb-4 shrink-0" />

      <SidebarUser user={user} collapsed={isSidebarCollapsed} onLogout={onLogout} />
    </motion.aside>
  );
}
