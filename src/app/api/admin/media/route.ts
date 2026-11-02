import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuthApi } from '@/lib/auth';
import { listCloudinaryImages, deleteImage } from '@/lib/cloudinary';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const mediaFiles: Array<{
      name: string;
      url: string;
      publicId?: string;
      size: number;
      createdAt: string;
      modifiedAt: string;
      source: string;
    }> = [];

    // 1. Fetch images from Cloudinary (cloud storage for production and Vercel)
    try {
      const cloudImages = await listCloudinaryImages('hala_alajaweed');
      for (const item of cloudImages) {
        mediaFiles.push({
          name: item.name,
          url: item.url,
          publicId: item.publicId,
          size: item.size,
          createdAt: item.createdAt,
          modifiedAt: item.modifiedAt,
          source: 'cloudinary',
        });
      }
    } catch (cloudErr) {
      console.warn('Could not load Cloudinary media list:', cloudErr);
    }

    // 2. Fetch local uploads (if directory exists and is accessible)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const fileNames = await fs.readdir(uploadsDir);

      for (const name of fileNames) {
        if (name.startsWith('.')) continue;
        const filePath = path.join(uploadsDir, name);
        try {
          const stats = await fs.stat(filePath);
          if (stats.isFile()) {
            const ext = path.extname(name).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'].includes(ext);
            if (isImage) {
              const url = `/uploads/${name}`;
              // Avoid duplicate if already present from Cloudinary
              if (!mediaFiles.some((m) => m.url === url || m.name === name)) {
                mediaFiles.push({
                  name,
                  url,
                  publicId: `local-${name}`,
                  size: stats.size,
                  createdAt: stats.birthtime.toISOString(),
                  modifiedAt: stats.mtime.toISOString(),
                  source: 'local',
                });
              }
            }
          }
        } catch {
          // ignore individual stat error
        }
      }
    } catch {
      // Ignored if public/uploads directory does not exist or read-only on Vercel
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
    const publicId = searchParams.get('publicId');

    if (!fileName && !publicId) {
      return NextResponse.json({ error: 'اسم الملف أو المعرف مطلوب' }, { status: 400 });
    }

    // 1. If publicId provided or inferable, try deleting from Cloudinary
    if (publicId && !publicId.startsWith('local-')) {
      await deleteImage(publicId);
    }

    // 2. Try deleting from local storage if local file
    if (fileName) {
      try {
        const safeName = path.basename(fileName);
        const filePath = path.join(process.cwd(), 'public', 'uploads', safeName);
        await fs.unlink(filePath);
      } catch {
        // file may not exist locally if stored on Cloudinary
      }
    }

    return NextResponse.json({ success: true, message: 'تم حذف الملف بنجاح' });
  } catch (err: unknown) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'فشل حذف الملف' }, { status: 500 });
  }
}
