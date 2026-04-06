import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { RedirectByRole } from './RedirectByRole';

import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ClientLayout } from '@/layouts/ClientLayout';

// Admin pages
import { AdminDashboardPage } from '@/pages/admin/DashboardPage';
import { ClientsPage } from '@/pages/admin/ClientsPage';
import { DriversPage } from '@/pages/admin/DriversPage';
import { VehiclesPage } from '@/pages/admin/VehiclesPage';
import { RidesPage } from '@/pages/admin/RidesPage';
import { FinancePage } from '@/pages/admin/FinancePage';
import { PricingPage } from '@/pages/admin/PricingPage';
import { SubscriptionsPage } from '@/pages/admin/SubscriptionsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// Client pages
import { ClientDashboardPage } from '@/pages/client/DashboardPage';
import { ClientRidesPage } from '@/pages/client/RidesPage';
import { PassengersPage } from '@/pages/client/PassengersPage';
import { ClientFinancePage } from '@/pages/client/FinancePage';

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <RedirectByRole />;
  return <LoginPage />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginGuard />} />

      <Route element={<ProtectedRoute />}>
        {/* Redirect root to role-based dashboard */}
        <Route index element={<RedirectByRole />} />

        {/* Admin routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/clients" element={<ClientsPage />} />
            <Route path="admin/drivers" element={<DriversPage />} />
            <Route path="admin/vehicles" element={<VehiclesPage />} />
            <Route path="admin/rides" element={<RidesPage />} />
            <Route path="admin/finance" element={<FinancePage />} />
            <Route path="admin/pricing" element={<PricingPage />} />
            <Route path="admin/subscriptions" element={<SubscriptionsPage />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Client routes */}
        <Route element={<RoleRoute allowedRoles={['client_manager', 'requester']} />}>
          <Route element={<ClientLayout />}>
            <Route path="client" element={<ClientDashboardPage />} />
            <Route path="client/rides" element={<ClientRidesPage />} />
            <Route path="client/passengers" element={<PassengersPage />} />
            <Route path="client/finance" element={<ClientFinancePage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
