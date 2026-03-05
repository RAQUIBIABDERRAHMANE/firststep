'use client'

import { useTransition, useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { syncSmartEmailLists } from '@/app/actions/email-lists'

export default function SyncButton() {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    function handleSync() {
        setStatus('idle')
        startTransition(async () => {
            const result = await syncSmartEmailLists()
            if (result.error) {
                setStatus('error')
                setMessage(result.error)
            } else {
                setStatus('success')
                setMessage(`${result.results?.length ?? 0} liste(s) synchronisée(s)`)
                setTimeout(() => setStatus('idle'), 4000)
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSync}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                {isPending ? 'Synchronisation...' : 'Sync listes auto'}
            </button>

            {status === 'success' && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {message}
                </span>
            )}
            {status === 'error' && (
                <span className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {message}
                </span>
            )}
        </div>
    )
}
