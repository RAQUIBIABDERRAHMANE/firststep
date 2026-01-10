import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-100 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
                destructive:
                    "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-lg shadow-destructive/30 hover:shadow-xl hover:shadow-destructive/40 hover:scale-105 active:scale-100",
                outline:
                    "border-2 border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary hover:scale-105 active:scale-100 text-foreground",
                secondary:
                    "bg-secondary/80 text-secondary-foreground shadow-md hover:bg-secondary hover:shadow-lg hover:scale-105 active:scale-100",
                ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:scale-105 active:scale-100",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: 'h-11 px-6 py-2',
                sm: 'h-9 rounded-lg px-4 text-xs',
                lg: 'h-14 rounded-xl px-10 text-base',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
