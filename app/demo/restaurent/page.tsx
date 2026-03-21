import RestaurantTemplate from '@/components/tenant/restaurant/RestaurantTemplate'
import { CartProvider } from '@/lib/contexts/CartContext'

export const metadata = {
  title: 'Démo FirstStep Resto',
  description: 'Découvrez la solution ultime pour la restauration au Maroc.',
}

export default function RestaurentDemoPage() {
    return (
        <CartProvider>
            <RestaurantTemplate
                siteName="FirstStep Resto"
                description="Le meilleur restaurant de la ville, commandez directement à votre table."
                coverImage="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070"
                logo=""
                config={{}}
                categories={[
                    { 
                        id: '1', 
                        name: 'Plats Signature', 
                        items: [
                            { id: 'i1', name: 'Burger Truffe Miel', description: 'Pain brioché, bœuf Angus, crème de truffe, confit doignons', price: 120, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', isAvailable: true },
                            { id: 'i2', name: 'Saumon Teriyaki', description: 'Pavé de saumon croustillant, sésame grillé et légumes croquants', price: 150, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', isAvailable: true }
                        ] 
                    },
                    { 
                        id: '2', 
                        name: 'Entrées', 
                        items: [
                            { id: 'i3', name: 'Salade César', description: 'Poulet grillé, sauce césar maison, croutons', price: 75, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', isAvailable: true },
                            { id: 'i4', name: 'Burrata Crémeuse', description: 'Tomates cerises confites, pesto et huile dolive', price: 95, image: 'https://images.unsplash.com/photo-1592455866164-94addb1641ba?w=500', isAvailable: true }
                        ] 
                    },
                    { 
                        id: '3', 
                        name: 'Desserts & Boissons', 
                        items: [
                            { id: 'i5', name: 'Tiramisu Pistache', description: 'Recette italienne revisitée à la pistache de bronte', price: 65, image: 'https://images.unsplash.com/photo-1571877227200-a08c8eb24b91?w=500', isAvailable: true },
                            { id: 'i6', name: 'Mojito Passion', description: 'Menthe fraîche, fruit de la passion', price: 55, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', isAvailable: true }
                        ] 
                    }
                ]}
                isOwner={false}
                designTemplate="modern"
                primaryColor="#f97316"
            />
        </CartProvider>
    )
}
