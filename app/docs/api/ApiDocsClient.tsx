'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import {
    Terminal,
    Activity,
    FileCode,
    Upload,
    Share2,
    Compass,
    Server,
    Database,
    BookOpen,
    Copy,
    Check,
    ExternalLink,
    Code
} from 'lucide-react'

type EndpointKey = 'catalog' | 'health' | 'upload' | 'stream'

export default function ApiDocsClient({ user }: { user?: any }) {
    const [activeTab, setActiveTab] = useState<EndpointKey>('catalog')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const endpoints = {
        catalog: {
            title: 'RFC 9727 API Catalog Discovery',
            method: 'GET',
            path: '/.well-known/api-catalog',
            description: 'The standard well-known entry point for automated API discovery. Agents, scanners, and tools can query this catalog to discover OpenAPI specs, status endpoints, and documentation.',
            headers: [
                { name: 'Accept', value: 'application/linkset+json', required: 'Recommended' },
            ],
            curl: `curl -H "Accept: application/linkset+json" https://firststepco.com/.well-known/api-catalog`,
            response: `{
  "linkset": [
    {
      "anchor": "https://firststepco.com/api",
      "service-desc": [
        {
          "href": "https://firststepco.com/openapi.json",
          "type": "application/json"
        }
      ],
      "service-doc": [
        {
          "href": "https://firststepco.com/docs/api",
          "type": "text/html"
        }
      ],
      "status": [
        {
          "href": "https://firststepco.com/api/health",
          "type": "application/json"
        }
      ]
    }
  ]
}`
        },
        health: {
            title: 'API Health Check',
            method: 'GET',
            path: '/api/health',
            description: 'Verifies the health status of the application server and queries the backend SQLite/Turso database using Prisma to check connectivity.',
            headers: [
                { name: 'Accept', value: 'application/json', required: 'Optional' },
            ],
            curl: `curl https://firststepco.com/api/health`,
            response: `{
  "status": "healthy",
  "timestamp": "${new Date().toISOString()}",
  "database": "connected"
}`
        },
        upload: {
            title: 'File Upload Endpoint',
            method: 'POST',
            path: '/api/upload',
            description: 'Allows uploading images and invoice PDFs to the platform storage. This endpoint is secured and requires an active session with the ADMIN role.',
            headers: [
                { name: 'Content-Type', value: 'multipart/form-data', required: 'Required' },
                { name: 'Cookie', value: 'Session cookie', required: 'Required' },
            ],
            curl: `curl -X POST -F "file=@invoice.pdf" https://firststepco.com/api/upload`,
            response: `{
  "success": true,
  "url": "/uploads/1721234567-invoice.pdf",
  "filename": "invoice.pdf"
}`
        },
        stream: {
            title: 'Order SSE Live Monitor Stream',
            method: 'GET',
            path: '/api/tenant/[tenantSlug]/orders/[orderId]/stream',
            description: 'Establishes a real-time Server-Sent Events (SSE) connection to listen to live restaurant order updates. The connection automatically closes when a terminal status (SERVED, PAID, CANCELED) is reached.',
            headers: [
                { name: 'Accept', value: 'text/event-stream', required: 'Required' },
                { name: 'Cache-Control', value: 'no-cache', required: 'Required' },
            ],
            curl: `curl -N -H "Accept: text/event-stream" https://firststepco.com/api/tenant/restaurant-concept/orders/ord-9921/stream`,
            response: `event: message
data: {"status":"PENDING","updatedAt":"2026-07-18T08:40:01.000Z"}

event: message
data: {"status":"PREPARING","updatedAt":"2026-07-18T08:42:15.000Z"}

event: message
data: {"status":"READY","updatedAt":"2026-07-18T08:44:30.000Z"}`
        }
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-figtree select-text">
            <Navbar user={user} />

            {/* Main Wrapper */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-16 flex flex-col gap-10">
                
                {/* Hero Header */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.01] p-8 md:p-12 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0066FF]/40 to-transparent" />
                    <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#0066FF]/5 blur-[120px] pointer-events-none" />
                    
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/5 text-[12px] font-semibold text-[#0066FF] tracking-wider uppercase">
                            <Compass className="w-3.5 h-3.5" /> Automated Discovery
                        </div>
                        <h1 className="font-syne font-black text-3xl md:text-5xl text-white tracking-tight leading-tight">
                            Developer Hub & <span className="text-[#0066FF]">API Catalog</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                            FirstStep implements standardized machine-discoverability via <strong className="text-white">RFC 9727</strong>. Our platform supports automated agent discovery, structured OpenAPI schema hosting, and server health monitoring.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/.well-known/api-catalog" target="_blank" className="inline-flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors duration-200">
                                <Share2 className="w-4 h-4 text-[#0066FF]" /> Live Catalog
                            </Link>
                            <span className="text-slate-700">|</span>
                            <Link href="/openapi.json" target="_blank" className="inline-flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors duration-200">
                                <FileCode className="w-4 h-4 text-[#0066FF]" /> OpenAPI Spec (JSON)
                            </Link>
                            <span className="text-slate-700">|</span>
                            <Link href="/api/health" target="_blank" className="inline-flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors duration-200">
                                <Activity className="w-4 h-4 text-[#0066FF]" /> System Health
                            </Link>
                        </div>
                    </div>
                </div>

                {/* API Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar navigation */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#0066FF]/70 px-2">Endpoints</h2>
                        <div className="flex flex-col gap-2">
                            {(Object.keys(endpoints) as EndpointKey[]).map((key) => {
                                const ep = endpoints[key]
                                const isActive = activeTab === key
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[#0066FF]/10 to-transparent border-[#0066FF]/40 text-white shadow-lg shadow-[#0066FF]/5'
                                                : 'bg-white/[0.01] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.02] text-slate-400'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-[#0066FF] text-white' : 'bg-white/5 text-slate-400'}`}>
                                            {key === 'catalog' && <Compass className="w-4 h-4" />}
                                            {key === 'health' && <Activity className="w-4 h-4" />}
                                            {key === 'upload' && <Upload className="w-4 h-4" />}
                                            {key === 'stream' && <Server className="w-4 h-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold text-[14px] leading-none">{ep.title}</div>
                                            <div className="flex items-center gap-2 text-[11px] font-mono">
                                                <span className={`font-black ${ep.method === 'GET' ? 'text-emerald-500' : 'text-[#0066FF]'}`}>{ep.method}</span>
                                                <span className="opacity-60 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{ep.path}</span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Extra Standards info */}
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.01] p-5 space-y-4">
                            <h3 className="font-syne font-bold text-white text-[13px]">Standard Support</h3>
                            <p className="text-[12px] text-slate-400 leading-relaxed">
                                Our catalog implements <strong className="text-slate-300">RFC 9727 (API Catalog)</strong> and represents links via the standard <strong className="text-slate-300">Linkset JSON format (RFC 9264)</strong>. All connections should use HTTPS.
                            </p>
                            <div className="flex flex-col gap-2">
                                <Link href="https://www.rfc-editor.org/rfc/rfc9727" target="_blank" className="inline-flex items-center gap-1 text-[11px] text-[#0066FF] hover:underline font-medium">
                                    RFC 9727 Spec <ExternalLink className="w-3 h-3" />
                                </Link>
                                <Link href="https://www.rfc-editor.org/rfc/rfc9264" target="_blank" className="inline-flex items-center gap-1 text-[11px] text-[#0066FF] hover:underline font-medium">
                                    RFC 9264 Linkset Format <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Endpoint Details Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#030712] p-6 md:p-8 space-y-6">
                            
                            {/* Path and Title */}
                            <div className="space-y-3 pb-6 border-b border-white/[0.06]">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-2.5 py-0.5 text-xs font-black font-mono rounded ${
                                        endpoints[activeTab].method === 'GET' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20'
                                    }`}>
                                        {endpoints[activeTab].method}
                                    </span>
                                    <span className="font-mono text-sm text-slate-300 select-all">{endpoints[activeTab].path}</span>
                                </div>
                                <h2 className="font-syne font-bold text-xl md:text-2xl text-white">{endpoints[activeTab].title}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">{endpoints[activeTab].description}</p>
                            </div>

                            {/* Headers & Parameters */}
                            <div className="space-y-3">
                                <h3 className="font-syne font-bold text-[13px] text-white tracking-wide uppercase">Request Headers</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/[0.06] text-slate-400">
                                                <th className="py-2 font-medium">Header</th>
                                                <th className="py-2 font-medium">Value</th>
                                                <th className="py-2 font-medium text-right">Requirement</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {endpoints[activeTab].headers.map((h, i) => (
                                                <tr key={i} className="border-b border-white/[0.04]">
                                                    <td className="py-3 font-mono font-medium text-[#0066FF]">{h.name}</td>
                                                    <td className="py-3 font-mono text-slate-300">{h.value}</td>
                                                    <td className="py-3 text-right font-medium">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                                                            h.required === 'Required' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                                                        }`}>
                                                            {h.required}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Request Command (cURL) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-syne font-bold text-[13px] text-white tracking-wide uppercase">Example Request</h3>
                                    <button
                                        onClick={() => copyToClipboard(endpoints[activeTab].curl, 'req')}
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200"
                                    >
                                        {copiedId === 'req' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="bg-[#030712] rounded-xl border border-white/[0.06] p-4 font-mono text-xs overflow-x-auto text-[#0066FF] flex items-center justify-between">
                                    <span className="select-all whitespace-pre-wrap">{endpoints[activeTab].curl}</span>
                                </div>
                            </div>

                            {/* Response Payload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-syne font-bold text-[13px] text-white tracking-wide uppercase">Example Response</h3>
                                    <button
                                        onClick={() => copyToClipboard(endpoints[activeTab].response, 'res')}
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200"
                                    >
                                        {copiedId === 'res' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="bg-black/40 rounded-xl border border-white/[0.06] p-4 font-mono text-xs overflow-x-auto text-emerald-500/90 leading-relaxed shadow-inner">
                                    <pre className="select-text whitespace-pre">{endpoints[activeTab].response}</pre>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
