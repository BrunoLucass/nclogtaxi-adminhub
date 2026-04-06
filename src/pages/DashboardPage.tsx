import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, LayoutDashboard, Route, Settings, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/api/client';
import { listOrganizations } from '@/api/organizations';
import { listDrivers } from '@/api/drivers';
import { listTrips } from '@/api/trips';
import { listVouchers } from '@/api/vouchers';
import { getDailyReport } from '@/api/reports';
import type { DailyTripReport, Driver, Organization, Trip, Voucher } from '@/types/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentTripsTable } from '@/components/dashboard/RecentTripsTable';
import { FleetStatus } from '@/components/dashboard/FleetStatus';
import { ClientsTab } from '@/components/tabs/ClientsTab';
import { DriversTab } from '@/components/tabs/DriversTab';
import { RidesTab } from '@/components/tabs/RidesTab';
import { FinanceTab } from '@/components/tabs/FinanceTab';
import { VehiclesTab } from '@/components/tabs/VehiclesTab';
import { SettingsTab } from '@/components/tabs/SettingsTab';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import { CreateTripModal } from '@/components/modals/CreateTripModal';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'drivers', label: 'Motoristas', icon: UserPlus },
  { id: 'vehicles', label: 'Veículos', icon: Car },
  { id: 'rides', label: 'Corridas', icon: Route },
  { id: 'finance', label: 'Financeiro', icon: TrendingUp },
  { id: 'settings', label: 'Configurações', icon: Settings },
] as const;

export function DashboardPage() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [report, setReport] = useState<DailyTripReport | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // Quick-action modals accessible from the dashboard panel
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewTrip, setShowNewTrip] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        if (activeTab === 'dashboard') {
          const date = new Date().toISOString().slice(0, 10);
          const orgId = user?.organizationId ?? undefined;

          // Fetch report independently — a 400 (org required) must not block trips/drivers
          const [reportResult, tripRes, driverList] = await Promise.all([
            getDailyReport(date, orgId).catch(() => null),
            listTrips({ limit: 20 }),
            listDrivers(),
          ]);
          if (!cancelled) {
            setReport(reportResult);
            setTrips(tripRes.data);
            setDrivers(driverList);
          }
        } else if (activeTab === 'clients') {
          const orgs = await listOrganizations();
          if (!cancelled) setOrganizations(orgs);
        } else if (activeTab === 'drivers') {
          const d = await listDrivers();
          if (!cancelled) setDrivers(d);
        } else if (activeTab === 'rides') {
          const res = await listTrips();
          if (!cancelled) setTrips(res.data);
        } else if (activeTab === 'finance') {
          const vRes = await listVouchers();
          if (!cancelled) setVouchers(vRes.data);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar dados';
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  const activeTabLabel = MENU_ITEMS.find((i) => i.id === activeTab)?.label ?? '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full bg-surface-dim overflow-hidden"
    >
      <Sidebar
        menuItems={[...MENU_ITEMS]}
        activeTab={activeTab}
        isSidebarCollapsed={isSidebarCollapsed}
        user={user}
        onTabChange={setActiveTab}
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
                  key={activeTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-on-surface font-headline font-extrabold text-base tracking-tight"
                >
                  {activeTabLabel}
                </motion.h1>
              </AnimatePresence>
            </div>
            {/* Filter portal placeholder */}
            <div id="page-filters" />
          </div>

          <div className="p-8">
            {loadError && (
              <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {loadError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-7xl mx-auto space-y-8"
                >
                  <StatsGrid report={report} drivers={drivers} loading={loading} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <RecentTripsTable trips={trips} loading={loading} />
                    <FleetStatus
                      drivers={drivers}
                      trips={trips}
                      onNewClient={() => setShowNewClient(true)}
                      onNewTrip={() => setShowNewTrip(true)}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'clients' && (
                <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ClientsTab
                    organizations={organizations}
                    loading={loading}
                    onOrganizationsChange={setOrganizations}
                  />
                </motion.div>
              )}

              {activeTab === 'drivers' && (
                <motion.div key="drivers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <DriversTab
                    drivers={drivers}
                    loading={loading}
                    onDriversChange={setDrivers}
                  />
                </motion.div>
              )}

              {activeTab === 'rides' && (
                <motion.div key="rides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <RidesTab
                    trips={trips}
                    loading={loading}
                    onTripsChange={setTrips}
                  />
                </motion.div>
              )}

              {activeTab === 'finance' && (
                <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <FinanceTab
                    vouchers={vouchers}
                    loading={loading}
                    onVouchersChange={setVouchers}
                  />
                </motion.div>
              )}

              {activeTab === 'vehicles' && (
                <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <VehiclesTab />
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SettingsTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-100 mix-blend-screen z-50"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUiZCNWeHrecIrQSRmuF1KcEuF7iIqa-CxthWE48VuC9h-BMu7d2cV-Q6d7lqvBZJbfAeb9vnIIfZnWA3IQMZIDwiRwfqFpEGTDOT2U6UeXc2o6D-R7-X7u9gv0QvKRWVdiGf1SZcqtTHsQhgEKaz_qdRgGUajYCyWE9gn9AAyhK7ULIr7BK4hKX2JwbK3GxjtoVHTZTUf9aJ2ufotZ_9L23vqapOCxY2ygnxZ9FoB4SxABkB18f7H-fo34l5nGc8sFE8URbcOydpp')" }}
      />

      {/* Global quick-action modals (triggered from dashboard panel) */}
      <CreateOrganizationModal
        open={showNewClient}
        onClose={() => setShowNewClient(false)}
        onCreated={(org) => setOrganizations((prev) => [org, ...prev])}
      />
      <CreateTripModal
        open={showNewTrip}
        onClose={() => setShowNewTrip(false)}
        onCreated={(trip) => setTrips((prev) => [trip, ...prev])}
      />
    </motion.div>
  );
}
