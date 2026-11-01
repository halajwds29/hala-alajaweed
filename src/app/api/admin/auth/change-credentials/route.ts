import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuthApi, setAdminSession } from '@/lib/auth';
import { updateAdminCredentials, getActiveAdminAccount } from '@/lib/admin-account-service';

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const account = await getActiveAdminAccount();
    return NextResponse.json({
      success: true,
      username: account.username,
    });
  } catch (err: unknown) {
    console.error('Error fetching admin info:', err);
    return NextResponse.json({ error: 'فشل جلب بيانات الحساب' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { currentPassword, newUsername, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية مطلوبة لتأكيد الأمان' },
        { status: 400 }
      );
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم مستخدم جديد أو كلمة مرور جديدة' },
        { status: 400 }
      );
    }

    const result = await updateAdminCredentials(currentPassword, newUsername, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'فشل تحديث بيانات الدخول' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الدخول بنجاح',
      username: result.username,
    });

    // Refresh admin session cookie with the updated username
    if (result.username) {
      await setAdminSession(response, result.username);
    }

    return response;
  } catch (err: unknown) {
    console.error('Change credentials error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم أثناء تحديث البيانات' }, { status: 500 });
  }
}

