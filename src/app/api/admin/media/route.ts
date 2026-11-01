import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuthApi } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileNames = await fs.readdir(uploadsDir);
    const mediaFiles = [];

    for (const name of fileNames) {
      // Ignore hidden or non-image files
      if (name.startsWith('.')) continue;
      const filePath = path.join(uploadsDir, name);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          const ext = path.extname(name).toLowerCase();
          const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'].includes(ext);
          if (isImage) {
            mediaFiles.push({
              name,
              url: `/uploads/${name}`,
              size: stats.size,
              createdAt: stats.birthtime.toISOString(),
              modifiedAt: stats.mtime.toISOString(),
            });
          }
        }
      } catch (err) {
        console.error('Error reading file stat:', err);
      }
    }

    // Sort newest first
    mediaFiles.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ success: true, files: mediaFiles });
  } catch (err: unknown) {
    console.error('Media API error:', err);
    return NextResponse.json({ error: 'فشل قراءة مكتبة الوسائط' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: 'اسم الملف مطلوب' }, { status: 400 });
    }

    // Sanitize to prevent path traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeName);

    try {
      await fs.unlink(filePath);
      return NextResponse.json({ success: true, message: 'تم حذف الملف بنجاح' });
    } catch {
      return NextResponse.json({ error: 'الملف غير موجود أو تعذر حذفه' }, { status: 404 });
    }
  } catch (err: unknown) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'فشل حذف الملف' }, { status: 500 });
  }
}

