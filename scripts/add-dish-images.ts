import 'dotenv/config'
import prisma from '../lib/prisma'

const imagesMap: Record<string, string> = {
    'Classic Smash Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    'Chicken Crispy': 'https://images.unsplash.com/photo-1615887023516-9dcafcb7ae16?q=80&w=800&auto=format&fit=crop',
    'Truffle Mushroom': 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
    'Margherita Authentique': 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?q=80&w=800&auto=format&fit=crop',
    'Quatre Fromages': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    'Diavola': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop',
    'Salade César': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop',
    'Salade Quinoa & Avocat': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'Tiramisu Classique': 'https://images.unsplash.com/photo-1571115177098-24deebaf1ff1?q=80&w=800&auto=format&fit=crop',
    'Cheesecake New-Yorkais': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
    'Fondant au Chocolat': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    'Coca-Cola (33cl)': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    'Limonade Maison': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    'Eau Minérale (50cl)': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop'
}

async function main() {
    console.log('Adding images to marketing account menu...')

    const tenantSlug = 'firststep'
    const tenant = await prisma.tenantWebsite.findUnique({
        where: { slug: tenantSlug },
        include: {
            categories: {
                include: { dishes: true }
            }
        }
    })

    if (!tenant) {
        console.error('Tenant not found!')
        process.exit(1)
    }

    let updatedCount = 0;
    
    for (const category of tenant.categories) {
        for (const dish of category.dishes) {
            const imageUrl = imagesMap[dish.name]
            if (imageUrl) {
                await prisma.restaurantDish.update({
                    where: { id: dish.id },
                    data: { image: imageUrl }
                })
                updatedCount++;
                console.log(`Updated [${dish.name}] with image.`)
            }
        }
    }

    console.log(`✅ Menu images updated successfully for ${updatedCount} items!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
