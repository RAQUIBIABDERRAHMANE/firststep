'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { addUserService, removeUserService } from '@/app/actions/services'
import { Loader2 } from 'lucide-react'

type Service = {
    id: string
    name: string
    description: string | null
    status: string
    category: string | null
}

interface ServiceListProps {
    allServices: Service[]
    selectedServiceIds: string[]
}

export function ServiceList({ allServices, selectedServiceIds }: ServiceListProps) {
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()

    const handleToggleService = (serviceId: string, isSelected: boolean) => {
        setPendingIds(prev => new Set(prev).add(serviceId))

        startTransition(async () => {
            if (isSelected) {
                await removeUserService(serviceId)
            } else {
                await addUserService(serviceId)
            }
            setPendingIds(prev => {
                const next = new Set(prev)
                next.delete(serviceId)
                return next
            })
        })
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allServices.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id)
                const isActionPending = pendingIds.has(service.id) || isPending

                return (
                    <Card key={service.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{service.name}</CardTitle>
                                <Badge variant={service.status === 'AVAILABLE' ? 'success' : 'warning'}>
                                    {service.status === 'AVAILABLE' ? 'Available' : 'Coming Soon'}
                                </Badge>
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                variant={isSelected ? "outline" : "default"}
                                className="w-full"
                                onClick={() => handleToggleService(service.id, isSelected)}
                                disabled={isActionPending}
                            >
                                {isActionPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {isSelected ? 'Remove Service' : (service.status === 'AVAILABLE' ? 'Add Service' : 'Notify Me')}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
