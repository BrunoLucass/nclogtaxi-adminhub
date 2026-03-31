/** Normaliza status da API para rótulo curto em PT. */
export function tripStatusLabel(status: string | undefined): string {
  const s = (status ?? '').toLowerCase();
  const map: Record<string, string> = {
    pending: 'Pendente',
    dispatching: 'Despachando',
    accepted: 'Aceita',
    in_progress: 'Em curso',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
  };
  return map[s] ?? status ?? '—';
}

export function tripStatusTone(
  status: string | undefined,
): 'active' | 'done' | 'pending' | 'error' {
  const s = (status ?? '').toLowerCase();
  if (s === 'in_progress' || s === 'dispatching') return 'active';
  if (s === 'completed') return 'done';
  if (s === 'cancelled') return 'error';
  return 'pending';
}
