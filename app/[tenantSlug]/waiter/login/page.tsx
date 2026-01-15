'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { loginWaiter } from '@/app/actions/waiter'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

export default function WaiterLoginPage() {
    const router = useRouter()
    const params = useParams()
    const tenantSlug = params?.tenantSlug as string
    const [pin, setPin] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (pin.length !== 4) return

        setIsLoading(true)
        setError('')

        const res = await loginWaiter(pin, tenantSlug)

        if (res.success && res.waiter) {
            // Save waiter session to localStorage for simplicity
            // In a real app, use HTTP-only cookies
            localStorage.setItem('waiter_id', res.waiter.id)
            localStorage.setItem('waiter_name', res.waiter.name)
            router.push(`/${tenantSlug}/waiter/dashboard`)
        } else {
            setError(res.error || 'Login failed')
            setIsLoading(false)
        }
    }

    const appendDigit = (digit: string) => {
        if (pin.length < 4) setPin(prev => prev + digit)
    }

    const deleteDigit = () => {
        setPin(prev => prev.slice(0, -1))
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                <div className="bg-slate-900 p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Waiter Login</h1>
                    <p className="text-slate-400 text-sm">Enter your 4-digit PIN</p>
                </div>

                <div className="p-8">
                    <div className="flex justify-center gap-2 mb-8">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border-2 ${i < pin.length
                                    ? 'bg-slate-900 border-slate-900'
                                    : 'border-slate-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center mb-6 font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => appendDigit(num.toString())}
                                className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 text-2xl font-bold text-slate-700 transition-colors shadow-sm active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                        <div />
                        <button
                            type="button"
                            onClick={() => appendDigit('0')}
                            className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 text-2xl font-bold text-slate-700 transition-colors shadow-sm active:scale-95"
                        >
                            0
                        </button>
                        <button
                            type="button"
                            onClick={deleteDigit}
                            className="h-16 rounded-2xl bg-slate-50 hover:bg-red-50 text-red-500 font-bold flex items-center justify-center transition-colors shadow-sm active:scale-95"
                        >
                            ⌫
                        </button>
                    </div>

                    <Button
                        className="w-full h-14 text-lg font-bold rounded-xl"
                        onClick={handleLogin}
                        disabled={isLoading || pin.length !== 4}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Login'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
