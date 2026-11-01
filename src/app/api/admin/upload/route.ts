import { NextRequest, NextResponse } from 'next/server';
import { uploadImageBuffer, deleteImage, checkCloudinaryConnection } from '@/lib/cloudinary';
import { checkAdminAuthApi } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'hala_alajaweed/products';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم الصورة يتجاوز الحد المسموح (5 ميجابايت)' },
        { status: 400 }
      );
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة (JPG, PNG, WebP, AVIF)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check Cloudinary connection
    const cloudCheck = await checkCloudinaryConnection();
    if (cloudCheck.connected) {
      const uploadRes = await uploadImageBuffer(buffer, folder);
      return NextResponse.json({
        success: true,
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        source: 'cloudinary',
      });
    }

    // Local Storage: Save directly to public/uploads/ so files uploaded from device are immediately usable
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean extension and sanitize name
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${Date.now()}-${cleanBase}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      publicId: `local-${fileName}`,
      source: 'local',
      message: 'تم حفظ الصورة من جهازك بنجاح في مجلد uploads المحلي.',
    });
  } catch (err: unknown) {
    console.error('Upload API error:', err);
    const msg = err instanceof Error ? err.message : 'فشل رفع الصورة';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'معرف الصورة مطلوب' }, { status: 400 });
    }

    // If local file
    if (publicId.startsWith('local-')) {
      const fileName = publicId.replace('local-', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      try {
        await fs.unlink(filePath);
      } catch {
        // file may already not exist
      }
      return NextResponse.json({ success: true });
    }

    const deleted = await deleteImage(publicId);
    return NextResponse.json({ success: deleted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل حذف الصورة';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
