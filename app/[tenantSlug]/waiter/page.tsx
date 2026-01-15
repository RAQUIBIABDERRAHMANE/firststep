import { redirect } from 'next/navigation'

interface Props {
    params: Promise<{ tenantSlug: string }>
}

export default async function WaiterRootPage({ params }: Props) {
    const { tenantSlug } = await params
    redirect(`/${tenantSlug}/waiter/login`)
}
