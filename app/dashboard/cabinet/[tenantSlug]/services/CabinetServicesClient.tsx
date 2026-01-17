'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react'
import { saveCabinetService, deleteCabinetService } from '@/app/actions/cabinet'

type CabinetService = {
    id: string
    name: string
    description: string | null
    price: number
    duration: number
    isActive: boolean
}

export default function CabinetServicesClient({ services, tenantId, tenantSlug }: { services: CabinetService[], tenantId: string, tenantSlug: string }) {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<CabinetService | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
    })

    const handleEdit = (service: CabinetService) => {
        setEditingService(service)
        setFormData({
            name: service.name,
            description: service.description || '',
            price: service.price.toString(),
            duration: service.duration.toString(),
        })
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setEditingService(null)
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: '',
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await saveCabinetService({
            id: editingService?.id,
            tenantId: tenantId,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration: parseInt(formData.duration),
        }, tenantSlug)

        if (result.success) {
            setIsDialogOpen(false)
            router.refresh()
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const result = await deleteCabinetService(id, tenantSlug)
            if (result.success) {
                router.refresh()
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            <div className="flex justify-end">
                <Button onClick={handleNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Service
                </Button>
            </div>

            {/* Services Grid */}
            {services.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get started by adding your first service
                        </p>
                        <Button onClick={handleNew}>Add Your First Service</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {service.description || 'No description'}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={service.isActive ? 'success' : 'comingSoon'}>
                                        {service.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span>Price</span>
                                    </div>
                                    <span className="font-semibold">{service.price} DH</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Duration</span>
                                    </div>
                                    <span className="font-semibold">{service.duration} min</span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleEdit(service)}
                                    >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Simple Dialog Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                {editingService ? 'Edit Service' : 'New Service'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Service Name</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Price (DH)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full mt-1 px-3 py-2 border rounded-lg"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Duration (min)</label>
                                        <input
                                            type="number"
                                            className="w-full mt-1 px-3 py-2 border rounded-lg"
                                            value={formData.duration}
                                            onChange={(e) =>
                                                setFormData({ ...formData, duration: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingService ? 'Save Changes' : 'Create Service'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
