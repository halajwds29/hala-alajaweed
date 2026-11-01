import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/admin-account-service';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم وكلمة المرور' },
        { status: 400 }
      );
    }

    // Verify against DB / local persistent storage / default credentials
    const result = await verifyAdminCredentials(username, password);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: { username: result.username },
    });

    await setAdminSession(response, result.username);
    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
