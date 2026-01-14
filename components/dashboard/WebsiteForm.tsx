'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { upsertWebsite } from '@/app/actions/tenant'
import { useRouter } from 'next/navigation'

interface WebsiteFormProps {
    initialData?: any
    serviceId: string
    userEmail: string
}

export default function WebsiteForm({ initialData, serviceId, userEmail }: WebsiteFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Parse existing config if available
    const existingConfig = initialData?.config ? JSON.parse(initialData.config) : {}

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        // Validate slug client-side basics
        const slug = formData.get('slug') as string
        if (!/^[a-z0-9-]+$/.test(slug)) {
            setError('Slug can only contain lowercase letters, numbers, and hyphens')
            setLoading(false)
            return
        }

        const result = await upsertWebsite(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess('Website saved successfully!')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <input type="hidden" name="serviceId" value={serviceId} />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 animate-fade-in">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm border border-emerald-200 animate-fade-in">
                    {success}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column: Core Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Business Presence</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Website Address (Slug)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground bg-muted/50 px-3 py-2 rounded-l-xl border border-r-0 text-sm">
                                /site/
                            </span>
                            <Input
                                name="slug"
                                defaultValue={initialData?.slug || ''}
                                placeholder="my-restaurant"
                                className="rounded-l-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Site Title</label>
                        <Input
                            name="siteName"
                            defaultValue={initialData?.siteName || ''}
                            placeholder="Delicious Eats"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tagline / Description</label>
                        <Input
                            name="description"
                            defaultValue={initialData?.description || ''}
                            placeholder="Best organic food in town"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Primary Brand Color</label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                name="primaryColor"
                                defaultValue={initialData?.primaryColor || '#3B82F6'}
                                className="w-12 h-10 rounded-xl cursor-pointer border-none p-0"
                            />
                            <Input
                                value={initialData?.primaryColor || '#3B82F6'}
                                className="flex-1"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Contact */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Branding & Media</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                            name="logo"
                            defaultValue={initialData?.logo || ''}
                            placeholder="https://.../logo.png"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Hero Image URL</label>
                        <Input
                            name="coverImage"
                            defaultValue={initialData?.coverImage || ''}
                            placeholder="https://.../hero.jpg"
                        />
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-2 mt-8">Contact Information</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Address</label>
                        <Input
                            name="address"
                            defaultValue={existingConfig.address || ''}
                            placeholder="123 Food Street, Downtown"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                name="phone"
                                defaultValue={existingConfig.phone || ''}
                                placeholder="+123..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                defaultValue={existingConfig.email || userEmail}
                                placeholder="contact@business.com"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t gap-4">
                <Button disabled={loading} size="lg" className="px-12">
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>

                {initialData?.slug && (
                    <a
                        href={`/${initialData.slug}`}
                        target="_blank"
                        className="text-sm font-semibold flex items-center gap-2 text-primary hover:underline hover:translate-x-1 transition-all"
                    >
                        View Live Website ↗
                    </a>
                )}
            </div>
        </form>
    )
}
