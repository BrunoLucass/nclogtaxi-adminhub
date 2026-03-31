import type { Driver } from '@/types/api';

type DriversTabProps = {
  drivers: Driver[];
  loading: boolean;
};

export function DriversTab({ drivers, loading }: DriversTabProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Motoristas</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          <code className="text-brand-gold/90">GET /drivers</code> — fila e cadastro (admin).
        </p>
      </div>
      <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Disponível</th>
                <th className="px-6 py-4">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {drivers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted text-sm">
                    Nenhum motorista retornado.
                  </td>
                </tr>
              ) : null}
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-on-surface text-sm font-bold">{d.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{d.phone ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        d.isAvailable ? 'bg-green-400/15 text-green-400' : 'bg-muted/15 text-muted'
                      }`}
                    >
                      {d.isAvailable ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[200px]">{d.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
