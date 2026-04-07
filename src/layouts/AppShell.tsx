/**
 * AppShell — shared structural shell for Admin and Client layouts.
 * Handles sidebar + topbar + page content, no decorative effects.
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, type SidebarItem } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export type ShellItem = SidebarItem & {
  description: string;
  /** path prefix used for exact match (index routes like /admin, /client) */
  exact?: boolean;
};

type AppShellProps = {
  menu: ShellItem[];
  basePath: string;
};

export function AppShell({ menu, basePath }: AppShellProps) {
  const { logout, user } = useAuth();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const current = menu.find((item) =>
    item.exact
      ? pathname === item.path
      : pathname === item.path || pathname.startsWith(item.path + '/'),
  );

  const pageTitle       = current?.label       ?? basePath;
  const pageDescription = current?.description ?? '';

  return (
    <div className="flex h-screen w-full bg-surface overflow-hidden">
      <Sidebar
        items={menu}
        isSidebarCollapsed={collapsed}
        user={user}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar title={pageTitle} description={pageDescription} />

        {/* Subtle separator between topbar and content */}
        <div className="h-px bg-surface-container-low shrink-0" />

        <main className="flex-1 overflow-y-auto bg-surface">
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
