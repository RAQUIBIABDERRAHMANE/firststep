'use client'

import { useState } from 'react'
import { addUserService } from '@/app/actions/services'
import { getBankAccount, getPaymentRequest } from '@/app/actions/payments'
import { Button } from '@/components/ui/Button'
import PaymentModal from '@/components/ui/PaymentModal'
import { CreditCard, Clock, CheckCircle } from 'lucide-react'

interface ServiceButtonProps {
    service: {
        id: string
        name: string
        status: string
        category: string | null
    }
    userHasService: boolean
}

export default function ServiceButton({ service, userHasService }: ServiceButtonProps) {
    const [loading, setLoading] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentData, setPaymentData] = useState<{
        paymentRequest: {
            id: string
            amount: number
            service: { name: string }
            expiresAt: Date
            transferReference?: string | null
        }
        bankAccount: {
            accountName: string
            iban: string
            bic?: string | null
            bankName: string
        }
    } | null>(null)

    const handleServiceAction = async () => {
        if (userHasService) return

        setLoading(true)
        const result = await addUserService(service.id)
        
        if (result.error) {
            alert(result.error)
            setLoading(false)
            return
        }

        if (result.type === 'notification') {
            alert('Vous serez notifié dès que ce service sera disponible!')
            setLoading(false)
            return
        }

        if (result.type === 'payment' && result.paymentId) {
            // Fetch payment details and bank account info
            const [paymentRequest, bankAccount] = await Promise.all([
                getPaymentRequest(result.paymentId),
                getBankAccount()
            ])

            if (paymentRequest && bankAccount) {
                setPaymentData({ paymentRequest, bankAccount })
                setShowPaymentModal(true)
            } else {
                alert('Erreur lors du chargement des informations de paiement')
            }
        }

        setLoading(false)
    }

    const getButtonContent = () => {
        if (userHasService) {
            return (
                <>
                    <CheckCircle className="h-4 w-4" />
                    Activé
                </>
            )
        }

        if (service.status === 'COMING_SOON') {
            return (
                <>
                    <Clock className="h-4 w-4" />
                    M&apos;alerter
                </>
            )
        }

        return (
            <>
                <CreditCard className="h-4 w-4" />
                Acheter
            </>
        )
    }

    const getServicePrice = (category: string | null): number => {
        const prices: Record<string, number> = {
            'restaurant': 299.00,
            'professional-services': 199.00,
            'inventory': 149.00,
            'rental': 249.00,
            'hospitality': 399.00,
            'healthcare': 349.00,
        }
        
        return prices[category || ''] || 99.00
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={handleServiceAction}
                    disabled={loading || userHasService}
                    className={`
                        flex items-center gap-2 w-full
                        ${userHasService 
                            ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                            : service.status === 'COMING_SOON'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                    `}
                >
                    {loading ? 'Chargement...' : getButtonContent()}
                </Button>
                
                {service.status === 'AVAILABLE' && !userHasService && (
                    <div className="text-center">
                        <span className="text-lg font-bold text-blue-600">
                            {getServicePrice(service.category).toFixed(2)} $
                        </span>
                        <div className="text-xs text-gray-500">
                            Paiement unique
                        </div>
                    </div>
                )}
            </div>

            {showPaymentModal && paymentData && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    paymentRequest={paymentData.paymentRequest}
                    bankAccount={paymentData.bankAccount}
                />
            )}
        </>
    )
}