import {
  Car,
  DollarSign,
  LayoutDashboard,
  Receipt,
  Route,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { AppShell, type ShellItem } from './AppShell';

const ADMIN_MENU: ShellItem[] = [
  { path: '/admin',               label: 'Painel Geral',   description: 'Visão geral da operação',            icon: LayoutDashboard, exact: true },
  { path: '/admin/clients',       label: 'Clientes',       description: 'Organizações contratantes',          icon: Users },
  { path: '/admin/drivers',       label: 'Motoristas',     description: 'Cadastro e status da frota',         icon: UserPlus },
  { path: '/admin/vehicles',      label: 'Veículos',       description: 'Frota cadastrada',                   icon: Car },
  { path: '/admin/rides',         label: 'Corridas',       description: 'Histórico e gestão de viagens',      icon: Route },
  { path: '/admin/finance',       label: 'Financeiro',     description: 'Vouchers e faturamento',             icon: TrendingUp },
  { path: '/admin/pricing',       label: 'Precificação',   description: 'Regras de tarifação',                icon: DollarSign },
  { path: '/admin/subscriptions', label: 'Mensalidades',   description: 'Controle de assinaturas',            icon: Receipt },
  { path: '/admin/users',         label: 'Usuários',       description: 'Controle de acesso e permissões',    icon: ShieldCheck },
  { path: '/admin/settings',      label: 'Configurações',  description: 'Parâmetros do sistema',              icon: Settings },
];

export function AdminLayout() {
  return <AppShell menu={ADMIN_MENU} basePath="Admin" />;
}
