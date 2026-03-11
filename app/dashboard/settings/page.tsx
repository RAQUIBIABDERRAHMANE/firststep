import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
            <SettingsForm user={{ companyName: user.companyName, email: user.email }} />
        </div>
    )
}
