import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'hala_admin_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hala-alajaweed-super-secure-jwt-secret-key-32chars-min'
);

async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin' && typeof payload.username === 'string';
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin UI Routes (/admin) — allow /admin/login freely
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token || !(await isValidAdminToken(token))) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin API Routes (/api/admin) — allow login freely
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const valid =
      (token && (await isValidAdminToken(token))) ||
      (bearerToken && (await isValidAdminToken(bearerToken)));

    if (!valid) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول (جلسة غير صالحة أو منتهية)' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
