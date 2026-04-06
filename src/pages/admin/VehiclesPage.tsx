import { useState, useEffect } from 'react';
import { ApiRequestError } from '@/api/client';
import { listVehicles } from '@/api/vehicles';
import { listDrivers } from '@/api/drivers';
import type { Driver, Vehicle } from '@/types/api';
import { VehiclesTab } from '@/components/tabs/VehiclesTab';

export function VehiclesPage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [vs, ds] = await Promise.all([listVehicles(), listDrivers()]);
        if (!cancelled) {
          setVehicles(vs);
          setDrivers(ds);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar veículos';
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {loadError && (
        <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loadError}
        </div>
      )}
      <VehiclesTab
        vehicles={vehicles}
        drivers={drivers}
        loading={loading}
        onVehiclesChange={setVehicles}
      />
    </>
  );
}
