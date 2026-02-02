'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { X, Copy, Check, CreditCard, Building2, Clock, Info } from 'lucide-react'
import { updateTransferReference } from '@/app/actions/payments'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    paymentRequest: {
        id: string
        amount: number
        service: { 
            name: string
            description?: string | null
            category?: string | null
        }
        expiresAt: Date
        transferReference?: string | null
        createdAt?: Date
    }
    bankAccount: {
        accountName: string
        iban: string
        bic?: string | null
        bankName: string
    }
}

export default function PaymentModal({ isOpen, onClose, paymentRequest, bankAccount }: PaymentModalProps) {
    const [reference, setReference] = useState(paymentRequest.transferReference || '')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState('')

    if (!isOpen) return null

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(''), 2000)
    }

    const handleSaveReference = async () => {
        if (!reference.trim()) return

        setLoading(true)
        const result = await updateTransferReference(paymentRequest.id, reference)
        setLoading(false)

        if (result.success) {
            alert('Référence de virement sauvegardée avec succès!')
        } else {
            alert('Erreur lors de la sauvegarde')
        }
    }

    const expiresAt = paymentRequest.expiresAt
    const isExpired = expiresAt < new Date()

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="h-6 w-6" />
                                Informations de paiement
                            </h2>
                            <div className="mt-2 space-y-1">
                                <p className="text-gray-900 font-semibold">
                                    Service: <span className="text-primary">{paymentRequest.service.name}</span>
                                </p>
                                {paymentRequest.service.description && (
                                    <p className="text-sm text-gray-600">
                                        {paymentRequest.service.description}
                                    </p>
                                )}
                                {paymentRequest.service.category && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                                            {paymentRequest.service.category}
                                        </span>
                                    </p>
                                )}
                                {paymentRequest.createdAt && (
                                    <p className="text-xs text-gray-500">
                                        Demande créée le {new Date(paymentRequest.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {isExpired && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                                <Clock className="h-5 w-5" />
                                <span className="font-medium">Demande de paiement expirée</span>
                            </div>
                            <p className="text-red-600 mt-1">
                                Cette demande de paiement a expiré le {expiresAt.toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Récapitulatif */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                Récapitulatif de la commande
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Service</span>
                                    <span className="font-medium text-gray-900">{paymentRequest.service.name}</span>
                                </div>
                                {paymentRequest.service.category && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Catégorie</span>
                                        <span className="font-medium text-gray-900">{paymentRequest.service.category}</span>
                                    </div>
                                )}
                                <div className="border-t border-blue-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Montant total</span>
                                        <span className="text-3xl font-bold text-blue-600">
                                            {paymentRequest.amount.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations bancaires */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Informations bancaires
                            </h3>
                            
                            <div className="grid gap-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600">Nom du titulaire</div>
                                        <div className="font-medium">{bankAccount.accountName}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(bankAccount.accountName, 'name')}
                                    >
                                        {copied === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600">IBAN</div>
                                        <div className="font-mono font-medium break-all">{bankAccount.iban}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(bankAccount.iban, 'iban')}
                                    >
                                        {copied === 'iban' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>

                                {bankAccount.bic && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Code BIC/SWIFT</div>
                                            <div className="font-mono font-medium">{bankAccount.bic}</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(bankAccount.bic!, 'bic')}
                                        >
                                            {copied === 'bic' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                )}

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600">Banque</div>
                                        <div className="font-medium">{bankAccount.bankName}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(bankAccount.bankName, 'bank')}
                                    >
                                        {copied === 'bank' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div className="text-yellow-800">
                                    <h4 className="font-medium mb-2">Instructions importantes:</h4>
                                    <ul className="space-y-1 text-sm list-disc list-inside">
                                        <li>Effectuez le virement bancaire avec le montant exact</li>
                                        <li>Ajoutez votre référence de paiement ci-dessous après avoir effectué le virement</li>
                                        <li>Votre accès au service sera activé après vérification du paiement</li>
                                        <li>Cette demande expire le {expiresAt.toLocaleDateString('fr-FR')} à {expiresAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Référence de virement */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Référence de votre virement</h4>
                            <div className="flex gap-2">
                                <Input
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="Entrez la référence de votre virement bancaire"
                                    className="flex-1"
                                    disabled={isExpired}
                                />
                                <Button
                                    onClick={handleSaveReference}
                                    disabled={!reference.trim() || loading || isExpired}
                                    className="px-6"
                                >
                                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Cette référence nous aidera à identifier votre paiement plus rapidement
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={onClose}>
                                Fermer
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}