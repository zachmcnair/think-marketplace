import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for Railway S3-compatible storage
})

const BUCKET_NAME = process.env.S3_BUCKET!

/**
 * Upload a file to S3-compatible storage
 */
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  })

  await s3Client.send(command)

  // Return the public URL
  return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`
}

/**
 * Delete a file from S3-compatible storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Generate a unique filename for uploads
 */
export function generateFilename(originalName: string, prefix: string = 'uploads'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'bin'

  return `${prefix}/${timestamp}-${random}.${extension}`
}

/**
 * Validate file is an allowed image type
 */
export function isValidImageType(contentType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ]

  return allowedTypes.includes(contentType)
}

/**
 * Max file size (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024
