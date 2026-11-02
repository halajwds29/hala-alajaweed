import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/admin-account-service';

// In-memory rate limiting map for admin login protection
interface LoginAttempt {
  count: number;
  lockedUntil?: number;
}
const loginAttemptsMap = new Map<string, LoginAttempt>();

// Clean up stale attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, attempt] of loginAttemptsMap.entries()) {
    if (attempt.lockedUntil && attempt.lockedUntil < now) {
      loginAttemptsMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();

    // 1. Check Rate Limiting / Lockout
    const attempt = loginAttemptsMap.get(ip) || { count: 0 };
    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      const remainingMinutes = Math.ceil((attempt.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          error: `تم قفل محاولات تسجيل الدخول مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار ${remainingMinutes} دقيقة والمحاولة مجدداً.`,
        },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم وكلمة المرور' },
        { status: 400 }
      );
    }

    // 2. Verify against DB without any backdoors
    const result = await verifyAdminCredentials(username, password);

    if (!result.valid) {
      const newCount = attempt.count + 1;
      if (newCount >= 5) {
        // Lock out for 15 minutes
        loginAttemptsMap.set(ip, {
          count: newCount,
          lockedUntil: now + 15 * 60 * 1000,
        });
        return NextResponse.json(
          {
            error: 'تم تجاوز الحد الأقصى للمحاولات (5 محاولات). تم إيقاف المحاولات لمدة 15 دقيقة لدواعي الأمان.',
          },
          { status: 429 }
        );
      } else {
        loginAttemptsMap.set(ip, { count: newCount });
      }

      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Reset failed counter on success
    loginAttemptsMap.delete(ip);

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: { username: result.username },
    });

    await setAdminSession(response, result.username, result.tokenVersion);
    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
