import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ServiceDownPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="max-w-2xl w-full shadow-lg">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">Service Temporairement Indisponible</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-lg text-slate-600">
                        Ce service a été suspendu ou désactivé.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-xl text-slate-900">Contactez FirstStep</h3>
                        <p className="text-slate-600">
                            Pour toute question ou pour réactiver ce service, veuillez nous contacter :
                        </p>
                        
                        <div className="space-y-3 pt-2">
                            <a 
                                href="mailto:support@firststep.com" 
                                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">support@firststep.com</span>
                            </a>
                            
                            <a 
                                href="tel:+212123456789" 
                                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">+212 1 23 45 67 89</span>
                            </a>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/">
                            <Button variant="default" className="w-full sm:w-auto">
                                Retour à l&apos;accueil FirstStep
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
