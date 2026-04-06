import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/api/client';
import { listTrips } from '@/api/trips';
import { listDrivers } from '@/api/drivers';
import { getDailyReport } from '@/api/reports';
import type { DailyTripReport, Driver, Trip, Organization } from '@/types/api';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentTripsTable } from '@/components/dashboard/RecentTripsTable';
import { FleetStatus } from '@/components/dashboard/FleetStatus';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import { CreateTripModal } from '@/components/modals/CreateTripModal';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [report, setReport] = useState<DailyTripReport | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewTrip, setShowNewTrip] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const date = new Date().toISOString().slice(0, 10);
        const orgId = user?.organizationId ?? undefined;

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
  }, [user?.organizationId]);

  return (
    <>
      {loadError && (
        <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loadError}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
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
      </div>

      <CreateOrganizationModal
        open={showNewClient}
        onClose={() => setShowNewClient(false)}
        onCreated={() => {}}
      />
      <CreateTripModal
        open={showNewTrip}
        onClose={() => setShowNewTrip(false)}
        onCreated={(trip) => setTrips((prev) => [trip, ...prev])}
      />
    </>
  );
}
