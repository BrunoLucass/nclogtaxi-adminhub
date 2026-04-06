import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  DollarSign,
  LayoutDashboard,
  Receipt,
  Route,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, type SidebarItem } from '@/components/layout/Sidebar';

const ADMIN_MENU: SidebarItem[] = [
  { path: '/admin', label: 'Painel Geral', icon: LayoutDashboard },
  { path: '/admin/clients', label: 'Clientes', icon: Users },
  { path: '/admin/drivers', label: 'Motoristas', icon: UserPlus },
  { path: '/admin/vehicles', label: 'Veículos', icon: Car },
  { path: '/admin/rides', label: 'Corridas', icon: Route },
  { path: '/admin/finance', label: 'Financeiro', icon: TrendingUp },
  { path: '/admin/pricing', label: 'Precificação', icon: DollarSign },
  { path: '/admin/subscriptions', label: 'Mensalidades', icon: Receipt },
  { path: '/admin/users', label: 'Usuários', icon: ShieldCheck },
  { path: '/admin/settings', label: 'Configurações', icon: Settings },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentItem = ADMIN_MENU.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path),
  );
  const pageTitle = currentItem?.label ?? '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full bg-surface-dim overflow-hidden"
    >
      <Sidebar
        items={ADMIN_MENU}
        isSidebarCollapsed={isSidebarCollapsed}
        user={user}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />
        </div>

        <main className="flex-1 overflow-y-auto bg-surface-dim relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-0" />

          {/* Sticky page header */}
          <div className="sticky top-0 z-20 bg-surface-dim/90 backdrop-blur-md border-b border-white/5 px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.h1
                  key={location.pathname}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-on-surface font-headline font-extrabold text-base tracking-tight"
                >
                  {pageTitle}
                </motion.h1>
              </AnimatePresence>
            </div>
            <div id="page-filters" />
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-100 mix-blend-screen z-50"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUiZCNWeHrecIrQSRmuF1KcEuF7iIqa-CxthWE48VuC9h-BMu7d2cV-Q6d7lqvBZJbfAeb9vnIIfZnWA3IQMZIDwiRwfqFpEGTDOT2U6UeXc2o6D-R7-X7u9gv0QvKRWVdiGf1SZcqtTHsQhgEKaz_qdRgGUajYCyWE9gn9AAyhK7ULIr7BK4hKX2JwbK3GxjtoVHTZTUf9aJ2ufotZ_9L23vqapOCxY2ygnxZ9FoB4SxABkB18f7H-fo34l5nGc8sFE8URbcOydpp')" }}
      />
    </motion.div>
  );
}
