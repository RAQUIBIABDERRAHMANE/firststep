'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Users, CheckSquare, Square } from 'lucide-react'

interface User {
    id: string
    email: string
    companyName: string
    createdAt: Date
}

interface RecipientSelectorProps {
    campaignId: string
    initialSelectedIds?: string[]
    onSave: (selectedIds: string[]) => Promise<void>
}

export function RecipientSelector({
    campaignId,
    initialSelectedIds = [],
    onSave,
}: RecipientSelectorProps) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds))
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Fetch all users
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('/api/admin/users')
                if (response.ok) {
                    const data = await response.json()
                    setUsers(data.users || [])
                }
            } catch (error) {
                console.error('Failed to fetch users:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users

        const query = searchQuery.toLowerCase()
        return users.filter(
            (user) =>
                user.email.toLowerCase().includes(query) ||
                user.companyName?.toLowerCase().includes(query)
        )
    }, [users, searchQuery])

    // Toggle individual user selection
    const toggleUser = (userId: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(userId)) {
            newSelected.delete(userId)
        } else {
            newSelected.add(userId)
        }
        setSelectedIds(newSelected)
    }

    // Select all filtered users
    const selectAll = () => {
        const newSelected = new Set(selectedIds)
        filteredUsers.forEach((user) => newSelected.add(user.id))
        setSelectedIds(newSelected)
    }

    // Deselect all filtered users
    const deselectAll = () => {
        const newSelected = new Set(selectedIds)
        filteredUsers.forEach((user) => newSelected.delete(user.id))
        setSelectedIds(newSelected)
    }

    // Save selections
    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(Array.from(selectedIds))
        } catch (error) {
            console.error('Failed to save selections:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const selectedCount = selectedIds.size

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Loading users...
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Select Recipients
                        </CardTitle>
                        <CardDescription>
                            {selectedCount} recipient{selectedCount !== 1 ? 's' : ''} selected
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={selectAll}
                            disabled={filteredUsers.length === 0}
                        >
                            Select All
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={deselectAll}
                            disabled={selectedCount === 0}
                        >
                            Deselect All
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by email or company name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* User List */}
                <div className="max-h-96 overflow-y-auto border rounded-md">
                    {filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            {searchQuery ? 'No users found matching your search' : 'No users available'}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredUsers.map((user) => {
                                const isSelected = selectedIds.has(user.id)
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => toggleUser(user.id)}
                                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
                                    >
                                        <div className="pt-0.5">
                                            {isSelected ? (
                                                <CheckSquare className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Square className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-foreground truncate">
                                                {user.email}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                                <span>{user.companyName || 'No company name'}</span>
                                                <span>•</span>
                                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || selectedCount === 0}
                    >
                        {isSaving ? 'Saving...' : `Save Selection (${selectedCount})`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
