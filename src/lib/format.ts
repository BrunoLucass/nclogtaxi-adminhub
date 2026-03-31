/** Formata centavos (BRL) para exibição. */
export function formatBRLFromCents(cents: number | undefined | null): string {
  if (cents == null || Number.isNaN(cents)) {
    return '—';
  }
  const v = cents / 100;
  return v.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}
