# auth.md - FirstStep Agent Registration Instructions

FirstStep supports automated agent registration and authentication. Developers and AI agents can programmatically request client credentials or register identities to access protected FirstStep endpoints.

## Discovery

Discover our authentication capability endpoints by querying:
- OIDC Configuration: `/.well-known/openid-configuration`
- OAuth 2.0 Authorization Server: `/.well-known/oauth-authorization-server`
- Protected Resource Metadata: `/.well-known/oauth-protected-resource`

## Registration

To register your AI agent and obtain access credentials:

1. Send a POST request to our registration endpoint: `/api/agent/register`
2. Supported identity assertion types include `urn:ietf:params:oauth:token-type:id-jag` (Identity-Joint Agent Group) and `verified_email`.
3. Alternatively, anonymous registration is supported for public read-only access.

## Using Credentials

Once registered and authorized, include the issued Bearer Token (JWT) in the `Authorization` header of all subsequent API requests:

```http
Authorization: Bearer <your_agent_jwt_token>
```
