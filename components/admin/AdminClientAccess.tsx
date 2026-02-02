'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Eye, Settings } from 'lucide-react'
import Link from 'next/link'

interface ClientWebsite {
    id: string
    companyName: string
    email: string
    websites: Array<{
        id: string
        slug: string
        siteName: string
        description: string | null
        isActive: boolean
        serviceId: string
        designTemplate: string
        service: {
            slug: string
        }
    }>
}

interface AdminClientAccessProps {
    clients: ClientWebsite[]
}

export default function AdminClientAccess({ clients }: AdminClientAccessProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredClients = clients.filter(client =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.websites.some(w => w.slug.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const getWebsiteUrl = (slug: string) => {
        if (process.env.NODE_ENV === 'production') {
            return `https://${slug}.firststepco.com`
        }
        return `http://localhost:3000/${slug}`
    }

    const getDashboardRoute = (serviceSlug: string) => {
        if (serviceSlug.includes('restaurant')) {
            return 'restaurant'
        } else if (serviceSlug.includes('cabinet') || serviceSlug.includes('professional-services')) {
            return 'cabinet'
        }
        return serviceSlug
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search clients or websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Client Cards */}
            <div className="space-y-4">
                {filteredClients.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No clients found
                        </CardContent>
                    </Card>
                ) : (
                    filteredClients.map((client) => (
                        <Card key={client.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{client.companyName}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {client.email}
                                        </CardDescription>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        {client.websites.length} {client.websites.length === 1 ? 'Site' : 'Sites'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {client.websites.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No websites yet</p>
                                ) : (
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {client.websites.map((website) => (
                                            <div
                                                key={website.id}
                                                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm truncate">
                                                            {website.siteName || website.slug}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Template: {website.designTemplate}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {website.isActive ? (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1"
                                                        asChild
                                                    >
                                                        <a
                                                            href={getWebsiteUrl(website.slug)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Site
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/${getDashboardRoute(website.service.slug)}/${website.slug}`}
                                                            className="flex items-center justify-center gap-2"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
