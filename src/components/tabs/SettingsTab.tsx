export function SettingsTab() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Configurações</h1>
      <p className="text-on-surface-variant text-sm mt-2 max-w-xl">
        Preferências de conta e integrações serão adicionadas aqui. Roles e{' '}
        <code className="text-brand-gold/90">organization_id</code> continuam no Supabase (app_metadata).
      </p>
    </div>
  );
}
