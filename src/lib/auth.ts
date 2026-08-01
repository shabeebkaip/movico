import 'server-only';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || process.env.CMS_SECRET || 'movico-jwt-dev-secret';
const COOKIE_NAME = 'admin-token';

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email, role: 'admin' } satisfies Omit<AdminTokenPayload, 'iat' | 'exp'>, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return payload.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

export function isAuthorised(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token) !== null;
}

/**
 * Server Component-safe check (uses next/headers cookies() instead of a
 * NextRequest). Used to decide whether to even render/ship the admin-only
 * editing UI, so anonymous visitors never load that JS chunk at all.
 */
export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token) !== null;
}

export { COOKIE_NAME };
