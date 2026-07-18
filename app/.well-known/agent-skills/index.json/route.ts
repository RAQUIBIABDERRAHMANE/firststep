import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin
    
    let digest = ''
    try {
        const filePath = join(process.cwd(), 'public', 'skills', 'api-interaction.md')
        const fileContent = await readFile(filePath)
        digest = crypto.createHash('sha256').update(fileContent).digest('hex')
    } catch (error) {
        console.error('Error reading skill file for hash:', error)
        // fallback hash of default content
        const defaultContent = '# api-interaction\n\nPerform file uploads and stream order updates on the FirstStep SaaS platform.\n'
        digest = crypto.createHash('sha256').update(defaultContent).digest('hex')
    }

    const index = {
        $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
        skills: [
            {
                name: 'api-interaction',
                type: 'skill-md',
                description: 'Upload files and monitor orders via SSE on FirstStep platform.',
                url: `${origin}/skills/api-interaction.md`,
                digest: `sha256:${digest}`
            }
        ]
    }

    return NextResponse.json(index, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
    })
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept'
        }
    })
}
