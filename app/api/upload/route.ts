import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { getCurrentUser } from '@/app/actions/auth'

export async function POST(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (error) {
        console.error('Error creating upload directory:', error)
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `${uniqueSuffix}-${filename}`
    const path = join(uploadDir, uniqueFilename)

    try {
        await writeFile(path, buffer)
        return NextResponse.json({
            success: true,
            url: `/uploads/${uniqueFilename}`,
            filename: file.name
        })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }
}
