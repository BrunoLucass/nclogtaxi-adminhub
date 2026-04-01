export type JwtUser = {
  sub: string;
  email?: string;
  role?: string; // Supabase role field (authenticated)
  app_metadata?: {
    role?: string;
    organization_id?: string;
  };
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
};

export function decodeJwtPayload(token: string): JwtUser | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtUser;
  } catch {
    return null;
  }
}
