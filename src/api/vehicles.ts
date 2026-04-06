import { apiFetch, apiFetchJson } from '@/api/client';
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle } from '@/types/api';

export function listVehicles(params?: { driverId?: string; active?: boolean }): Promise<Vehicle[]> {
  const q = new URLSearchParams();
  if (params?.driverId) q.set('driverId', params.driverId);
  if (params?.active !== undefined) q.set('active', String(params.active));
  const qs = q.toString();
  return apiFetchJson<Vehicle[]>(`/vehicles${qs ? `?${qs}` : ''}`);
}

export function getVehicle(id: string): Promise<Vehicle> {
  return apiFetchJson<Vehicle>(`/vehicles/${id}`);
}

export function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  return apiFetchJson<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  return apiFetchJson<Vehicle>(`/vehicles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteVehicle(id: string): Promise<void> {
  return apiFetchJson<void>(`/vehicles/${id}`, { method: 'DELETE' });
}

export function assignDriver(vehicleId: string, driverId: string): Promise<Vehicle> {
  return apiFetchJson<Vehicle>(`/vehicles/${vehicleId}/assign/${driverId}`, { method: 'POST' });
}

export function unassignDriver(vehicleId: string): Promise<Vehicle> {
  return apiFetchJson<Vehicle>(`/vehicles/${vehicleId}/assign`, { method: 'DELETE' });
}

export async function uploadVehicleLicence(vehicleId: string, file: File): Promise<Vehicle> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch(`/vehicles/${vehicleId}/licence`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload falhou (${res.status})`);
  }
  return res.json() as Promise<Vehicle>;
}
