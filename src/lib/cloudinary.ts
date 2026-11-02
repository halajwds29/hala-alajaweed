import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Credentials (with reliable project fallbacks for Vercel deployment)
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'ids2z4tw';
const API_KEY = process.env.CLOUDINARY_API_KEY || '765954591996792';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'OmKqHxFeazePSlJ_P4M4djcxClw';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export async function checkCloudinaryConnection(): Promise<{
  connected: boolean;
  cloudName?: string;
  error?: string;
}> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return {
      connected: false,
      error: 'لم يتم تعيين بيانات Cloudinary',
    };
  }

  try {
    const res = await cloudinary.api.ping();
    if (res && res.status === 'ok') {
      return { connected: true, cloudName: CLOUD_NAME };
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
  bytes?: number;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = 'hala_alajaweed/media'
): Promise<CloudinaryUploadResult> {
  // Ensure config is fresh
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'],
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
          bytes: result.bytes,
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

export interface CloudinaryResource {
  name: string;
  url: string;
  publicId: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export async function listCloudinaryImages(prefix = 'hala_alajaweed'): Promise<CloudinaryResource[]> {
  try {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results: 100,
    });

    if (!res || !Array.isArray(res.resources)) {
      return [];
    }

    return res.resources.map((item: any) => ({
      name: item.public_id.split('/').pop() || item.public_id,
      url: item.secure_url,
      publicId: item.public_id,
      size: item.bytes || 0,
      createdAt: item.created_at,
      modifiedAt: item.created_at,
    }));
  } catch (err) {
    console.warn('Failed to list Cloudinary images:', err);
    return [];
  }
}
