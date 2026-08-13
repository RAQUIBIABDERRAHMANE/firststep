import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
    {
        variants: {
            variant: {
                default: "bg-[#0066FF] text-white shadow-md shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 font-syne font-bold",
                destructive: "bg-red-600 text-white shadow-md hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 font-syne font-bold",
                outline: "border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-medium hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
                secondary: "bg-blue-50 text-[#0066FF] font-semibold shadow-sm hover:bg-blue-100 hover:-translate-y-0.5 active:translate-y-0",
                ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                link: "text-[#0066FF] underline-offset-4 hover:underline",
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
