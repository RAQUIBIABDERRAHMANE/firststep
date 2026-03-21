import CabinetTemplate from '@/components/tenant/cabinet/CabinetTemplate'

export const metadata = {
  title: 'Démo FirstStep Cabinet',
  description: 'La solution la plus élégante pour la gestion de cabinet médical au Maroc.',
}

export default function CabinetDemoPage() {
    return (
        <CabinetTemplate
            siteName="Démo Cabinet Médical"
            description="L'excellence médicale au service de votre santé. Prenez rendez-vous en ligne rapidement et facilement."
            coverImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053"
            logo=""
            config={{
                phone: "+212 600 00 00 00",
                email: "contact@cabinet-demo.ma",
                address: "Bd d'Anfa, Casablanca",
                businessHours: "Lun-Ven: 09:00 - 18:00"
            }}
            services={[
                { id: 's1', name: 'Consultation Générale', description: 'Diagnostic complet et accompagnement personnalisé', price: 300, duration: 30 },
                { id: 's2', name: 'Bilan de santé', description: 'Check-up intégral et analyses', price: 500, duration: 60 },
                { id: 's3', name: 'Suivi Spécialisé', description: 'Consultation de suivi pour pathologies spécifiques', price: 350, duration: 45 }
            ]}
            isOwner={false}
            designTemplate="modern"
            primaryColor="#10b981"
            tenantSlug="demo-cabinet"
        />
    )
}
