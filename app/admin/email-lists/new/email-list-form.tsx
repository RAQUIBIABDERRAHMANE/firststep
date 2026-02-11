'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createEmailList } from '@/app/actions/email-lists'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, Mail, Plus, X, Save } from 'lucide-react'

type Member = {
    userId?: string
    email?: string
    name?: string
}

export function EmailListForm({ initialData }: { initialData?: { name: string; description?: string; members: Member[] } }) {
    const router = useRouter()
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [activeTab, setActiveTab] = useState<'users' | 'custom'>('users')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [customEmails, setCustomEmails] = useState('')
    const [customName, setCustomName] = useState('')
    const [customMembers, setCustomMembers] = useState<Member[]>(initialData?.members?.filter(m => !m.userId) || [])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        // Fetch available users
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => setUsers(data.users || []))
            .catch(err => console.error('Failed to fetch users:', err))
    }, [])

    const handleAddCustomEmail = () => {
        const emails = customEmails.split(',').map(e => e.trim()).filter(e => e)
        const newMembers = emails.map(email => ({
            email,
            name: customName || email.split('@')[0]
        }))

        setCustomMembers([...customMembers, ...newMembers])
        setCustomEmails('')
        setCustomName('')
    }

    const handleRemoveCustomMember = (index: number) => {
        setCustomMembers(customMembers.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const members: Member[] = [
            ...selectedUsers.map(userId => ({ userId })),
            ...customMembers
        ]

        if (members.length === 0) {
            setError('Please add at least one member to the list')
            setLoading(false)
            return
        }

        const result = await createEmailList({ name, description, members })

        if ('error' in result) {
            setError(result.error as string)
            setLoading(false)
        } else {
            router.push('/admin/email-lists')
            router.refresh()
        }
    }

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalMembers = selectedUsers.length + customMembers.length

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>List Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            List Name *
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Newsletter Subscribers"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the purpose of this list..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Members ({totalMembers})
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border-b border-gray-200 mb-4">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('users')}
                                className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'users'
                                    ? 'border-purple-600 text-purple-600 font-medium'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                From Users ({selectedUsers.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('custom')}
                                className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'custom'
                                    ? 'border-purple-600 text-purple-600 font-medium'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Custom Emails ({customMembers.length})
                            </button>
                        </div>
                    </div>

                    {activeTab === 'users' ? (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div className="max-h-80 overflow-y-auto space-y-2">
                                {filteredUsers.map(user => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedUsers([...selectedUsers, user.id])
                                                } else {
                                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                                }
                                            }}
                                            className="h-4 w-4 text-purple-600 rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{user.companyName}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUsers(filteredUsers.map(u => u.id))}
                                >
                                    Select All
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUsers([])}
                                >
                                    Deselect All
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email Address(es)
                                    </label>
                                    <Input
                                        type="text"
                                        value={customEmails}
                                        onChange={(e) => setCustomEmails(e.target.value)}
                                        placeholder="email@example.com, another@example.com"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Separate multiple emails with commas
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Name <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder="Recipient name"
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddCustomEmail}
                                    disabled={!customEmails}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Email(s)
                                </Button>
                            </div>

                            {customMembers.length > 0 && (
                                <div className="border-t pt-4 space-y-2">
                                    <p className="text-sm font-medium">Added Emails:</p>
                                    {customMembers.map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-gray-600">{member.email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCustomMember(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={loading || totalMembers === 0}
                    className="flex-1"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Email List'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
