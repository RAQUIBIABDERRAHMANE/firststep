'use client'

import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        let phi = 0
        let width = 0
        let currentPhi = 0
        let currentTheta = 0
        const doublePi = Math.PI * 2
        
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth
            }
        }
        window.addEventListener('resize', onResize)
        onResize()

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [3/255, 7/255, 18/255],
            markerColor: [0, 102/255, 1], // Brand Blue
            glowColor: [0, 102/255, 1], // Brand Blue glow
            opacity: 1,
            markers: [
                // Morocco
                { location: [31.7917, -7.0926], size: 0.1 },
            ],
            onRender: (state) => {
                state.phi = phi
                phi += 0.003
                state.width = width * 2
                state.height = width * 2
            },
        })

        return () => {
            globe.destroy()
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div className="w-full h-full max-w-[800px] max-h-[800px] mx-auto aspect-square relative flex items-center justify-center">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    animation: 'fadeIn 1s ease forwards',
                }}
            />
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    )
}
