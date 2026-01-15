import { getTenantBySlug } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CartProvider } from '@/lib/contexts/CartContext'

type Props = {
    children: React.ReactNode
    params: Promise<{ tenantSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tenantSlug } = await params
    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant) return {}

    let pageTitle = tenant.siteName
    try {
        if (tenant.config) {
            const config = JSON.parse(tenant.config)
            if (config.pageTitle) {
                pageTitle = config.pageTitle
            }
        }
    } catch (e) {
        // ignore JSON parse error
    }

    return {
        title: pageTitle,
        description: tenant.description || `${tenant.siteName} - Powered by FirstStep`,
        icons: {
            icon: tenant.logo || '/logo.ico',
        }
    }
}

export default async function TenantLayout({ children, params }: Props) {
    const { tenantSlug } = await params
    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant || !tenant.isActive) {
        notFound()
    }

    return (
        <CartProvider>
            <div
                className="min-h-screen bg-slate-50"
                style={{
                    '--primary-color': tenant.primaryColor || '#3B82F6',
                } as React.CSSProperties}
            >
                {children}
            </div>
        </CartProvider>
    )
}
