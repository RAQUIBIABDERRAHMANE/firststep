import { getUserPaymentRequests } from '@/app/actions/payments'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default async function UserPayments() {
    const paymentRequests = await getUserPaymentRequests()

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-4 w-4" />
            case 'PAID':
                return <CheckCircle className="h-4 w-4" />
            case 'CANCELLED':
                return <XCircle className="h-4 w-4" />
            case 'EXPIRED':
                return <AlertCircle className="h-4 w-4" />
            default:
                return <CreditCard className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'PAID':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-800 border-gray-200'
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'En attente'
            case 'PAID':
                return 'Payé'
            case 'CANCELLED':
                return 'Annulé'
            case 'EXPIRED':
                return 'Expiré'
            default:
                return status
        }
    }

    if (paymentRequests.length === 0) {
        return (
            <Card className="p-8 text-center">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune demande de paiement
                </h3>
                <p className="text-gray-500">
                    Vous n&apos;avez pas encore de demandes de paiement
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mes paiements
            </h3>
            
            <div className="grid gap-4">
                {paymentRequests.map((payment) => {
                    const expiresAt = new Date(payment.expiresAt)
                    const isExpired = expiresAt < new Date() && payment.status === 'PENDING'
                    
                    return (
                        <Card key={payment.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        {payment.service.name}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>
                                            Créé le {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                        {payment.status === 'PENDING' && (
                                            <span>
                                                Expire le {expiresAt.toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-xl font-bold text-gray-900 mb-2">
                                        {payment.amount.toFixed(2)} €
                                    </div>
                                    <Badge className={`border ${getStatusColor(isExpired ? 'EXPIRED' : payment.status)}`}>
                                        <div className="flex items-center gap-1">
                                            {getStatusIcon(isExpired ? 'EXPIRED' : payment.status)}
                                            {getStatusText(isExpired ? 'EXPIRED' : payment.status)}
                                        </div>
                                    </Badge>
                                </div>
                            </div>
                            
                            {payment.transferReference && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="text-sm text-blue-700">
                                        <strong>Référence de virement:</strong> {payment.transferReference}
                                    </div>
                                </div>
                            )}
                            
                            {payment.status === 'PAID' && payment.confirmedAt && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-sm text-green-700">
                                        <strong>Paiement confirmé le:</strong> {new Date(payment.confirmedAt).toLocaleDateString('fr-FR')} à {new Date(payment.confirmedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}