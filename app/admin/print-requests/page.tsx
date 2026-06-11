import { getPrintRequests } from '@/app/actions/admin'
import { signTableId } from '@/lib/crypto'
import PrintRequestsClient from './PrintRequestsClient'
import { headers } from 'next/headers'

export default async function PrintRequestsPage() {
    const requests = await getPrintRequests()
    
    // Get host from headers to build absolute URLs
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    // Pre-calculate signed QR URLs for all tables in all requests
    const requestsWithUrls = requests.map(req => {
        const tableIdsList = req.tableIds.split(',')
        const tablesInfo = tableIdsList.map(tid => {
            const tableDb = req.tenant.tables.find(t => t.id === tid)
            const number = tableDb ? tableDb.number : '?'
            
            // Generate signed URL
            const token = signTableId(tid)
            const url = `${origin}/${req.tenant.slug}?table=${token}`
            
            return {
                id: tid,
                number,
                url
            }
        })

        return {
            ...req,
            tablesInfo
        }
    })

    return (
        <PrintRequestsClient initialRequests={requestsWithUrls} />
    )
}
