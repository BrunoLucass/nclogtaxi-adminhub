import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiRequestError } from '@/api/client';
import { listTrips } from '@/api/trips';
import type { Pagination, Trip, TripFilters } from '@/types/api';
import { RidesTab } from '@/components/tabs/RidesTab';

export function RidesPage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<TripFilters>({ page: 1, limit: 50 });
  const cancelledRef = useRef(false);

  const load = useCallback(async () => {
    cancelledRef.current = false;
    setLoading(true);
    setLoadError(null);
    try {
      const res = await listTrips(filters);
      if (!cancelledRef.current) {
        setTrips(res.data);
        setPagination(res.pagination);
      }
    } catch (e) {
      if (!cancelledRef.current) {
        const msg =
          e instanceof ApiRequestError
            ? `${e.message} (${e.status})`
            : e instanceof Error
              ? e.message
              : 'Erro ao carregar corridas';
        setLoadError(msg);
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
    return () => { cancelledRef.current = true; };
  }, [load]);

  function handlePageChange(page: number) {
    setFilters((f) => ({ ...f, page }));
  }

  return (
    <>
      {loadError && (
        <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loadError}
        </div>
      )}
      <RidesTab
        trips={trips}
        loading={loading}
        onTripsChange={setTrips}
        pagination={pagination}
        onPageChange={handlePageChange}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </>
  );
}
