import { LayoutDashboard, Route, TrendingUp, Users } from 'lucide-react';
import { AppShell, type ShellItem } from './AppShell';

const CLIENT_MENU: ShellItem[] = [
  { path: '/client',          label: 'Painel',       description: 'Resumo da sua operação',              icon: LayoutDashboard, exact: true },
  { path: '/client/rides',    label: 'Corridas',     description: 'Solicite e acompanhe viagens',        icon: Route },
  { path: '/client/passengers', label: 'Passageiros', description: 'Cadastro de colaboradores',          icon: Users },
  { path: '/client/finance',  label: 'Financeiro',   description: 'Vouchers e histórico de cobranças',   icon: TrendingUp },
];

export function ClientLayout() {
  return <AppShell menu={CLIENT_MENU} basePath="Cliente" />;
}
