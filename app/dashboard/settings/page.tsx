import { getCurrentUser } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function SettingsPage() {
    const user = await getCurrentUser()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your company profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
                            <Input defaultValue={user?.companyName || ''} name="companyName" disabled />
                            <p className="text-xs text-muted-foreground">Contact support to change your company name.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input defaultValue={user?.email || ''} disabled />
                            <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                        </div>
                        {/* 
                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div> 
                */}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
