import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function checkCloudinaryConnection(): Promise<{
  connected: boolean;
  cloudName?: string;
  error?: string;
}> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      connected: false,
      error: 'لم يتم تعيين بيانات Cloudinary كاملة في متغيرات البيئة (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)',
    };
  }

  try {
    const res = await cloudinary.api.ping();
    if (res && res.status === 'ok') {
      return { connected: true, cloudName };
    }
    return { connected: false, error: 'استجابة غير متوقعة من Cloudinary' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'فشل الاتصال بـ Cloudinary';
    return { connected: false, error: errorMsg };
  }
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = 'hala_alajaweed/products'
): Promise<CloudinaryUploadResult> {
  const connCheck = await checkCloudinaryConnection();
  if (!connCheck.connected) {
    throw new Error(connCheck.error || 'Cloudinary غير متصل');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('فشل الرفع إلى Cloudinary'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err);
    return false;
  }
}

