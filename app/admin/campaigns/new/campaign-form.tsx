'use client'

import { useActionState, useState } from 'react'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { Save } from 'lucide-react'
import { RichTextEditor } from '@/components/editor/RichTextEditor'

// Define the state type based on the action's return type
type State = {
    message: string
}

const initialState: State = {
    message: '',
}

export function CampaignForm({ initialData }: { initialData?: any }) {
    // If initialData is present, we bind the id to the update action
    const action = initialData
        ? updateCampaign.bind(null, initialData.id)
        : createCampaign

    const [state, formAction, isPending] = useActionState(action, initialState)
    const [content, setContent] = useState(initialData?.content || '')
    const [attachments, setAttachments] = useState<Array<{ name: string, url: string }>>(
        initialData?.attachments ? JSON.parse(initialData.attachments) : []
    )
    const [uploading, setUploading] = useState(false)

    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formattedScheduledAt = initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
        : ''

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.success) {
                setAttachments([...attachments, { name: data.filename || file.name, url: data.url }])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
            if (e.target) e.target.value = ''
        }
    }

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="testRecipient" id="testRecipient" />

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                </label>
                <Input
                    id="subject"
                    name="subject"
                    defaultValue={initialData?.subject || ''}
                    placeholder="e.g., Important update regarding your service"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Content (HTML supported)
                </label>
                <RichTextEditor value={content} onChange={setContent} />
                <input type="hidden" name="content" value={content} />

                <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">Available Variables:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            <code className="text-primary font-mono">{'{{email}}'}</code>
                            <span className="text-muted-foreground">Recipient&apos;s email</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            <code className="text-primary font-mono">{'{{companyName}}'}</code>
                            <span className="text-muted-foreground">Company name</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            <code className="text-primary font-mono">{'{{name}}'}</code>
                            <span className="text-muted-foreground">Company name (alias)</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            <code className="text-primary font-mono">{'{{registrationDate}}'}</code>
                            <span className="text-muted-foreground">Registration date</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="flex items-center gap-2">
                    <Input type="file" onChange={handleFileChange} disabled={uploading} className="max-w-[300px]" />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                {attachments.length > 0 && (
                    <ul className="space-y-1 mt-2">
                        {attachments.map((file, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                                <span className="truncate flex-1">{file.name}</span>
                                <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
                <input type="hidden" name="attachments" value={JSON.stringify(attachments)} />
            </div>

            <div className="space-y-2">
                <label htmlFor="scheduledAt" className="text-sm font-medium">Schedule for (Optional)</label>
                <Input
                    type="datetime-local"
                    name="scheduledAt"
                    id="scheduledAt"
                    className="max-w-[300px]"
                    defaultValue={formattedScheduledAt}
                />
                <p className="text-xs text-gray-500">Leave blank to send immediately / save as draft.</p>
            </div>

            {state?.message && state.message !== 'Unauthorized' && (
                <div aria-live="polite" className="text-sm font-medium text-destructive">
                    {state.message}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Button
                    type="submit"
                    name="action"
                    value="test"
                    variant="outline"
                    onClick={(e) => {
                        const email = prompt('Enter test email address:');
                        if (!email) {
                            e.preventDefault();
                            return;
                        }
                        const input = document.getElementById('testRecipient') as HTMLInputElement;
                        if (input) input.value = email;
                    }}
                >
                    Send Test
                </Button>
                <Link href="/admin/campaigns">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? 'Saving...' : (initialData ? 'Update Campaign' : 'Save Draft')}
                </Button>
            </div>
        </form>
    )
}
