import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm',
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-lg shadow-destructive/30",
                outline: "text-foreground border-border bg-background/50 backdrop-blur-sm hover:bg-background",
                success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 backdrop-blur-sm",
                warning: "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/10 backdrop-blur-sm",
                comingSoon: "border-primary/30 bg-primary/10 text-primary shadow-md shadow-primary/20 backdrop-blur-sm animate-pulse-glow",
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
