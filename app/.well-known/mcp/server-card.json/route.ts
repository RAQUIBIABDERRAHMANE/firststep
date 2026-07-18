import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin

    const serverCard = {
        serverInfo: {
            name: 'FirstStep API Server',
            version: '1.0.0'
        },
        endpoint: `${origin}/api/mcp`,
        capabilities: {
            tools: [
                {
                    name: 'uploadFile',
                    description: 'Upload an image or document (PDF) to the FirstStep platform storage.'
                },
                {
                    name: 'monitorOrderStatus',
                    description: 'Listen to live restaurant order status updates using a Server-Sent Events stream.'
                }
            ],
            resources: [],
            prompts: []
        }
    }

    return NextResponse.json(serverCard, {
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
