import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin

    const catalog = {
        linkset: [
            {
                anchor: `${origin}/api`,
                'service-desc': [
                    {
                        href: `${origin}/openapi.json`,
                        type: 'application/json'
                    }
                ],
                'service-doc': [
                    {
                        href: `${origin}/docs/api`,
                        type: 'text/html'
                    }
                ],
                status: [
                    {
                        href: `${origin}/api/health`,
                        type: 'application/json'
                    }
                ]
            }
        ]
    }

    return new NextResponse(JSON.stringify(catalog), {
        status: 200,
        headers: {
            'Content-Type': 'application/linkset+json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        }
    })
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
        }
    })
}
