import { getAllPendingPayments, confirmPayment, rejectPayment } from '@/app/actions/payments'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, CreditCard, User, CheckCircle, XCircle } from 'lucide-react'

export default async function PendingPaymentsPage() {
    const pendingPayments = await getAllPendingPayments()

    const handleConfirm = async (paymentId: string) => {
        'use server'
        await confirmPayment(paymentId)
    }

    const handleReject = async (paymentId: string) => {
        'use server'
        await rejectPayment(paymentId)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <CreditCard className="h-8 w-8" />
                    Paiements en attente
                </h1>
                <p className="text-gray-600 mt-2">
                    Gérez les demandes de paiement en attente de confirmation
                </p>
            </div>

            {pendingPayments.length === 0 ? (
                <Card className="p-8 text-center">
                    <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun paiement en attente
                    </h3>
                    <p className="text-gray-500">
                        Toutes les demandes de paiement ont été traitées
                    </p>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {pendingPayments.map((payment) => {
                        const expiresAt = new Date(payment.expiresAt)
                        const isExpired = expiresAt < new Date()

                        return (
                            <Card key={payment.id} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {payment.service.name}
                                            </h3>
                                            <Badge variant={isExpired ? 'destructive' : 'secondary'}>
                                                {isExpired ? 'Expiré' : 'En attente'}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="h-4 w-4" />
                                                <span>{payment.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    Créé le {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        </div>

                                        {payment.transferReference && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="text-sm text-blue-700">
                                                    <strong>Référence de virement:</strong> {payment.transferReference}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right ml-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {payment.amount.toFixed(2)} €
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Expire le {expiresAt.toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <form action={handleConfirm.bind(null, payment.id)}>
                                        <Button
                                            type="submit"
                                            variant="default"
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            disabled={isExpired}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirmer le paiement
                                        </Button>
                                    </form>
                                    
                                    <form action={handleReject.bind(null, payment.id)}>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className="border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Rejeter
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}