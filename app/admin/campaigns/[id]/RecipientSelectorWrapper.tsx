'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Users } from 'lucide-react'
import { RecipientSelector } from './RecipientSelector'
import { updateCampaignRecipients } from '@/app/actions/campaigns'

interface RecipientSelectorWrapperProps {
    campaignId: string
    initialSelectedIds: string[]
}

export function RecipientSelectorWrapper({
    campaignId,
    initialSelectedIds,
}: RecipientSelectorWrapperProps) {
    const [showSelector, setShowSelector] = useState(false)
    const [selectedCount, setSelectedCount] = useState(initialSelectedIds.length)

    const handleSave = async (selectedIds: string[]) => {
        try {
            await updateCampaignRecipients(campaignId, selectedIds)
            setSelectedCount(selectedIds.length)
            setShowSelector(false)
        } catch (error) {
            console.error('Failed to save recipients:', error)
        }
    }

    return (
        <div className="space-y-4">
            {!showSelector ? (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-medium text-sm">Recipients</p>
                            <p className="text-xs text-muted-foreground">
                                {selectedCount > 0
                                    ? `${selectedCount} recipient${selectedCount !== 1 ? 's' : ''} selected`
                                    : 'No recipients selected'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowSelector(true)}>
                        {selectedCount > 0 ? 'Change Selection' : 'Select Recipients'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <RecipientSelector
                        campaignId={campaignId}
                        initialSelectedIds={initialSelectedIds}
                        onSave={handleSave}
                    />
                    <Button type="button" variant="ghost" onClick={() => setShowSelector(false)}>
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    )
}
