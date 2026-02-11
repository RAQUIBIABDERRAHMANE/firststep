import { unsubscribeUser } from '@/app/actions/unsubscribe'
import Link from 'next/link'

export default async function UnsubscribePage(props: { searchParams: Promise<{ email: string }> }) {
    const searchParams = await props.searchParams
    const email = searchParams.email
    let message = ''

    if (email) {
        const result = await unsubscribeUser(email)
        message = result.message
    } else {
        message = 'Invalid unsubscribe link.'
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Unsubscribe</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link href="/" className="text-blue-600 hover:underline">
                    Return to Home
                </Link>
            </div>
        </div>
    )
}
