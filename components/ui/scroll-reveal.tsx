'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    delay?: number; // ms
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = 'up',
    ...props
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    const directionClasses = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
        scale: 'scale-95',
    };

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[transform,opacity]',
                isRevealed
                    ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
                    : `opacity-0 ${directionClasses[direction]}`,
                className
            )}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            {...props}
        >
            {children}
        </div>
    );
}
