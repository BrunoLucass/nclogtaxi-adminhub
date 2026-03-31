import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { loginErrorToDisplay } from '@/api/auth';
import { ApiRequestError } from '@/api/client';
import { listOrganizations } from '@/api/organizations';
import { listDrivers } from '@/api/drivers';
import { listTrips } from '@/api/trips';
import { listVouchers } from '@/api/vouchers';
import { getDailyReport } from '@/api/reports';
import { formatBRLFromCents } from '@/lib/format';
import { tripStatusLabel, tripStatusTone } from '@/lib/trip-status';
import type { DailyTripReport, Driver, Organization, Trip, Voucher } from '@/types/api';
import { 
  Car, Eye, EyeOff, ArrowUpRight, Route, 
  LayoutDashboard, Users, UserPlus, Settings, 
  LogOut, Bell, Search, ChevronRight, ChevronLeft,
  TrendingUp, Clock, CheckCircle2, AlertCircle, MapPin,
  Filter, Plus, MoreVertical,
  Calendar
} from 'lucide-react';

// --- Login Component ---
const Login = () => {
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
        {/* Ícone N (arquivo costuma vir com preto RGB; alpha real = 0 no arquivo — usar lighten no fundo escuro) + texto em HTML */}
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

        {/* Login Container */}
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
                  type={showPassword ? "text" : "password"}
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
            <a className="text-muted text-[10px] font-bold hover:text-brand-gold transition-colors uppercase tracking-widest" href="#">Esqueci minha senha</a>
          </div>
        </motion.div>
      </section>

      {/* Right Section: Identity */}
      <section className="hidden md:flex w-1/2 bg-surface-dim relative overflow-hidden items-center justify-center p-24">
        {/* Central Content */}
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

        {/* Subtle Watermark */}
        <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.02]">
          <Route className="w-[600px] h-[600px] text-white" />
        </div>
      </section>

      {/* Visual Polish: Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-100 mix-blend-screen" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUiZCNWeHrecIrQSRmuF1KcEuF7iIqa-CxthWE48VuC9h-BMu7d2cV-Q6d7lqvBZJbfAeb9vnIIfZnWA3IQMZIDwiRwfqFpEGTDOT2U6UeXc2o6D-R7-X7u9gv0QvKRWVdiGf1SZcqtTHsQhgEKaz_qdRgGUajYCyWE9gn9AAyhK7ULIr7BK4hKX2JwbK3GxjtoVHTZTUf9aJ2ufotZ_9L23vqapOCxY2ygnxZ9FoB4SxABkB18f7H-fo34l5nGc8sFE8URbcOydpp')" }}
      ></div>
    </motion.div>
  );
};

// --- Dashboard Component ---
const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [report, setReport] = useState<DailyTripReport | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        if (activeTab === 'dashboard') {
          const date = new Date().toISOString().slice(0, 10);
          const [rep, tripList, driverList] = await Promise.all([
            getDailyReport(date),
            listTrips(),
            listDrivers(),
          ]);
          if (!cancelled) {
            setReport(rep);
            setTrips(tripList);
            setDrivers(driverList);
          }
        } else if (activeTab === 'clients') {
          const orgs = await listOrganizations();
          if (!cancelled) setOrganizations(orgs);
        } else if (activeTab === 'drivers') {
          const d = await listDrivers();
          if (!cancelled) setDrivers(d);
        } else if (activeTab === 'rides') {
          const t = await listTrips();
          if (!cancelled) setTrips(t);
        } else if (activeTab === 'finance') {
          const v = await listVouchers();
          if (!cancelled) setVouchers(v);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError
              ? `${e.message} (${e.status})`
              : e instanceof Error
                ? e.message
                : 'Erro ao carregar dados';
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'drivers', label: 'Motoristas', icon: UserPlus },
    { id: 'vehicles', label: 'Veículos', icon: Car },
    { id: 'rides', label: 'Corridas', icon: Route },
    { id: 'finance', label: 'Financeiro', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full bg-surface-dim overflow-hidden"
    >
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="bg-surface-container border-r border-white/5 flex flex-col justify-between pb-6 relative z-30 shadow-2xl"
      >
        <div>
          {/* Logo & Toggle */}
          <div className={`h-16 px-6 flex items-center relative ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div 
                  className="w-8 h-8 bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20" 
                  style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
                >
                  <Car className="text-white w-4 h-4" />
                </div>
                <div className="flex items-center tracking-tight leading-none">
                  <span className="text-on-surface font-headline font-bold text-lg">NCLOG</span>
                  <span className="text-brand-gold font-headline font-bold text-lg ml-1">TÁXI</span>
                </div>
              </motion.div>
            )}
            {isSidebarCollapsed && (
              <div 
                className="w-10 h-10 bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20" 
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
              >
                <Car className="text-white w-5 h-5" />
              </div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-1.5 text-muted hover:text-brand-gold transition-colors border border-white/10 rounded-lg hover:bg-white/5 ${isSidebarCollapsed ? 'absolute -right-3 top-1/2 -translate-y-1/2 bg-surface-container shadow-md' : ''}`}
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <div className="px-6">
            <div className="h-px bg-white/5 w-full" />
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1.5 mt-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  activeTab === item.id 
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-brand-gold transition-colors'} />
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] font-semibold tracking-wide uppercase"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isSidebarCollapsed && activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-brand-gold rounded-r-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User & Logout (Liquid Glass) */}
        <div className="px-3">
          <div className="h-px bg-white/5 mb-6 mx-2" />
          
          <div className={`relative overflow-hidden rounded-2xl p-3 transition-all ${isSidebarCollapsed ? 'flex flex-col items-center gap-4' : 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl'}`}>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-red to-brand-gold flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    BA
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container rounded-full shadow-sm"></div>
                </div>
                {!isSidebarCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col overflow-hidden"
                  >
                    <span className="text-on-surface text-[11px] font-semibold truncate">Bruno Almeida</span>
                    <span className="text-brand-gold/80 text-[8px] font-semibold uppercase tracking-widest truncate">Admin Master</span>
                  </motion.div>
                )}
              </div>
              
              {!isSidebarCollapsed && (
                <button 
                  onClick={logout}
                  className="p-2 text-on-surface-variant hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <button 
                onClick={logout}
                className="p-2 text-on-surface-variant hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
              >
                <LogOut size={20} />
              </button>
            )}

            {!isSidebarCollapsed && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Liquid Glass Effect */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />
        </div>

        {/* Top Bar */}
        <header className="h-16 bg-surface-container/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
              <h2 className="text-on-surface font-headline font-extrabold text-lg tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
            <div className="h-4 w-px bg-muted/30"></div>
            <span className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-60">
              {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-muted hover:text-on-surface transition-colors bg-white/5 rounded-full border border-transparent hover:border-muted/20">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border-2 border-surface-container"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-surface-dim relative">
          {/* Liquid Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-0" />

          {loadError ? (
            <div className="relative z-10 mb-4 max-w-7xl mx-auto rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {loadError}
            </div>
          ) : null}
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Stats Grid — GET /reports/daily + GET /drivers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: 'Corridas no dia',
                      value: report != null ? String(report.totalTrips) : loading ? '…' : '—',
                      trend: report ? `${report.completedTrips} concluídas` : '',
                      icon: Route,
                      color: 'text-brand-red',
                    },
                    {
                      label: 'Motoristas disponíveis',
                      value:
                        drivers.length > 0
                          ? String(drivers.filter((d) => d.isAvailable).length)
                          : loading
                            ? '…'
                            : '—',
                      trend: drivers.length ? `de ${drivers.length} cadastrados` : '',
                      icon: Users,
                      color: 'text-brand-gold',
                    },
                    {
                      label: 'Corridas canceladas',
                      value: report != null ? String(report.cancelledTrips) : loading ? '…' : '—',
                      trend: '',
                      icon: UserPlus,
                      color: 'text-green-400',
                    },
                    {
                      label: 'Faturamento (dia)',
                      value:
                        report != null
                          ? formatBRLFromCents(report.totalAmountCents)
                          : loading
                            ? '…'
                            : '—',
                      trend: '',
                      icon: TrendingUp,
                      color: 'text-yellow-400',
                    },
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-surface-container p-6 rounded-2xl border border-muted/20 hover:border-brand-gold/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-brand-gold/5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                          <stat.icon size={24} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-muted'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className="text-on-surface font-headline font-extrabold text-2xl tracking-tight">{stat.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Main Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity Table */}
                  <div className="lg:col-span-2 bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-muted/20 flex justify-between items-center bg-white/5">
                      <h3 className="text-on-surface font-headline font-extrabold text-lg tracking-tight">Últimas Corridas</h3>
                      <button className="text-brand-gold text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                        Ver Tudo <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                            <th className="px-6 py-4">Passageiro</th>
                            <th className="px-6 py-4">Origem / Destino</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/10">
                          {trips.length === 0 && !loading ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-muted text-sm">
                                Nenhuma corrida retornada pela API.
                              </td>
                            </tr>
                          ) : null}
                          {(trips.length ? trips.slice(0, 8) : []).map((row) => {
                            const name = row.passengerName ?? '—';
                            const initials = name
                              .split(/\s+/)
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase() || '?';
                            const tone = tripStatusTone(row.status);
                            const statusPt = tripStatusLabel(row.status);
                            const amount =
                              typeof row.amountCents === 'number'
                                ? formatBRLFromCents(row.amountCents)
                                : '—';
                            return (
                              <tr key={row.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px] font-bold text-brand-gold border border-brand-gold/20">
                                      {initials}
                                    </div>
                                    <span className="text-on-surface text-xs font-bold">{name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-[10px] text-muted">
                                      <MapPin size={10} className="text-brand-red" />{' '}
                                      {row.pickupAddress ?? '—'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                                      <ChevronRight size={10} className="text-brand-gold" />{' '}
                                      {row.dropoffAddress ?? '—'}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        tone === 'active'
                                          ? 'bg-blue-400 animate-pulse'
                                          : tone === 'done'
                                            ? 'bg-green-400'
                                            : tone === 'pending'
                                              ? 'bg-brand-gold'
                                              : 'bg-brand-red'
                                      }`}
                                    />
                                    <span
                                      className={`text-[10px] font-bold uppercase ${
                                        tone === 'active'
                                          ? 'text-blue-400'
                                          : tone === 'done'
                                            ? 'text-green-400'
                                            : tone === 'pending'
                                              ? 'text-brand-gold'
                                              : 'text-brand-red'
                                      }`}
                                    >
                                      {statusPt}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-on-surface text-xs font-mono font-bold">{amount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Actions / Fleet Status */}
                  <div className="bg-surface-container rounded-2xl border border-muted/20 p-6 shadow-sm">
                    <h3 className="text-on-surface font-headline font-extrabold text-lg tracking-tight mb-6">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-muted/10 hover:border-brand-gold/50 transition-all group">
                        <UserPlus className="text-brand-gold mb-2 group-hover:scale-110 transition-transform" size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Novo Cliente</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-muted/10 hover:border-brand-red/50 transition-all group">
                        <Car className="text-brand-red mb-2 group-hover:scale-110 transition-transform" size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Novo Veículo</span>
                      </button>
                    </div>

                    <h3 className="text-on-surface font-headline font-extrabold text-sm tracking-tight mb-4">Status da Central</h3>
                    <div className="space-y-6">
                      {(() => {
                        const total = Math.max(drivers.length, 1);
                        const free = drivers.filter((d) => d.isAvailable).length;
                        const inTrip = trips.filter(
                          (t) => (t.status ?? '').toLowerCase() === 'in_progress',
                        ).length;
                        const off = drivers.filter((d) => d.isAvailable === false).length;
                        return [
                          { label: 'Motoristas disponíveis', count: free, color: 'bg-green-400', total },
                          { label: 'Corridas em curso', count: inTrip, color: 'bg-brand-gold', total },
                          { label: 'Motoristas indisponíveis', count: off, color: 'bg-brand-red', total },
                        ];
                      })().map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-muted text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                            <span className="text-on-surface text-xs font-bold">{item.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / item.total) * 100}%` }}
                              className={`h-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-4 bg-brand-red/5 rounded-xl border border-brand-red/10 relative overflow-hidden group">
                      <div className="flex items-center gap-3 mb-2 relative z-10">
                        <AlertCircle className="text-brand-red" size={18} />
                        <span className="text-on-surface text-xs font-bold">Solicitações Pendentes</span>
                      </div>
                      <p className="text-on-surface-variant text-[10px] leading-relaxed relative z-10">
                        {(() => {
                          const n = trips.filter((t) =>
                            ['pending', 'dispatching'].includes(
                              (t.status ?? '').toLowerCase(),
                            ),
                          ).length;
                          return n === 0
                            ? 'Nenhuma corrida pendente ou em despacho no momento.'
                            : `Existem ${n} corrida(s) pendente(s) ou em despacho aguardando motorista.`;
                        })()}
                      </p>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-red/5 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-brand-red/10 transition-colors"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div 
                key="clients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Organizações (clientes)</h1>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Dados de <code className="text-brand-gold/90">GET /organizations</code> — empresas contratantes.
                    </p>
                  </div>
                  <button className="bg-brand-red hover:bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20 active:scale-95">
                    <Plus size={18} /> Novo Cliente
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-surface-container p-4 rounded-2xl border border-muted/20 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nome, e-mail ou documento..." 
                      className="w-full bg-white/5 border border-muted/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface focus:border-brand-gold/50 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-muted/10 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:border-muted/30 transition-all">
                      <Filter size={16} /> Filtros
                    </button>
                    <select className="flex-1 md:flex-none bg-white/5 border border-muted/10 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant outline-none cursor-pointer hover:border-muted/30 transition-all">
                      <option>Todos os Status</option>
                      <option>Ativos</option>
                      <option>Inativos</option>
                      <option>Bloqueados</option>
                    </select>
                  </div>
                </div>

                {/* Clients Table */}
                <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                          <th className="px-6 py-5">Organização</th>
                          <th className="px-6 py-5">Mensalidade</th>
                          <th className="px-6 py-5">Taxa / corrida</th>
                          <th className="px-6 py-5">ID</th>
                          <th className="px-6 py-5">Cadastro</th>
                          <th className="px-6 py-5 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10">
                        {organizations.length === 0 && !loading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-muted text-sm">
                              Nenhuma organização retornada (verifique permissão admin).
                            </td>
                          </tr>
                        ) : null}
                        {organizations.map((org) => (
                          <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-xs border border-brand-red/20 group-hover:scale-105 transition-transform">
                                  {org.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-on-surface text-sm font-bold">{org.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-on-surface text-sm font-mono">
                              {formatBRLFromCents(org.monthlyFeeCents)}
                            </td>
                            <td className="px-6 py-5 text-on-surface text-sm font-mono">
                              {formatBRLFromCents(org.perTripFeeCents)}
                            </td>
                            <td className="px-6 py-5 text-[10px] text-muted font-mono truncate max-w-[120px]" title={org.id}>
                              {org.id}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                <Calendar size={12} className="text-muted" />{' '}
                                {org.createdAt
                                  ? new Date(org.createdAt).toLocaleDateString('pt-BR')
                                  : '—'}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button className="p-2 text-muted hover:text-brand-gold transition-colors hover:bg-white/5 rounded-lg">
                                <MoreVertical size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 bg-white/5 border-t border-muted/20 flex justify-between items-center">
                    <span className="text-muted text-xs font-medium">
                      {organizations.length} organização(ões)
                    </span>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white/5 border border-muted/10 rounded-lg text-xs font-bold text-muted hover:text-on-surface transition-all">Anterior</button>
                      <button className="px-4 py-2 bg-brand-red text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-red/20 active:scale-95 transition-all">Próximo</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'drivers' && (
              <motion.div
                key="drivers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-6"
              >
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
                                  d.isAvailable
                                    ? 'bg-green-400/15 text-green-400'
                                    : 'bg-muted/15 text-muted'
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
              </motion.div>
            )}

            {activeTab === 'rides' && (
              <motion.div
                key="rides"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div>
                  <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Corridas</h1>
                  <p className="text-on-surface-variant text-sm mt-1">
                    <code className="text-brand-gold/90">GET /trips</code> — lista conforme sua role no JWT.
                  </p>
                </div>
                <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                          <th className="px-6 py-4">Passageiro</th>
                          <th className="px-6 py-4">Origem / Destino</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10">
                        {trips.length === 0 && !loading ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-muted text-sm">
                              Nenhuma corrida retornada.
                            </td>
                          </tr>
                        ) : null}
                        {trips.map((row) => (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="px-6 py-4 text-on-surface text-sm font-bold">{row.passengerName ?? '—'}</td>
                            <td className="px-6 py-4 text-[10px] text-muted">
                              <div>{row.pickupAddress ?? '—'}</div>
                              <div className="text-on-surface-variant text-[10px] mt-1">{row.dropoffAddress ?? '—'}</div>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-bold uppercase text-brand-gold">
                              {tripStatusLabel(row.status)}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono">
                              {typeof row.amountCents === 'number'
                                ? formatBRLFromCents(row.amountCents)
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div
                key="finance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div>
                  <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Financeiro</h1>
                  <p className="text-on-surface-variant text-sm mt-1">
                    <code className="text-brand-gold/90">GET /vouchers</code> — vales da organização (admin / client_manager).
                  </p>
                </div>
                <div className="bg-surface-container rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 text-muted text-[10px] font-bold uppercase tracking-widest">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Corrida</th>
                          <th className="px-6 py-4">Valor</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Criado em</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10">
                        {vouchers.length === 0 && !loading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-muted text-sm">
                              Nenhum voucher retornado.
                            </td>
                          </tr>
                        ) : null}
                        {vouchers.map((v) => (
                          <tr key={v.id} className="hover:bg-white/5">
                            <td className="px-6 py-4 text-[10px] font-mono text-muted truncate max-w-[100px]">{v.id}</td>
                            <td className="px-6 py-4 text-[10px] font-mono text-muted">{v.tripId ?? '—'}</td>
                            <td className="px-6 py-4">
                              {formatBRLFromCents(v.amountCents)}
                            </td>
                            <td className="px-6 py-4 text-[10px] font-bold uppercase">{v.status ?? '—'}</td>
                            <td className="px-6 py-4 text-[11px] text-muted">
                              {v.createdAt
                                ? new Date(v.createdAt).toLocaleString('pt-BR')
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div
                key="vehicles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto"
              >
                <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Veículos</h1>
                <p className="text-on-surface-variant text-sm mt-2 max-w-xl">
                  A API do middleware ainda não expõe endpoint de veículos. Esta seção será conectada quando o backend estiver disponível.
                </p>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto"
              >
                <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Configurações</h1>
                <p className="text-on-surface-variant text-sm mt-2 max-w-xl">
                  Preferências de conta e integrações serão adicionadas aqui. Roles e{' '}
                  <code className="text-brand-gold/90">organization_id</code> continuam no Supabase (app_metadata).
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Visual Polish: Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-100 mix-blend-screen z-50" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUiZCNWeHrecIrQSRmuF1KcEuF7iIqa-CxthWE48VuC9h-BMu7d2cV-Q6d7lqvBZJbfAeb9vnIIfZnWA3IQMZIDwiRwfqFpEGTDOT2U6UeXc2o6D-R7-X7u9gv0QvKRWVdiGf1SZcqtTHsQhgEKaz_qdRgGUajYCyWE9gn9AAyhK7ULIr7BK4hKX2JwbK3GxjtoVHTZTUf9aJ2ufotZ_9L23vqapOCxY2ygnxZ9FoB4SxABkB18f7H-fo34l5nGc8sFE8URbcOydpp')" }}
      ></div>
    </motion.div>
  );
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div key="dashboard" className="w-full h-full">
          <Dashboard />
        </motion.div>
      ) : (
        <motion.div key="login" className="w-full h-full">
          <Login />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
