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

    // Attempt to prepare uploads directory (safely ignored if filesystem is read-only on serverless)
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {
      // Ignore read-only filesystem on Vercel/Serverless
    }

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

        let finalUrl = '';
        let publicId = '';
        let source = '';

        // 1. PRIMARY: Upload directly to Cloudinary (Production CDN / Vercel compatible)
        try {
          const uploadRes = await uploadImageBuffer(buffer, folder);
          finalUrl = uploadRes.url;
          publicId = uploadRes.publicId;
          source = 'cloudinary';
        } catch (cloudErr) {
          console.warn(`Cloudinary upload failed for ${file.name}, trying local:`, cloudErr);
        }

        // 2. SECONDARY / CACHE: Attempt to write to local public/uploads (if filesystem is writable)
        try {
          await fs.writeFile(filePath, buffer);
          if (!finalUrl) {
            finalUrl = `/uploads/${fileName}`;
            publicId = `local-${fileName}`;
            source = 'local';
          }
        } catch (fsErr) {
          // On Vercel / Serverless, filesystem is read-only. This is completely expected.
          console.info(`Local file write skipped on serverless for ${file.name}`);
        }

        // 3. FALLBACK: If Cloudinary and local filesystem both failed (e.g. offline and read-only)
        if (!finalUrl) {
          // As emergency fallback, generate data URI so the user never loses their uploaded product photo
          const mimeType = file.type || 'image/jpeg';
          finalUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
          publicId = `data-uri-${Date.now()}-${randomSalt}`;
          source = 'inline';
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
    const msg = err instanceof Error ? err.message : 'حدث خطأ في الخادم أثناء رفع الملف';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'المعرف المطلوب حذفه غير محدد' }, { status: 400 });
    }

    // If local file, attempt to remove from public/uploads
    if (publicId.startsWith('local-')) {
      const fileName = publicId.replace('local-', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', path.basename(fileName));
      try {
        await fs.unlink(filePath);
      } catch {
        // file might not exist or read-only
      }
      return NextResponse.json({ success: true, message: 'تم حذف الصورة المحلية' });
    }

    // If data URI, nothing to delete on server
    if (publicId.startsWith('data-uri-')) {
      return NextResponse.json({ success: true, message: 'تم إزالة الصورة' });
    }

    // Cloudinary delete
    const deleted = await deleteImage(publicId);
    if (!deleted) {
      return NextResponse.json({ error: 'فشل حذف الصورة من السحابة' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف الصورة بنجاح من السحابة' });
  } catch (err: unknown) {
    console.error('Delete API error:', err);
    return NextResponse.json({ error: 'حدث خطأ أثناء محاولة الحذف' }, { status: 500 });
  }
}
