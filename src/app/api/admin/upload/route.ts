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
    const folder = (formData.get('folder') as string) || 'hala_alajaweed/media';

    // Support both single file ('file') and multiple files ('files' or multiple 'file' keys)
    const filesList: File[] = [];
    const filesFromMulti = formData.getAll('files') as File[];
    if (filesFromMulti.length > 0) {
      for (const f of filesFromMulti) {
        if (f && typeof f.arrayBuffer === 'function') filesList.push(f);
      }
    }

    const filesFromSingle = formData.getAll('file') as File[];
    if (filesFromSingle.length > 0) {
      for (const f of filesFromSingle) {
        if (f && typeof f.arrayBuffer === 'function' && !filesList.includes(f)) {
          filesList.push(f);
        }
      }
    }

    if (filesList.length === 0) {
      return NextResponse.json({ error: 'لم يتم اختيار أي صور للرفع' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const results: Array<{
      name: string;
      originalName: string;
      url: string;
      publicId: string;
      source: string;
      size: number;
    }> = [];
    const errors: string[] = [];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.jfif', '.heic', '.heif'];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];

      // Validate size (max 20MB per image)
      if (file.size > 20 * 1024 * 1024) {
        errors.push(`الصورة «${file.name}» تتجاوز الحد الأقصى المسموح به (20 ميجابايت)`);
        continue;
      }

      const ext = (path.extname(file.name) || '.jpg').toLowerCase();
      const isMimeOk = file.type ? file.type.startsWith('image/') : true;
      const isExtOk = allowedExtensions.includes(ext);

      if (!isMimeOk && !isExtOk) {
        errors.push(`الملف «${file.name}» ليس صورة مدعومة`);
        continue;
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize name with unique timestamp and random salt to prevent collisions
        const cleanBase = path
          .basename(file.name, ext)
          .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')
          .slice(0, 35) || 'image';
        const randomSalt = Math.random().toString(36).substring(2, 7);
        const fileName = `${Date.now()}-${randomSalt}-${cleanBase}${ext}`;
        const filePath = path.join(uploadsDir, fileName);

        // Always save to local public/uploads directory so it immediately appears in the media library
        await fs.writeFile(filePath, buffer);

        let finalUrl = `/uploads/${fileName}`;
        let publicId = `local-${fileName}`;
        let source = 'local';

        // Optional Cloudinary upload if configured and connected
        try {
          const cloudCheck = await checkCloudinaryConnection();
          if (cloudCheck.connected) {
            const uploadRes = await uploadImageBuffer(buffer, folder);
            finalUrl = uploadRes.url;
            publicId = uploadRes.publicId;
            source = 'cloudinary';
          }
        } catch (cloudErr) {
          console.warn(`Cloudinary sync skipped for ${file.name}, using local copy:`, cloudErr);
        }

        results.push({
          name: fileName,
          originalName: file.name,
          url: finalUrl,
          publicId,
          source,
          size: file.size,
        });
      } catch (fileErr) {
        console.error(`Failed to process file ${file.name}:`, fileErr);
        errors.push(`فشل حفظ الصورة «${file.name}»`);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          error: errors.length > 0 ? errors.join(' | ') : 'تعذر رفع الصور المختارة',
          errors,
        },
        { status: 400 }
      );
    }

    // Single file backward compatibility
    if (results.length === 1 && filesList.length === 1) {
      return NextResponse.json({
        success: true,
        url: results[0].url,
        publicId: results[0].publicId,
        source: results[0].source,
        name: results[0].name,
        uploaded: results,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Batch response
    return NextResponse.json({
      success: true,
      total: filesList.length,
      succeeded: results.length,
      failed: errors.length,
      uploaded: results,
      url: results[0].url,
      publicId: results[0].publicId,
      source: results[0].source,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: unknown) {
    console.error('Upload API error:', err);
    const msg = err instanceof Error ? err.message : 'فشل رفع الصور';
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
