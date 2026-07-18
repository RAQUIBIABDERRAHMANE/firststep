import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin

    const config = {
        issuer: origin,
        authorization_endpoint: `${origin}/login`,
        token_endpoint: `${origin}/api/auth/token`,
        jwks_uri: `${origin}/.well-known/jwks.json`,
        response_types_supported: ['code', 'token'],
        grant_types_supported: ['authorization_code', 'client_credentials'],
        token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
        agent_auth: {
            skill: `${origin}/.well-known/agent-skills/index.json`,
            register_uri: `${origin}/api/agent/register`,
            identity_types_supported: ['identity_assertion', 'anonymous'],
            identity_assertion: {
                assertion_types_supported: ['urn:ietf:params:oauth:token-type:id-jag', 'verified_email'],
                credential_types_supported: ['jwt'],
                claim_uri: `${origin}/api/agent/claim`
            },
            anonymous: {
                credential_types_supported: ['jwt'],
                claim_uri: `${origin}/api/agent/claim`
            }
        }
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
