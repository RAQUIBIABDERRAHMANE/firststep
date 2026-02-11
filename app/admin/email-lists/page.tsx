import { getCurrentUser } from '@/app/actions/auth'
import { getEmailLists } from '@/app/actions/email-lists'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Mail, Users, Trash2, Edit, ChevronRight } from 'lucide-react'
import { deleteEmailList } from '@/app/actions/email-lists'

export default async function EmailListsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const result = await getEmailLists()

    if ('error' in result) {
        return (
            <div className="p-8">
                <p className="text-red-600">Error: {result.error}</p>
            </div>
        )
    }

    const lists = result.lists || []

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Email Lists
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Create and manage reusable email lists for your campaigns
                    </p>
                </div>

                <Link href="/admin/email-lists/new">
                    <Button className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New List
                    </Button>
                </Link>
            </div>

            {lists.length === 0 ? (
                <Card className="text-center p-12">
                    <CardContent>
                        <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No email lists yet</h2>
                        <p className="text-gray-600 mb-6">
                            Create your first email list to organize recipients for your campaigns
                        </p>
                        <Link href="/admin/email-lists/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First List
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lists.map((list) => (
                        <Card key={list.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{list.name}</CardTitle>
                                        {list.description && (
                                            <CardDescription className="mt-1">
                                                {list.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{list._count.members} members</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/email-lists/${list.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteEmailList(list.id)
                                        }}>
                                            <Button variant="ghost" size="sm" type="submit">
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>

                                <Link href={`/admin/email-lists/${list.id}`} className="block mt-4">
                                    <Button variant="outline" className="w-full" size="sm">
                                        View Details
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex justify-center pt-4">
                <Link href="/admin/campaigns">
                    <Button variant="outline">
                        Back to Campaigns
                    </Button>
                </Link>
            </div>
        </div>
    )
}
