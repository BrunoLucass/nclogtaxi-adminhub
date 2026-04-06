import { useState, useEffect } from 'react';
import { ApiRequestError } from '@/api/client';
import { listDrivers } from '@/api/drivers';
import type { Driver } from '@/types/api';
import { DriversTab } from '@/components/tabs/DriversTab';

export function DriversPage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const d = await listDrivers();
        if (!cancelled) setDrivers(d);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar motoristas';
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
      <DriversTab
        drivers={drivers}
        loading={loading}
        onDriversChange={setDrivers}
      />
    </>
  );
}
