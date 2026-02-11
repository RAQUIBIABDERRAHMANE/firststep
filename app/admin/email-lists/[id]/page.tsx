import { getCurrentUser } from '@/app/actions/auth'
import { getEmailList } from '@/app/actions/email-lists'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, User, ChevronLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { removeMemberFromList } from '@/app/actions/email-lists'

export default async function EmailListDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const result = await getEmailList(id)

    if ('error' in result) {
        notFound()
    }

    const list = result.list!

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto p-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/email-lists">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {list.name}
                    </h1>
                    {list.description && (
                        <p className="text-gray-600 mt-2">{list.description}</p>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Members ({list.members.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {list.members.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No members in this list yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {list.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            {member.user ? (
                                                <>
                                                    <p className="font-medium">{member.user.companyName}</p>
                                                    <p className="text-sm text-gray-600">{member.user.email}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                        Registered User
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium">{member.name || member.email}</p>
                                                    <p className="text-sm text-gray-600">{member.email}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                        Custom Email
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <form action={async () => {
                                        'use server'
                                        await removeMemberFromList(list.id, member.id)
                                    }}>
                                        <Button variant="ghost" size="sm" type="submit">
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
                <Link href="/admin/email-lists">
                    <Button variant="outline">
                        Back to Lists
                    </Button>
                </Link>
            </div>
        </div>
    )
}
