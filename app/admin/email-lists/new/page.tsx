import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { EmailListForm } from './email-list-form'

export default async function NewEmailListPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create Email List
                </h1>
                <p className="text-gray-600 mt-2">
                    Add a new email list for your marketing campaigns
                </p>
            </div>

            <EmailListForm />
        </div>
    )
}
