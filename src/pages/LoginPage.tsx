import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { loginErrorToDisplay } from '@/api/auth';
import { Eye, EyeOff, Route } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok === false) {
        setError(loginErrorToDisplay(result));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-full overflow-hidden"
    >
      {/* Left Section: Form */}
      <section className="w-full md:w-1/2 bg-surface-elevated p-8 md:p-24 flex flex-col justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-12 md:left-24 flex items-center gap-4 md:gap-5 min-w-0 isolate"
        >
          <div className="flex shrink-0 items-center justify-center">
            <img
              src="/nclog-logo.png"
              alt=""
              className="block h-10 w-auto max-h-10 sm:h-11 sm:max-h-11 md:h-12 md:max-h-12 object-contain object-left mix-blend-lighten"
              decoding="async"
            />
          </div>
          <span className="text-on-surface font-headline font-extrabold text-base sm:text-lg md:text-xl tracking-tight whitespace-nowrap leading-none pl-0.5">
            NCLOG Tecnologia
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-sm w-full mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-on-surface font-headline text-4xl font-extrabold tracking-tight">Painel Administrativo</h1>
            <p className="text-on-surface-variant text-sm mt-2">Gerencie sua central de transporte com segurança.</p>
          </div>

          {error ? (
            <div
              className="mb-6 rounded-md border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-muted uppercase ml-1">E-mail Corporativo</label>
              <input
                className="w-full h-12 bg-surface-dim text-on-surface px-4 border-b border-transparent focus:border-brand-gold transition-all outline-none rounded-md"
                placeholder="admin@nclog.com.br"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-widest text-muted uppercase ml-1">Senha de Acesso</label>
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 bg-surface-dim text-on-surface px-4 border-b border-transparent focus:border-brand-gold transition-all outline-none rounded-md"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-brand-red hover:bg-brand-maroon disabled:opacity-60 disabled:pointer-events-none text-white font-headline font-extrabold tracking-widest text-xs rounded-md transition-all active:scale-[0.98] uppercase"
            >
              {loading ? 'ENTRANDO…' : 'ENTRAR NO SISTEMA'}
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center text-center">
            <a className="text-muted text-[10px] font-bold hover:text-brand-gold transition-colors uppercase tracking-widest" href="#">
              Esqueci minha senha
            </a>
          </div>
        </motion.div>
      </section>

      {/* Right Section: Identity */}
      <section className="hidden md:flex w-1/2 bg-surface-dim relative overflow-hidden items-center justify-center p-24">
        <div className="relative z-10 text-center max-w-md">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-on-surface font-headline text-5xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Central{' '}
            <span className="text-brand-gold">NCLOG Táxi</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant font-medium text-base leading-relaxed"
          >
            Gerencie motoristas, clientes e toda a operação.
          </motion.p>
        </div>

        <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.02]">
          <Route className="w-[600px] h-[600px] text-white" />
        </div>
      </section>

      {/* Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-100 mix-blend-screen"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUiZCNWeHrecIrQSRmuF1KcEuF7iIqa-CxthWE48VuC9h-BMu7d2cV-Q6d7lqvBZJbfAeb9vnIIfZnWA3IQMZIDwiRwfqFpEGTDOT2U6UeXc2o6D-R7-X7u9gv0QvKRWVdiGf1SZcqtTHsQhgEKaz_qdRgGUajYCyWE9gn9AAyhK7ULIr7BK4hKX2JwbK3GxjtoVHTZTUf9aJ2ufotZ_9L23vqapOCxY2ygnxZ9FoB4SxABkB18f7H-fo34l5nGc8sFE8URbcOydpp')" }}
      />
    </motion.div>
  );
}
