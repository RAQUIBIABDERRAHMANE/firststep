'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/Button'
import { X, Camera } from 'lucide-react'

interface QRScannerProps {
    onScan: (data: string) => void
    onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    useEffect(() => {
        // Timeout to ensure the DOM element is ready
        const timer = setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                'qr-reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            )

            scanner.render(
                (decodedText) => {
                    scanner.clear().then(() => {
                        onScan(decodedText)
                    }).catch(err => {
                        console.error('Failed to clear scanner', err)
                        onScan(decodedText)
                    })
                },
                (err) => {
                    // Ignored for performance
                }
            )

            return () => {
                scanner.clear().catch(err => {
                    // Sometimes clear fails if already cleared or not rendered
                })
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [onScan])

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-10 text-center">
                    <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-3xl text-primary">
                        <Camera size={28} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 tracking-tight">Identify Your Table</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Please scan the QR code located on your table to start ordering.
                    </p>

                    <div
                        id="qr-reader"
                        className="overflow-hidden rounded-[2rem] border-4 border-slate-50 bg-slate-50"
                    ></div>

                    <div className="mt-10">
                        <Button variant="outline" onClick={onClose} className="w-full h-14 rounded-2xl text-lg font-semibold">
                            Enter Table Manually
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
