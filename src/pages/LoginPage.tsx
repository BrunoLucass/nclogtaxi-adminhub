import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { loginErrorToDisplay } from '@/api/auth';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const STATS = [
  { value: '500+', label: 'Corridas / mês' },
  { value: '98%',  label: 'Disponibilidade' },
  { value: '24/7', label: 'Monitoramento' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [remember, setRemember]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok === false) {
        setError(loginErrorToDisplay(result));
      } else {
        navigate('/', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen w-full overflow-hidden"
    >
      {/* ── LEFT: Dark hero ──────────────────────────── */}
      <section className="hidden md:flex md:w-1/2 lg:w-[55%] bg-surface geo-grid flex-col justify-between p-14 lg:p-20 relative overflow-hidden">

        {/* Ambient glow — bottom right */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-[60%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

        {/* Logo / wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 relative z-10"
        >
          <img
            src="/nclog-logo.png"
            alt="NCLOG"
            className="h-8 w-auto object-contain mix-blend-lighten"
          />
          <span className="font-headline font-bold text-sm tracking-widest text-on-surface uppercase opacity-70">
            NCLOG Táxi
          </span>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <h1 className="font-headline font-extrabold text-[2.75rem] lg:text-[3.5rem] leading-[1.08] tracking-tight text-on-surface mb-6">
            Gestão de frota<br />
            com{' '}
            <span className="text-primary">excelência<br />operacional</span>
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-sm">
            A plataforma definitiva para operadores que exigem precisão em cada quilômetro percorrido.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-end gap-12 relative z-10"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-headline font-extrabold text-2xl text-primary leading-none">{s.value}</p>
              <p className="text-[11px] font-medium tracking-widest text-muted uppercase mt-1.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── RIGHT: Cream form panel ──────────────────── */}
      <section className="w-full md:w-1/2 lg:w-[45%] bg-surface-light flex flex-col justify-center px-8 py-16 sm:px-14 lg:px-20 relative">

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-3 mb-10">
          <img src="/nclog-logo.png" alt="NCLOG" className="h-7 w-auto object-contain" />
          <span className="font-headline font-bold text-sm tracking-widest text-on-light uppercase opacity-60">
            NCLOG Táxi
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-sm w-full mx-auto"
        >
          {/* Chip */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-on-light/10 mb-8">
            <span className="text-[10px] font-bold tracking-widest text-on-light uppercase">
              Hub Administrativo
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-headline font-extrabold text-3xl text-on-light tracking-tight mb-10">
            Entrar na sua conta
          </h2>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/30 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="text-[10px] font-bold tracking-widest text-on-light-muted uppercase"
              >
                E-mail corporativo
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="nome@nclog.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full h-12 bg-transparent text-on-light text-sm placeholder:text-on-light-muted border-b border-on-light/20 focus:border-on-light outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="text-[10px] font-bold tracking-widest text-on-light-muted uppercase"
              >
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-12 bg-transparent text-on-light text-sm placeholder:text-on-light-muted border-b border-on-light/20 focus:border-on-light outline-none transition-colors pr-10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-on-light-muted hover:text-on-light transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border border-on-light/30 accent-on-light"
                />
                <span className="text-sm text-on-light-variant">Lembrar de mim</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-dim hover:text-primary font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-on-light hover:bg-on-light/85 disabled:opacity-50 disabled:pointer-events-none text-surface-light font-headline font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                'Entrando…'
              ) : (
                <>
                  Acessar Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-16 text-center text-[11px] text-on-light/25 tracking-wide select-none">
            © NCLOG Tecnologia 2026
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}
