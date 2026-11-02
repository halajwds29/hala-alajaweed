'use client';

export interface UploadProgressInfo {
  current: number;
  total: number;
  percentage: number;
  fileName: string;
}

export interface UploadedItem {
  url: string;
  publicId: string;
  name?: string;
  source?: string;
}

export interface BatchUploadResult {
  succeeded: UploadedItem[];
  failed: Array<{ fileName: string; reason: string }>;
}

/**
 * Compresses an image file on the client before upload using HTML5 Canvas.
 * - Scales down images if dimensions exceed maxDimension (default 2048px).
 * - Converts high-res uncompressed photos (e.g. 10MB phone camera shots) to lightweight ~300KB JPEG/WebP.
 * - Leaves SVGs, GIFs, and already-small files (< 600KB) intact.
 */
export async function compressImageClient(
  file: File,
  maxDimension = 2048,
  quality = 0.85
): Promise<File> {
  // Never touch non-browser environments or unsupported file types
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  const mime = file.type.toLowerCase();

  // Skip SVGs and animated GIFs
  if (mime === 'image/svg+xml' || mime === 'image/gif') {
    return file;
  }

  // If already under 700KB, no compression needed
  if (file.size <= 700 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new (window.Image || Image)();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(file);
          return;
        }

        // Calculate scaling ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { alpha: mime === 'image/png' });
        if (!ctx) {
          resolve(file);
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // White background for transparent formats if saving as JPEG
        const outputMime = mime === 'image/png' ? 'image/png' : 'image/jpeg';
        if (outputMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob isn't actually smaller, keep original
              resolve(file);
              return;
            }

            const cleanExt = outputMime === 'image/png' ? '.png' : '.jpg';
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const compressedFile = new File([blob], `${baseName}${cleanExt}`, {
              type: outputMime,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputMime,
          quality
        );
      } catch {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Safely parses server response, guarding against raw text/HTML errors (e.g. Vercel HTTP 413 Request Entity Too Large)
 */
async function safeParseResponse(res: Response): Promise<{ success: boolean; data?: any; error?: string }> {
  const text = await res.text();

  if (res.status === 413) {
    return {
      success: false,
      error: 'حجم ملف الصورة كبير جداً وتجاوز حد الخادم المسموح به (4.5 ميجابايت). تم ضغط الصورة تلقائياً، يرجى المحاولة مرة أخرى.',
    };
  }

  if (!text || text.trim() === '') {
    return {
      success: false,
      error: `استجابة فارغة من الخادم (رمز الحالة: ${res.status})`,
    };
  }

  try {
    const data = JSON.parse(text);
    return { success: res.ok && data.success !== false, data, error: data.error };
  } catch {
    return {
      success: false,
      error: res.ok
        ? 'استجابة غير متوقعة من الخادم'
        : `خطأ من الخادم (${res.status}): ${text.slice(0, 120)}`,
    };
  }
}

/**
 * Uploads an individual file with client-side compression and safe error handling.
 */
export async function uploadSingleFileSafe(
  file: File,
  folder = 'hala_alajaweed/media'
): Promise<{ success: boolean; item?: UploadedItem; error?: string }> {
  try {
    // 1. Client-side compression if needed
    const optimized = await compressImageClient(file);

    // 2. Prepare FormData with a single file (ensures payload is well under Vercel's 4.5MB limit)
    const formData = new FormData();
    formData.append('file', optimized);
    formData.append('folder', folder);

    // 3. Send upload request
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    // 4. Safe parse
    const parsed = await safeParseResponse(res);
    if (!parsed.success || !parsed.data) {
      return { success: false, error: parsed.error || `تعذر رفع الصورة «${file.name}»` };
    }

    const data = parsed.data;
    const url = data.url || (data.uploaded && data.uploaded[0]?.url);
    const publicId = data.publicId || (data.uploaded && data.uploaded[0]?.publicId) || `img-${Date.now()}`;
    const name = data.name || (data.uploaded && data.uploaded[0]?.name) || file.name;

    if (!url) {
      return { success: false, error: data.error || `لم يُرجع الخادم رابطاً للصورة «${file.name}»` };
    }

    return {
      success: true,
      item: {
        url,
        publicId,
        name,
        source: data.source || 'local',
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل غير متوقع أثناء الرفع';
    return { success: false, error: msg };
  }
}

/**
 * Uploads multiple files sequentially with real-time progress and guaranteed Vercel payload safety.
 */
export async function uploadMultipleFilesSafe(
  files: File[],
  folder = 'hala_alajaweed/media',
  onProgress?: (progress: UploadProgressInfo) => void
): Promise<BatchUploadResult> {
  const succeeded: UploadedItem[] = [];
  const failed: Array<{ fileName: string; reason: string }> = [];

  const total = files.length;
  if (total === 0) return { succeeded, failed };

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const currentNumber = i + 1;

    if (onProgress) {
      onProgress({
        current: currentNumber,
        total,
        percentage: Math.round(((currentNumber - 1) / total) * 100),
        fileName: file.name,
      });
    }

    const result = await uploadSingleFileSafe(file, folder);

    if (result.success && result.item) {
      succeeded.push(result.item);
    } else {
      failed.push({
        fileName: file.name,
        reason: result.error || 'فشل الرفع',
      });
    }

    if (onProgress) {
      onProgress({
        current: currentNumber,
        total,
        percentage: Math.round((currentNumber / total) * 100),
        fileName: file.name,
      });
    }
  }

  return { succeeded, failed };
}

