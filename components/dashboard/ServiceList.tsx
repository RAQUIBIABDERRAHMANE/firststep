'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { addUserService, removeUserService } from '@/app/actions/services'
import { getBankAccount, getPaymentRequest } from '@/app/actions/payments'
import PaymentModal from '@/components/ui/PaymentModal'
import { Loader2 } from 'lucide-react'

type Service = {
    id: string
    name: string
    description: string | null
    status: string
    category: string | null
    price: number | null
    icon: string | null
}

interface ServiceListProps {
    allServices: Service[]
    selectedServiceIds: string[]
}

export function ServiceList({ allServices, selectedServiceIds }: ServiceListProps) {
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()
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

    const handleToggleService = async (serviceId: string, isSelected: boolean) => {
        setPendingIds(prev => new Set(prev).add(serviceId))

        try {
            if (isSelected) {
                // Remove service - no payment needed
                startTransition(async () => {
                    await removeUserService(serviceId)
                    setPendingIds(prev => {
                        const next = new Set(prev)
                        next.delete(serviceId)
                        return next
                    })
                })
            } else {
                // Add service - may need payment
                const result = await addUserService(serviceId)
                
                if (result.error) {
                    alert(result.error)
                    setPendingIds(prev => {
                        const next = new Set(prev)
                        next.delete(serviceId)
                        return next
                    })
                    return
                }

                if (result.type === 'notification') {
                    alert('Vous serez notifié dès que ce service sera disponible!')
                    setPendingIds(prev => {
                        const next = new Set(prev)
                        next.delete(serviceId)
                        return next
                    })
                    // Refresh page to update state
                    window.location.reload()
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

                setPendingIds(prev => {
                    const next = new Set(prev)
                    next.delete(serviceId)
                    return next
                })
            }
        } catch (error) {
            console.error('Error toggling service:', error)
            alert('Une erreur est survenue. Veuillez réessayer.')
            setPendingIds(prev => {
                const next = new Set(prev)
                next.delete(serviceId)
                return next
            })
        }
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allServices.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id)
                    const isActionPending = pendingIds.has(service.id) || isPending

                    return (
                        <Card key={service.id} className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {service.icon && <span className="text-2xl">{service.icon}</span>}
                                        <CardTitle className="text-base">{service.name}</CardTitle>
                                    </div>
                                    <Badge variant={service.status === 'AVAILABLE' ? 'success' : 'warning'}>
                                        {service.status === 'AVAILABLE' ? 'Available' : 'Coming Soon'}
                                    </Badge>
                                </div>
                                <CardDescription>{service.description}</CardDescription>
                                {service.price && service.status === 'AVAILABLE' && (
                                    <p className="text-lg font-semibold text-primary mt-2">
                                        ${service.price.toFixed(2)}
                                    </p>
                                )}
                            </CardHeader>
                            <CardFooter>
                                <Button
                                    variant={isSelected ? "outline" : "default"}
                                    className="w-full"
                                    onClick={() => handleToggleService(service.id, isSelected)}
                                    disabled={isActionPending}
                                >
                                    {isActionPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    {isSelected ? 'Remove Service' : (service.status === 'AVAILABLE' ? 'Add Service' : 'Notify Me')}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {showPaymentModal && paymentData && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false)
                        // Refresh page after payment modal closes
                        window.location.reload()
                    }}
                    paymentRequest={paymentData.paymentRequest}
                    bankAccount={paymentData.bankAccount}
                />
            )}
        </>
    )
}
