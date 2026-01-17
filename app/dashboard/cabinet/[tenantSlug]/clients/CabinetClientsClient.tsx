'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Mail, Phone, FileText, Calendar } from 'lucide-react'
import { saveCabinetClient } from '@/app/actions/cabinet'

type CabinetClient = {
    id: string
    name: string
    email: string | null
    phone: string | null
    notes: string | null
    createdAt: Date
    appointments: any[]
}

export default function CabinetClientsClient({ clients, tenantId, tenantSlug }: { clients: CabinetClient[], tenantId: string, tenantSlug: string }) {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<CabinetClient | null>(null)
    const [selectedClient, setSelectedClient] = useState<CabinetClient | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    })

    const handleEdit = (client: CabinetClient) => {
        setEditingClient(client)
        setFormData({
            name: client.name,
            email: client.email || '',
            phone: client.phone || '',
            notes: client.notes || '',
        })
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setEditingClient(null)
        setFormData({
            name: '',
            email: '',
            phone: '',
            notes: '',
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await saveCabinetClient({
            id: editingClient?.id,
            tenantId: tenantId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
        }, tenantSlug)

        if (result.success) {
            setIsDialogOpen(false)
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            <div className="flex justify-end">
                <Button onClick={handleNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Client
                </Button>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add your first client to get started
                        </p>
                        <Button onClick={handleNew}>Add Your First Client</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {clients.map((client) => (
                        <Card key={client.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{client.name}</CardTitle>
                                        <div className="flex gap-4 mt-2">
                                            {client.email && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(client)}
                                    >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {client.notes && (
                                    <div className="flex gap-2 text-sm">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <p className="text-muted-foreground">{client.notes}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {client.appointments.length} appointment
                                        {client.appointments.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                {editingClient ? 'Edit Client' : 'New Client'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Full Name</label>
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
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Notes</label>
                                    <textarea
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                        placeholder="Medical history, preferences, etc."
                                    />
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
                                        {editingClient ? 'Save Changes' : 'Add Client'}
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
