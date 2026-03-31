import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div key="dashboard" className="w-full h-full">
          <DashboardPage />
        </motion.div>
      ) : (
        <motion.div key="login" className="w-full h-full">
          <LoginPage />
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
