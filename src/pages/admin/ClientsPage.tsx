import { useState, useEffect } from 'react';
import { ApiRequestError } from '@/api/client';
import { listOrganizations } from '@/api/organizations';
import type { Organization } from '@/types/api';
import { ClientsTab } from '@/components/tabs/ClientsTab';

export function ClientsPage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const orgs = await listOrganizations();
        if (!cancelled) setOrganizations(orgs);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar clientes';
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
      <ClientsTab
        organizations={organizations}
        loading={loading}
        onOrganizationsChange={setOrganizations}
      />
    </>
  );
}
