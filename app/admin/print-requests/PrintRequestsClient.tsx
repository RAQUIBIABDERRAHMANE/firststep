'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Printer, Check, QrCode, FileText, Globe, User, Clock, ArrowLeft } from 'lucide-react'
import { updatePrintRequestStatus } from '@/app/actions/admin'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface TableInfo {
    id: string
    number: string
    url: string
}

interface PrintRequest {
    id: string
    tenantId: string
    tableIds: string
    status: string
    createdAt: Date | string
    updatedAt: Date | string
    tenant: {
        id: string
        slug: string
        siteName: string
        user: {
            companyName: string
            email: string
        }
    }
    tablesInfo: TableInfo[]
}

export default function PrintRequestsClient({ initialRequests }: { initialRequests: any[] }) {
    const [requests, setRequests] = useState<PrintRequest[]>(initialRequests)
    const [printingRequest, setPrintingRequest] = useState<PrintRequest | null>(null)
    const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState<string | null>(null)

    // Pre-generate QR code images when a request is selected for printing
    useEffect(() => {
        if (!printingRequest) return

        const generateQRs = async () => {
            const codes: Record<string, string> = {}
            for (const table of printingRequest.tablesInfo) {
                try {
                    const dataUrl = await QRCode.toDataURL(table.url, {
                        width: 400,
                        margin: 2,
                        color: {
                            dark: '#0f172a', // slate-900
                            light: '#ffffff'
                        }
                    })
                    codes[table.id] = dataUrl
                } catch (e) {
                    console.error('Failed to generate QR for print', e)
                }
            }
            setQrCodes(codes)
        };
        generateQRs()
    }, [printingRequest])

    const handleMarkCompleted = async (id: string) => {
        setLoading(id)
        try {
            const res = await updatePrintRequestStatus(id, 'COMPLETED')
            if (res.error) toast.error(res.error)
            else {
                toast.success('Request marked as completed')
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r))
            }
        } catch (e) {
            toast.error('Failed to update status')
        } finally {
            setLoading(null)
        }
    }

    const handleTriggerPrint = (req: PrintRequest) => {
        setPrintingRequest(req)
        // Give time for state updates and image rendering, then trigger print
        setTimeout(() => {
            window.print()
        }, 1000)
    }

    if (printingRequest) {
        return (
            <div className="space-y-6">
                {/* Print Control Bar - Hidden during printing */}
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-2xl print:hidden">
                    <Button 
                        variant="ghost" 
                        onClick={() => { setPrintingRequest(null); setQrCodes({}); }}
                        className="rounded-xl flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Requests
                    </Button>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => window.print()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2"
                        >
                            <Printer size={16} /> Print Sheet
                        </Button>
                    </div>
                </div>

                <div className="text-center print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">Print Preview</h2>
                    <p className="text-sm text-slate-500">Only the cards below will be printed. Layout is optimized for paper.</p>
                </div>

                {/* Print area */}
                <div id="print-area" className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4">
                    {printingRequest.tablesInfo.map((table) => (
                        <div 
                            key={table.id}
                            className="border-4 border-double border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-between bg-white text-slate-900 w-[300px] h-[400px] mx-auto shadow-sm page-break-inside-avoid"
                            style={{ breakInside: 'avoid' }}
                        >
                            {/* Card Header */}
                            <div className="text-center space-y-1 w-full">
                                <h3 className="text-xl font-black tracking-tight text-slate-900">
                                    {printingRequest.tenant.siteName}
                                </h3>
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                    Scannez pour commander
                                </p>
                            </div>

                            {/* QR Code Container */}
                            <div className="h-44 w-44 flex items-center justify-center border-2 border-slate-100 rounded-2xl bg-white p-2">
                                {qrCodes[table.id] ? (
                                    <img src={qrCodes[table.id]} className="h-full w-full object-contain" alt={`Table ${table.number} QR`} />
                                ) : (
                                    <div className="h-20 w-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 animate-pulse">
                                        <QrCode size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Table Number Footer */}
                            <div className="text-center w-full">
                                <span className="inline-block px-6 py-2 bg-slate-900 text-white font-black text-lg rounded-2xl">
                                    TABLE {table.number}
                                </span>
                                <p className="text-[8px] text-slate-400 mt-2 font-mono">
                                    firststep.ma/{printingRequest.tenant.slug}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Print Styles Injection */}
                <style jsx global>{`
                    @media print {
                        /* Hide everything in the document */
                        body * {
                            visibility: hidden;
                        }
                        /* Show only the print area and its contents */
                        #print-area, #print-area * {
                            visibility: visible;
                        }
                        #print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            grid-template-columns: repeat(2, 1fr) !important;
                            gap: 40px !important;
                            background: white !important;
                        }
                        /* Custom page breaks */
                        .page-break-inside-avoid {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Printer className="text-indigo-600 h-7 w-7" />
                    Demandes d'impression QR
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Gérez et imprimez les codes QR des tables soumis par les gérants de restaurant.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold">
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Restaurant</th>
                                <th className="px-6 py-4 text-left">Gérant / Client</th>
                                <th className="px-6 py-4 text-left">Tables demandées</th>
                                <th className="px-6 py-4 text-left">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Clock size={13} className="text-slate-400" />
                                            {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <Globe size={15} className="text-indigo-500" />
                                            {req.tenant.siteName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                <User size={13} className="text-slate-400" />
                                                {req.tenant.user.companyName}
                                            </span>
                                            <span className="text-xs text-slate-400 pl-4.5">{req.tenant.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                                            {req.tablesInfo.map(t => (
                                                <Badge key={t.id} variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-bold px-2 py-0.5 text-[10px]">
                                                    T-{t.number}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={req.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-none hover:bg-amber-50' : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-none hover:bg-emerald-50'}>
                                            {req.status === 'PENDING' ? 'En attente' : 'Terminé'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleTriggerPrint(req)}
                                                className="rounded-xl h-9 px-3 text-xs font-bold border-slate-200 hover:border-indigo-400 hover:text-indigo-600 flex items-center gap-1.5"
                                            >
                                                <Printer size={13} /> Imprimer QRs
                                            </Button>
                                            {req.status === 'PENDING' && (
                                                <Button 
                                                    size="sm" 
                                                    disabled={loading === req.id}
                                                    onClick={() => handleMarkCompleted(req.id)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 px-3 text-xs font-bold flex items-center gap-1.5"
                                                >
                                                    <Check size={13} /> Marquer Terminé
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 text-slate-400 font-medium text-base">
                                        Aucune demande d'impression reçue
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
