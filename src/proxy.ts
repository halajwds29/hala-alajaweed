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

  // Only protect /admin routes — but allow /admin/login freely
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token || !(await isValidAdminToken(token))) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match /admin and all sub-paths, but skip static assets
    '/admin/:path*',
  ],
};
