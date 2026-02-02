import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Globe, User, Calendar, ExternalLink, Mail, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function AdminWebsitesPage() {
    const websites = await prisma.tenantWebsite.findMany({
        include: {
            user: true,
            service: true,
            categories: {
                include: {
                    dishes: true
                }
            },
            tables: true,
            waiters: true,
            cabinetServices: true,
            cabinetClients: true,
            cabinetAppointments: true,
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Globe className="h-8 w-8" />
                    Sites web des utilisateurs
                </h1>
                <p className="text-gray-600 mt-2">
                    Gérez et consultez tous les sites web créés par les utilisateurs
                </p>
            </div>

            {websites.length === 0 ? (
                <Card className="p-8 text-center">
                    <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun site web
                    </h3>
                    <p className="text-gray-500">
                        Aucun utilisateur n&apos;a encore créé de site web
                    </p>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {websites.map((website) => (
                        <Card key={website.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {website.siteName}
                                        </h3>
                                        <Badge variant={website.isActive ? 'default' : 'secondary'}>
                                            {website.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                        <Badge variant="outline">
                                            {website.designTemplate}
                                        </Badge>
                                    </div>
                                    
                                    {website.description && (
                                        <p className="text-gray-600 mb-3">
                                            {website.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User className="h-4 w-4" />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {website.user.companyName}
                                                </div>
                                                <div className="text-xs">{website.user.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="h-4 w-4" />
                                            <span>{website.service.name}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Créé le {new Date(website.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Globe className="h-4 w-4" />
                                            <span className="font-mono text-xs">
                                                /{website.slug}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <span className="text-xs">{website.user.email}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-xs font-medium">Dernière MAJ:</span>
                                            <span className="text-xs">
                                                {new Date(website.updatedAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Config preview */}
                                    {website.config && website.config !== '{}' && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Configuration:
                                            </h4>
                                            <pre className="text-xs text-gray-600 overflow-x-auto">
                                                {JSON.stringify(JSON.parse(website.config), null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-6 flex flex-col gap-2">
                                    {website.isActive && (
                                        <Link
                                            href={`/${website.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="sm" variant="outline" className="w-full">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Visiter
                                            </Button>
                                        </Link>
                                    )}
                                    
                                    <Link href={`/admin/websites/${website.id}`}>
                                        <Button size="sm" variant="outline" className="w-full">
                                            Détails
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Stats section for restaurant/cabinet */}
                            {website.service.category === 'restaurant' && (
                                <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.categories.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Catégories</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.tables.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Tables</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.waiters.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Serveurs</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.categories.reduce((acc, cat) => acc + cat.dishes.length, 0)}
                                        </div>
                                        <div className="text-xs text-gray-500">Plats</div>
                                    </div>
                                </div>
                            )}

                            {website.service.category === 'professional-services' && (
                                <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.cabinetServices.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Services</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.cabinetClients.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Clients</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {website.cabinetAppointments.length}
                                        </div>
                                        <div className="text-xs text-gray-500">Rendez-vous</div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Statistics summary */}
            {websites.length > 0 && (
                <Card className="mt-8 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Statistiques globales
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {websites.length}
                            </div>
                            <div className="text-sm text-gray-600">Total sites</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {websites.filter(w => w.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">Sites actifs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600">
                                {websites.filter(w => !w.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">Sites inactifs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {new Set(websites.map(w => w.userId)).size}
                            </div>
                            <div className="text-sm text-gray-600">Utilisateurs</div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}