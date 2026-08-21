import { getCurrentUser } from '@/app/actions/auth'
import { getAnnouncements } from '@/app/actions/announcements'
import { redirect } from 'next/navigation'
import AdminAnnouncementsClient from './AdminAnnouncementsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const result = await getAnnouncements()
    const announcements = 'announcements' in result && result.announcements ? result.announcements : []

    return <AdminAnnouncementsClient initialAnnouncements={announcements as any} />
}
