import { Readable } from 'node:stream';
import type { UploadApiResponse } from 'cloudinary';
import config from '../config';
import cloudinary from '../config/cloudinary';

export interface IUploadedCloudinaryAsset {
  name: string;
  size: number;
  url: string;
  publicId: string;
}

/**
 * Extracts the publicId from any Cloudinary asset URL.
 * Handles both versioned (/v12345/folder/id) and unversioned (/folder/id) URLs.
 * Returns null if the URL is not from res.cloudinary.com.
 */
export const extractCloudinaryPublicId = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
};

/**
 * Uploads a file buffer directly to Cloudinary using streaming.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  originalName: string,
  folder?: string
): Promise<IUploadedCloudinaryAsset> => {
  const targetFolder = folder || config.cloudinary.folder || 'student_portal/avatars';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: targetFolder,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      },
      (error: unknown, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(error || new Error('Failed to upload asset to Cloudinary.'));
        }

        resolve({
          name: originalName,
          size: result.bytes || fileBuffer.length,
          url: result.secure_url || result.url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Hard-deletes an asset from Cloudinary by its publicId.
 * Safeguarded defensively: Never throws uncaught exceptions.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' | 'auto' = 'image'
): Promise<boolean> => {
  if (!publicId || typeof publicId !== 'string') {
    return false;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as 'image' | 'raw' | 'video',
    });
    return res.result === 'ok';
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete asset with publicId: ${publicId}:`, error);
    return false;
  }
};

