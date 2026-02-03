'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { adminToggleUserService, adminCancelPaymentRequest } from '@/app/actions/admin'
import { Plus, X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface AdminServiceControlProps {
    userId: string
    userServices: Array<{
        id: string
        serviceId: string
        service: {
            id: string
            name: string
            description: string | null
            icon: string | null
            category: string | null
            status: string
            price: number | null
        }
    }>
    paymentRequests: Array<{
        id: string
        serviceId: string
        amount: number
        status: string
        createdAt: Date
        expiresAt: Date
        transferReference: string | null
        service: {
            id: string
            name: string
            price: number | null
        }
    }>
    allServices: Array<{
        id: string
        name: string
        description: string | null
        icon: string | null
        category: string | null
        status: string
        price: number | null
    }>
}

export default function AdminServiceControl({
    userId,
    userServices,
    paymentRequests,
    allServices
}: AdminServiceControlProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const [showAddService, setShowAddService] = useState(false)

    const activeServiceIds = userServices.map(us => us.serviceId)
    const availableServices = allServices.filter(s => !activeServiceIds.includes(s.id))

    const handleToggleService = async (serviceId: string, action: 'add' | 'remove') => {
        setLoading(serviceId)
        try {
            const result = await adminToggleUserService(userId, serviceId, action)
            if (result.error) {
                alert(result.error)
            }
        } catch (error) {
            console.error('Error toggling service:', error)
            alert('Failed to update service')
        } finally {
            setLoading(null)
        }
    }

    const handleCancelPayment = async (paymentId: string) => {
        if (!confirm('Are you sure you want to cancel this payment request?')) return

        setLoading(paymentId)
        try {
            const result = await adminCancelPaymentRequest(paymentId)
            if (result.error) {
                alert(result.error)
            }
        } catch (error) {
            console.error('Error cancelling payment:', error)
            alert('Failed to cancel payment')
        } finally {
            setLoading(null)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4" />
            case 'PAID':
                return <CheckCircle className="w-4 h-4" />
            case 'EXPIRED':
                return <AlertCircle className="w-4 h-4" />
            case 'CANCELLED':
                return <XCircle className="w-4 h-4" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'PAID':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'EXPIRED':
                return 'bg-red-100 text-red-700 border-red-200'
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-700 border-gray-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Active Services */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Services</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddService(!showAddService)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </Button>
                </div>

                {userServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No active services</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {userServices.map((us) => (
                            <div
                                key={us.id}
                                className="p-4 border rounded-lg flex items-start justify-between hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="text-2xl">{us.service.icon || '🛠️'}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm">{us.service.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {us.service.category || 'General'}
                                        </p>
                                        {us.service.price && (
                                            <p className="text-xs font-semibold text-primary mt-1">
                                                €{us.service.price.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                    onClick={() => handleToggleService(us.serviceId, 'remove')}
                                    disabled={loading === us.serviceId}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Service Section */}
            {showAddService && availableServices.length > 0 && (
                <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-semibold mb-4">Add Service to User</h4>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {availableServices.map((service) => (
                            <div
                                key={service.id}
                                className="p-4 border bg-white rounded-lg flex items-start justify-between hover:border-primary transition-colors"
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="text-2xl">{service.icon || '🛠️'}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm">{service.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {service.category || 'General'}
                                        </p>
                                        {service.price && (
                                            <p className="text-xs font-semibold text-primary mt-1">
                                                €{service.price.toFixed(2)}
                                            </p>
                                        )}
                                        {service.status === 'COMING_SOON' && (
                                            <Badge variant="outline" className="mt-2 text-xs">
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleToggleService(service.id, 'add')}
                                    disabled={loading === service.id}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Requests */}
            {paymentRequests.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Requests</h3>
                    <div className="space-y-3">
                        {paymentRequests.map((payment) => (
                            <div
                                key={payment.id}
                                className="p-4 border rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(payment.status)}`}>
                                        {getStatusIcon(payment.status)}
                                        <span className="text-xs font-medium">{payment.status}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{payment.service.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Amount: €{payment.amount} • Created: {new Date(payment.createdAt).toLocaleDateString()}
                                        </p>
                                        {payment.transferReference && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Ref: {payment.transferReference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">€{payment.amount}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Expires: {new Date(payment.expiresAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {payment.status === 'PENDING' && (
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            size="sm"
                                            onClick={() => handleToggleService(payment.serviceId, 'add')}
                                            disabled={loading === payment.id}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleCancelPayment(payment.id)}
                                            disabled={loading === payment.id}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
