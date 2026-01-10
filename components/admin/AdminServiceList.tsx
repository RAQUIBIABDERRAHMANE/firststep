'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toggleServiceStatus } from '@/app/actions/admin'
import { Loader2, RefreshCw } from 'lucide-react'

type Service = {
    id: string
    name: string
    description: string | null
    status: string
    category: string | null
}

interface AdminServiceListProps {
    initialServices: Service[]
}

export function AdminServiceList({ initialServices }: AdminServiceListProps) {
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleToggleStatus = (serviceId: string) => {
        setPendingId(serviceId)
        startTransition(async () => {
            await toggleServiceStatus(serviceId)
            setPendingId(null)
        })
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {initialServices.map((service) => {
                const isActionPending = pendingId === service.id

                return (
                    <Card key={service.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{service.name}</CardTitle>
                                <Badge variant={service.status === 'AVAILABLE' ? 'success' : 'warning'}>
                                    {service.status === 'AVAILABLE' ? 'Live' : 'Coming Soon'}
                                </Badge>
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleToggleStatus(service.id)}
                                disabled={isActionPending}
                            >
                                {isActionPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                )}
                                Switch to {service.status === 'AVAILABLE' ? 'Coming Soon' : 'Available'}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
