'use client'

import React, { Suspense } from 'react'
import RestaurantTemplateClassic from './RestaurantTemplateClassic'
import RestaurantTemplateModern from './RestaurantTemplateModern'
import RestaurantTemplateMinimal from './RestaurantTemplateMinimal'

export interface RestaurantTemplateProps {
    siteName: string
    description?: string | null
    coverImage?: string | null
    logo?: string | null
    config: any
    categories: any[]
    isOwner?: boolean
    designTemplate?: string
}

function RestaurantTemplateSwitcher(props: RestaurantTemplateProps) {
    const { designTemplate } = props

    switch (designTemplate) {
        case 'modern':
            return <RestaurantTemplateModern {...props} />
        case 'minimal':
            return <RestaurantTemplateMinimal {...props} />
        case 'classic':
        default:
            return <RestaurantTemplateClassic {...props} />
    }
}

export default function RestaurantTemplate(props: RestaurantTemplateProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse bg-white">Loading experience...</div>}>
            <RestaurantTemplateSwitcher {...props} />
        </Suspense>
    )
}
