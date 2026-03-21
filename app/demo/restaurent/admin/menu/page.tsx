import MenuClient from '@/app/dashboard/restaurant/[tenantSlug]/menu/MenuClient'

export const metadata = { title: 'FirstStep - Admin Resto Menu' }

export default function MenuDemoPage() {
    const mockCategories = [
        {
            id: 'c1',
            name: 'Entrées & Tapas',
            isActive: true,
            dishes: [
                { id: 'd1', name: 'Planche de Charcuteries', description: 'Assortiment premium', price: 140, isActive: true, categoryId: 'c1' },
                { id: 'd2', name: 'Salade César', description: 'Poulet grillé, parmesan', price: 90, isActive: true, categoryId: 'c1' }
            ]
        },
        {
            id: 'c2',
            name: 'Plats Principaux',
            isActive: true,
            dishes: [
                { id: 'd3', name: 'Saumon Teriyaki', description: 'Riz basmati, sésame', price: 150, isActive: true, categoryId: 'c2' },
                { id: 'd4', name: 'Burger Truffe', description: 'Frites maison', price: 120, isActive: false, categoryId: 'c2' }
            ]
        }
    ]

    return (
        <MenuClient initialCategories={mockCategories} tenantSlug="demo-resto" />
    )
}
