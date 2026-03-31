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

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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
