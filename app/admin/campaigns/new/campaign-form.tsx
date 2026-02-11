'use client'

import { useActionState } from 'react'
import { createCampaign } from '@/app/actions/campaigns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { Save } from 'lucide-react'

// Define the state type based on the action's return type
type State = {
    message: string
}

const initialState: State = {
    message: '',
}

export function CampaignForm() {
    // useActionState matches the signature (prevState, formData) => Promise<State>
    const [state, formAction, isPending] = useActionState(createCampaign, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                </label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Important update regarding your service"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Content (HTML supported)
                </label>
                <textarea
                    id="content"
                    name="content"
                    className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your email content here..."
                    required
                />
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

            {state?.message && state.message !== 'Unauthorized' && (
                <div aria-live="polite" className="text-sm font-medium text-destructive">
                    {state.message}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Link href="/admin/campaigns">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Draft'}
                </Button>
            </div>
        </form>
    )
}
