import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Eye, EyeOff, ArrowUpRight, Route, 
  LayoutDashboard, Users, UserPlus, FileText, Settings, 
  LogOut, Bell, Search, ChevronRight, ChevronLeft,
  TrendingUp, Clock, CheckCircle2, AlertCircle, MapPin,
  Filter, Plus, MoreVertical,
  Phone, Mail, Calendar
} from 'lucide-react';

// --- Login Component ---
const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-full overflow-hidden"
    >
      {/* Left Section: Form */}
      <section className="w-full md:w-1/2 bg-surface-elevated p-8 md:p-24 flex flex-col justify-center relative">
        {/* Header Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-12 md:left-24 flex items-center gap-4"
        >
          <div 
            className="w-10 h-10 bg-brand-red flex items-center justify-center" 
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
          >
            <Car className="text-white w-5 h-5" />
          </div>
          <div className="flex items-center tracking-tighter leading-none">
            <span className="text-on-surface font-headline font-extrabold text-xl">NCLOG</span>
            <span className="text-brand-gold font-headline font-extrabold text-xl ml-1">TÁXI</span>
          </div>
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
            <p className="text-on-surface-variant text-sm mt-2">Gerencie sua central de transporte e mobilidade.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-muted uppercase ml-1">E-mail Corporativo</label>
              <input 
                className="w-full h-12 bg-surface-dim text-on-surface px-4 border-b border-transparent focus:border-brand-gold transition-all outline-none rounded-md" 
                placeholder="admin@nclog.com.br" 
                type="email"
                required
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
                  required
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

            <button type="submit" className="w-full h-12 bg-brand-red hover:bg-brand-maroon text-white font-headline font-extrabold tracking-widest text-xs rounded-md transition-all active:scale-[0.98] uppercase">
              ENTRAR NO SISTEMA
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-6">
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
            Central de <span className="text-brand-gold">Mobilidade</span> Urbana
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant font-medium text-base leading-relaxed"
          >
            A solução definitiva para gerenciar motoristas, passageiros e corridas em tempo real.
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
const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
                  onClick={onLogout}
                  className="p-2 text-on-surface-variant hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <button 
                onClick={onLogout}
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
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Corridas Hoje', value: '142', trend: '+12%', icon: Route, color: 'text-brand-red' },
                    { label: 'Motoristas Online', value: '28', trend: 'Estável', icon: Users, color: 'text-brand-gold' },
                    { label: 'Novos Passageiros', value: '14', trend: '+5', icon: UserPlus, color: 'text-green-400' },
                    { label: 'Faturamento Total', value: 'R$ 12.4k', trend: '+8.4%', icon: TrendingUp, color: 'text-yellow-400' },
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
                          {[
                            { name: 'Ana Silva', origin: 'Av. Paulista', dest: 'Aeroporto Congonhas', status: 'Em Curso', value: 'R$ 42,50', type: 'active' },
                            { name: 'Carlos M.', origin: 'Rua Augusta', dest: 'Shopping Ibirapuera', status: 'Finalizado', value: 'R$ 29,00', type: 'done' },
                            { name: 'Mariana L.', origin: 'Vila Madalena', dest: 'Pinheiros', status: 'Aguardando', value: 'R$ 15,20', type: 'pending' },
                            { name: 'João Pedro', origin: 'Itaim Bibi', dest: 'Berrini', status: 'Cancelado', value: 'R$ 0,00', type: 'error' },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px] font-bold text-brand-gold border border-brand-gold/20">
                                    {row.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-on-surface text-xs font-bold">{row.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-[10px] text-muted">
                                    <MapPin size={10} className="text-brand-red" /> {row.origin}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                                    <ChevronRight size={10} className="text-brand-gold" /> {row.dest}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    row.type === 'active' ? 'bg-blue-400 animate-pulse' : 
                                    row.type === 'done' ? 'bg-green-400' : 
                                    row.type === 'pending' ? 'bg-brand-gold' : 'bg-brand-red'
                                  }`}></div>
                                  <span className={`text-[10px] font-bold uppercase ${
                                    row.type === 'active' ? 'text-blue-400' : 
                                    row.type === 'done' ? 'text-green-400' : 
                                    row.type === 'pending' ? 'text-brand-gold' : 'text-brand-red'
                                  }`}>
                                    {row.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-on-surface text-xs font-mono font-bold">{row.value}</td>
                            </tr>
                          ))}
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
                      {[
                        { label: 'Motoristas Livres', count: 18, color: 'bg-green-400', total: 28 },
                        { label: 'Em Viagem', count: 10, color: 'bg-brand-gold', total: 28 },
                        { label: 'Indisponíveis', count: 2, color: 'bg-brand-red', total: 28 },
                      ].map((item) => (
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
                        Existem 4 solicitações de viagem aguardando atribuição de motorista.
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
                    <h1 className="text-on-surface font-headline text-3xl font-extrabold tracking-tight">Gestão de Clientes</h1>
                    <p className="text-on-surface-variant text-sm mt-1">Visualize e gerencie todos os clientes cadastrados na plataforma.</p>
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
                          <th className="px-6 py-5">Cliente</th>
                          <th className="px-6 py-5">Contato</th>
                          <th className="px-6 py-5">Total Corridas</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5">Última Viagem</th>
                          <th className="px-6 py-5 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10">
                        {[
                          { name: 'Empresa Alpha Log', type: 'Corporativo', email: 'contato@alphalog.com', phone: '(11) 98888-7777', rides: 156, status: 'Ativo', last: 'Hoje, 14:20' },
                          { name: 'Juliana Ferreira', type: 'Individual', email: 'ju.ferreira@gmail.com', phone: '(11) 97777-6666', rides: 42, status: 'Ativo', last: 'Ontem, 18:45' },
                          { name: 'Restaurante Sabor', type: 'Corporativo', email: 'financeiro@sabor.com.br', phone: '(11) 3333-4444', rides: 89, status: 'Pendente', last: '2 dias atrás' },
                          { name: 'Marcos Oliveira', type: 'Individual', email: 'marcos.oli@uol.com.br', phone: '(11) 96666-5555', rides: 12, status: 'Inativo', last: '15 Jan 2026' },
                          { name: 'Tech Solutions SA', type: 'Corporativo', email: 'rh@techsolutions.com', phone: '(11) 5555-4444', rides: 312, status: 'Ativo', last: 'Hoje, 09:15' },
                        ].map((client, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-xs border border-brand-red/20 group-hover:scale-105 transition-transform">
                                  {client.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-on-surface text-sm font-bold">{client.name}</span>
                                  <span className="text-brand-gold text-[10px] font-bold uppercase tracking-wider">{client.type}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                  <Mail size={12} className="text-muted" /> {client.email}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                  <Phone size={12} className="text-muted" /> {client.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="text-on-surface text-sm font-bold">{client.rides}</span>
                                <TrendingUp size={14} className="text-green-400" />
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                client.status === 'Ativo' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                                client.status === 'Pendente' ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' :
                                'bg-muted/10 text-muted border border-muted/20'
                              }`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                <Calendar size={12} className="text-muted" /> {client.last}
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
                    <span className="text-muted text-xs font-medium">Mostrando 5 de 124 clientes</span>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white/5 border border-muted/10 rounded-lg text-xs font-bold text-muted hover:text-on-surface transition-all">Anterior</button>
                      <button className="px-4 py-2 bg-brand-red text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-red/20 active:scale-95 transition-all">Próximo</button>
                    </div>
                  </div>
                </div>
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div key="dashboard" className="w-full h-full">
          <Dashboard onLogout={() => setIsLoggedIn(false)} />
        </motion.div>
      ) : (
        <motion.div key="login" className="w-full h-full">
          <Login onLogin={() => setIsLoggedIn(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
