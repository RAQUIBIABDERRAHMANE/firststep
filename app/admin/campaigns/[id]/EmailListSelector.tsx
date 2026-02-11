'use client'

import { useState, useEffect } from 'react'
import { updateCampaignEmailLists } from '@/app/actions/campaigns'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, ChevronDown, ChevronUp } from 'lucide-react'

type EmailList = {
    id: string
    name: string
    description: string | null
    _count: {
        members: number
    }
}

export function EmailListSelector({
    campaignId,
    initialSelectedListIds = []
}: {
    campaignId: string
    initialSelectedListIds: string[]
}) {
    const [isOpen, setIsOpen] = useState(initialSelectedListIds.length > 0)
    const [selectedListIds, setSelectedListIds] = useState<string[]>(initialSelectedListIds)
    const [emailLists, setEmailLists] = useState<EmailList[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/api/admin/email-lists')
            .then(res => res.json())
            .then(data => setEmailLists(data))
            .catch(err => console.error('Failed to fetch email lists:', err))
    }, [])

    const handleSave = async () => {
        setLoading(true)
        await updateCampaignEmailLists(campaignId, selectedListIds)
        setLoading(false)
    }

    const totalMembers = emailLists
        .filter(list => selectedListIds.includes(list.id))
        .reduce((sum, list) => sum + list._count.members, 0)

    if (!isOpen) {
        return (
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="font-medium">Email Lists</p>
                                {selectedListIds.length > 0 ? (
                                    <p className="text-sm text-gray-600">
                                        {selectedListIds.length} list(s) selected • {totalMembers} members
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        No lists selected
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(true)}
                        >
                            {selectedListIds.length > 0 ? 'Change Lists' : 'Select Lists'}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Select Email Lists
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {emailLists.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        No email lists available. Create one first.
                    </p>
                ) : (
                    <>
                        <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-2">
                            {emailLists.map(list => (
                                <label
                                    key={list.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedListIds.includes(list.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedListIds([...selectedListIds, list.id])
                                            } else {
                                                setSelectedListIds(selectedListIds.filter(id => id !== list.id))
                                            }
                                        }}
                                        className="mt-1 h-4 w-4 text-purple-600 rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{list.name}</p>
                                        {list.description && (
                                            <p className="text-sm text-gray-600">{list.description}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            {list._count.members} members
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-sm text-gray-600">
                                {selectedListIds.length} list(s) • {totalMembers} total members
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedListIds(emailLists.map(l => l.id))}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedListIds([])}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Selection'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
