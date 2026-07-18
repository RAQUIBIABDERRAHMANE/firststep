'use client'

import { useEffect } from 'react'

export default function WebMCPInitializer() {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const modelContext = (navigator as any).modelContext
        if (!modelContext) {
            console.log('WebMCP: navigator.modelContext not detected in this browser environment.')
            return
        }

        const tools = [
            {
                name: 'uploadFile',
                description: 'Upload a file to FirstStep platform storage.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', description: 'Base64 encoded file data' },
                        filename: { type: 'string', description: 'Name of the file' }
                    },
                    required: ['file', 'filename']
                },
                async execute({ file, filename }: { file: string, filename: string }) {
                    console.log('WebMCP: uploadFile execution requested for:', filename)
                    try {
                        const blob = await (await fetch(`data:application/octet-stream;base64,${file}`)).blob()
                        const formData = new FormData()
                        formData.append('file', blob, filename)

                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        })

                        return await res.json()
                    } catch (error: any) {
                        return { success: false, error: error.message || 'Upload failed' }
                    }
                }
            },
            {
                name: 'getHealthStatus',
                description: 'Get the health status of the application and database connectivity.',
                inputSchema: { type: 'object', properties: {} },
                async execute() {
                    console.log('WebMCP: getHealthStatus execution requested')
                    try {
                        const res = await fetch('/api/health')
                        return await res.json()
                    } catch (error: any) {
                        return { status: 'unhealthy', error: error.message }
                    }
                }
            }
        ]

        try {
            // Support provideContext
            if (typeof modelContext.provideContext === 'function') {
                modelContext.provideContext({
                    tools: tools.map(t => ({
                        name: t.name,
                        description: t.description,
                        inputSchema: t.inputSchema,
                        execute: t.execute
                    }))
                })
                console.log('WebMCP: Tools registered successfully via provideContext')
            }
        } catch (e) {
            console.error('WebMCP provideContext error:', e)
        }

        try {
            // Support registerTool
            if (typeof modelContext.registerTool === 'function') {
                tools.forEach(t => {
                    modelContext.registerTool({
                        name: t.name,
                        description: t.description,
                        inputSchema: t.inputSchema,
                        execute: t.execute
                    })
                })
                console.log('WebMCP: Tools registered successfully via registerTool')
            }
        } catch (e) {
            console.error('WebMCP registerTool error:', e)
        }
    }, [])

    return null
}
