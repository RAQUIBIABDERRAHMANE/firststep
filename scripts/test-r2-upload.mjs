import 'dotenv/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function testR2() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  console.log('R2 Config:', { endpoint, accessKeyId: accessKeyId ? '***' : null, bucketName, publicUrl })

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error('❌ R2 Missing Env Variables!')
    return
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  try {
    const testContent = Buffer.from('Cloudflare R2 Employment Test Content')
    const key = `test_employment_${Date.now()}.txt`
    console.log(`Uploading ${key} to ${bucketName}...`)

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: testContent,
      ContentType: 'text/plain',
    })

    await s3Client.send(command)
    const url = `${publicUrl?.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl}/${key}`
    console.log('✅ Cloudflare R2 Upload Success! Public URL:', url)
  } catch (err) {
    console.error('❌ Cloudflare R2 Upload Error:', err)
  }
}

testR2()
