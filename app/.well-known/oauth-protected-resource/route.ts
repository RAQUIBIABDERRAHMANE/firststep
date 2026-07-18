import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin

    const config = {
        resource: `${origin}/api`,
        authorization_servers: [origin],
        scopes_supported: ['read', 'write', 'upload', 'orders:stream'],
        bearer_methods_supported: ['header']
    }

    return NextResponse.json(config, {
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
