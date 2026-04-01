import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {login as apiLogin, type LoginResult} from '@/api/auth';
import {setOnUnauthorized} from '@/api/client';
import {clearToken, getToken} from '@/lib/auth-storage';
import {decodeJwtPayload, type JwtUser} from '@/lib/jwt';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  organizationId: string | null;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildUser(token: string): AuthUser | null {
  const payload: JwtUser | null = decodeJwtPayload(token);
  if (!payload) return null;

  const email = payload.email ?? '';
  const rawName =
    payload.user_metadata?.full_name ??
    payload.user_metadata?.name ??
    email.split('@')[0] ??
    'Usuário';
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join('');

  const appRole = payload.app_metadata?.role ?? 'user';
  const organizationId = payload.app_metadata?.organization_id ?? null;

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    requester: 'Solicitante',
    driver: 'Motorista',
    client_manager: 'Gestor de Cliente',
  };

  return {
    id: payload.sub,
    email,
    name,
    initials: initials || '??',
    role: roleLabels[appRole] ?? appRole,
    organizationId,
  };
}

export function AuthProvider({children}: {children: ReactNode}) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    setOnUnauthorized(() => {
      clearToken();
      setTokenState(null);
    });
    return () => setOnUnauthorized(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (result.ok) {
      setTokenState(getToken());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const value = useMemo(
    (): AuthContextValue => ({
      isAuthenticated: Boolean(token && token.length > 0),
      user: token ? buildUser(token) : null,
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
