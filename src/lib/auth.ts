import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hala-alajaweed-super-secure-jwt-secret-key-32chars-min'
);

const COOKIE_NAME = 'hala_admin_session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminToken(username: string): Promise<string> {
  return new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role === 'admin' && typeof payload.username === 'string') {
      return { username: payload.username };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function setAdminSession(response: NextResponse, username: string): Promise<void> {
  const token = await createAdminToken(username);
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    // Avoid secure=true on plain HTTP localhost / LAN so session cookie is always stored and transmitted
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function checkAdminAuthApi(req: NextRequest): Promise<boolean> {
  // 1. Verify session cookie if present
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    const session = await verifyAdminToken(token);
    if (session !== null) return true;
  }

  // 2. Check Authorization Header (Bearer token)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const session = await verifyAdminToken(authHeader.slice(7).trim());
    if (session !== null) return true;
  }

  // 3. Fallback for Local / Admin Dashboard Same-Origin Requests:
  // If the request originates from localhost or local IP within the admin console
  const host = req.headers.get('host') || '';
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';

  const isLocalHost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('192.168.') ||
    host.includes('10.');

  const isSameOrigin =
    (origin && origin.includes(host)) || (referer && referer.includes(host));

  if (isLocalHost && isSameOrigin) {
    return true;
  }

  return false;
}
