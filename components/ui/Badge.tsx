import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm',
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30",
                secondary:
                    "border-transparent bg-blue-100 text-blue-700",
                destructive:
                    "border-transparent bg-gradient-to-r from-destructive to-red-600 text-white shadow-lg shadow-destructive/30",
                outline: "text-slate-700 border-slate-200 bg-white hover:bg-slate-50",
                success: "border-emerald-200 bg-emerald-50 text-emerald-700",
                warning: "border-amber-200 bg-amber-50 text-amber-700",
                comingSoon: "border-blue-200 bg-blue-50 text-blue-700",
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
