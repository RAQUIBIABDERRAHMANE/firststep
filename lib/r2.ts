import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  const isConfigured = !!(endpoint && accessKeyId && secretAccessKey && bucketName);

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
    isConfigured,
  };
}

let s3ClientInstance: S3Client | null = null;

function getS3Client(): { s3Client: S3Client | null; config: ReturnType<typeof getR2Config> } {
  const config = getR2Config();
  if (config.isConfigured) {
    if (!s3ClientInstance) {
      console.log('☁️ [R2] Initializing Cloudflare R2 Client dynamically');
      s3ClientInstance = new S3Client({
        region: 'auto',
        endpoint: config.endpoint,
        credentials: {
          accessKeyId: config.accessKeyId!,
          secretAccessKey: config.secretAccessKey!,
        },
      });
    }
    return { s3Client: s3ClientInstance, config };
  }
  return { s3Client: null, config };
}

/**
 * Uploads a file buffer to Cloudflare R2 if configured, or saves it to local public/uploads directory.
 * @param buffer - File contents
 * @param filename - Unique filename or relative path
 * @param contentType - MIME/content type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const { s3Client, config } = getS3Client();

  if (s3Client && config.isConfigured) {
    try {
      console.log(`☁️ [R2] Uploading ${filename} to R2 bucket "${config.bucketName}"`);
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      });
      await s3Client.send(command);

      const basePublicUrl = config.publicUrl?.endsWith('/')
        ? config.publicUrl.slice(0, -1)
        : config.publicUrl;
      const fullUrl = `${basePublicUrl}/${filename}`;
      console.log(`☁️ [R2] Upload successful: ${fullUrl}`);
      return fullUrl;
    } catch (e) {
      console.error('❌ [R2] Upload to Cloudflare R2 failed:', e);
    }
  }

  // Fallback to local filesystem
  console.log(`📁 [R2 Fallback] Saving ${filename} to local public/uploads`);
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const sanitizedFilename = filename.replace(/[\/\\]/g, '_');
    const filePath = path.join(uploadsDir, sanitizedFilename);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${sanitizedFilename}`;
  } catch (fsErr) {
    console.error('❌ [R2 Fallback] Local file write failed:', fsErr);
    throw new Error('Erreur de sauvegarde du fichier. Veuillez vérifier la configuration Cloudflare R2.');
  }
}

/**
 * Alias for uploadToR2 for backwards compatibility
 */
export async function uploadImage(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  return uploadToR2(buffer, filename, contentType);
}
