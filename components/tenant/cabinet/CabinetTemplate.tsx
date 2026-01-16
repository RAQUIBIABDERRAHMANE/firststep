'use client'

import React, { Suspense } from 'react'
import CabinetTemplateClassic, { CabinetTemplateProps } from './CabinetTemplateClassic'
import CabinetTemplateModern from './CabinetTemplateModern'
import CabinetTemplateExecutive from './CabinetTemplateExecutive'

export interface CabinetTemplateMainProps extends CabinetTemplateProps {
    designTemplate?: string
}

function CabinetTemplateSwitcher(props: CabinetTemplateMainProps) {
    const { designTemplate } = props

    switch (designTemplate) {
        case 'modern':
            return <CabinetTemplateModern {...props} />
        case 'executive':
        case 'minimal': // Backward compatibility
            return <CabinetTemplateExecutive {...props} />
        case 'classic':
        default:
            return <CabinetTemplateClassic {...props} />
    }
}

export default function CabinetTemplate(props: CabinetTemplateMainProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 animate-pulse border-2 border-primary/20" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
                        Loading Professional Space...
                    </span>
                </div>
            </div>
        }>
            <CabinetTemplateSwitcher {...props} />
        </Suspense>
    )
}
