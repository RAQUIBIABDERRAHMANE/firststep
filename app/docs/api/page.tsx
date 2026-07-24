import { getCurrentUser } from '@/app/actions/auth'
import ApiDocsClient from '@/app/docs/api/ApiDocsClient'

export const dynamic = 'force-dynamic'

export default async function ApiDocsPage() {
    const user = await getCurrentUser()
    return <ApiDocsClient user={user} />
}