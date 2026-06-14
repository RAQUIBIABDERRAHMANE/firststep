'use client'

import { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/Button'
import { X, Camera } from 'lucide-react'

interface QRScannerProps {
    onScan: (data: string) => void
    onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [error, setError] = useState<string | null>(null)
    const isStoppingRef = useRef(false)

    useEffect(() => {
        let isComponentMounted = true;
        
        const startScanner = async () => {
            try {
                // Ensure DOM element is fully rendered before mounting
                await new Promise(resolve => setTimeout(resolve, 100))
                
                if (!isComponentMounted) return;

                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode('qr-reader')
                }

                await scannerRef.current.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        if (scannerRef.current && !isStoppingRef.current) {
                            isStoppingRef.current = true
                            const scanner = scannerRef.current
                            if (scanner.isScanning) {
                                scanner.stop().then(() => {
                                    try {
                                        scanner.clear()
                                    } catch (e) {}
                                    onScan(decodedText)
                                }).catch(() => {
                                    try {
                                        scanner.clear()
                                    } catch (e) {}
                                    onScan(decodedText)
                                })
                            } else {
                                try {
                                    scanner.clear()
                                } catch (e) {}
                                onScan(decodedText)
                            }
                        } else if (!scannerRef.current) {
                            onScan(decodedText)
                        }
                    },
                    (err) => {
                        // Ignored for performance
                    }
                )
            } catch (err) {
                console.error("Error starting scanner:", err)
                if (isComponentMounted) {
                    setError("Could not access the back camera. Please ensure you have granted camera permissions.")
                }
            }
        }

        startScanner()

        return () => {
            isComponentMounted = false;
            if (scannerRef.current && !isStoppingRef.current) {
                isStoppingRef.current = true;
                const scanner = scannerRef.current;
                if (scanner.isScanning) {
                    scanner.stop().then(() => {
                        try {
                            scanner.clear();
                        } catch (e) {}
                    }).catch(() => {
                        try {
                            scanner.clear();
                        } catch (e) {}
                    });
                } else {
                    try {
                        scanner.clear();
                    } catch (e) {}
                }
            }
        }
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

                    {error ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 mb-6 font-medium">
                            {error}
                        </div>
                    ) : (
                        <div
                            id="qr-reader"
                            className="overflow-hidden rounded-[2rem] border-4 border-slate-50 bg-slate-50"
                        ></div>
                    )}

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
