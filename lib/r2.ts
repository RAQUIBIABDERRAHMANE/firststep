import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

const isR2Configured = !!(endpoint && accessKeyId && secretAccessKey && bucketName);

let s3Client: S3Client | null = null;
if (isR2Configured) {
    console.log('☁️ [R2] Initializing Cloudflare R2 Client');
    s3Client = new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
            accessKeyId: accessKeyId!,
            secretAccessKey: secretAccessKey!,
        },
    });
} else {
    console.log('📁 [R2] Client missing config. Local disk fallback active.');
}

/**
 * Uploads an image buffer to Cloudflare R2 if configured, or saves it to the local public/uploads directory.
 * @param buffer - File contents
 * @param filename - Unique filename
 * @param contentType - MIME/content type of the file
 * @returns The public URL of the uploaded image file
 */
export async function uploadImage(buffer: Buffer, filename: string, contentType: string): Promise<string> {
    if (isR2Configured && s3Client) {
        try {
            console.log(`☁️ [R2] Uploading ${filename} to R2 bucket "${bucketName}"`);
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: filename,
                Body: buffer,
                ContentType: contentType,
            });
            await s3Client.send(command);
            
            // Build absolute public URL
            const basePublicUrl = publicUrl?.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
            const fullUrl = `${basePublicUrl}/${filename}`;
            console.log(`☁️ [R2] Upload successful: ${fullUrl}`);
            return fullUrl;
        } catch (e) {
            console.error('❌ [R2] Upload failed. Falling back to local storage.', e);
        }
    }

    // Local filesystem fallback
    console.log(`📁 [R2 Fallback] Saving ${filename} to local public/uploads`);
    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, filename);
        const fileDir = path.dirname(filePath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${filename}`;
    } catch (fsErr) {
        console.error('❌ [R2 Fallback] Local file write failed:', fsErr);
        throw new Error('Failed to save file locally');
    }
}
