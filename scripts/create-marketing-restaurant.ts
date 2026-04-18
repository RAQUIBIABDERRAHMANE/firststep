import 'dotenv/config'
import prisma from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function main() {
    console.log('Creating marketing fake account...')

    const email = 'sales@firststepco.com'
    const password = await hashPassword('@@12firststep')
    
    // 1. Ensure User exists or upsert
    let user = await prisma.user.findUnique({ where: { email } })
    if (user) {
        user = await prisma.user.update({
            where: { email },
            data: {
                password,
                companyName: 'firststep',
                role: 'CLIENT',
            }
        })
        console.log('User was updated:', user.email)
    } else {
        user = await prisma.user.create({
            data: {
                email,
                password,
                companyName: 'firststep',
                role: 'CLIENT',
            }
        })
        console.log('User created:', user.email)
    }

    // 2. Ensure Service exists
    const serviceSlug = 'restaurant-website'
    let service = await prisma.service.findUnique({ where: { slug: serviceSlug } })
    if (!service) {
        service = await prisma.service.create({
            data: {
                name: 'Restaurant Website & Online Ordering',
                slug: serviceSlug,
                status: 'AVAILABLE',
                category: 'restaurant',
            }
        })
    }

    // 3. Link User to Service
    await prisma.userService.upsert({
        where: {
            userId_serviceId: {
                userId: user.id,
                serviceId: service.id
            }
        },
        update: {
            isActive: true
        },
        create: {
            userId: user.id,
            serviceId: service.id,
            isActive: true,
            notify: true
        }
    })
    console.log('User linked to Service successfully!')

    // 4. Create or Update TenantWebsite
    const tenantSlug = 'firststep'
    const configRaw = JSON.stringify({ 
        hasOrdering: true, 
        hasWaiters: true, 
        theme: 'modern', 
        currency: 'MAD',
        contactEmail: 'contact@firststepco.com',
        contactPhone: '+212 600 000000',
        address: '123 Avenue Hassan II, Casablanca' 
    })

    let tenant = await prisma.tenantWebsite.upsert({
        where: { slug: tenantSlug },
        update: {
            siteName: 'FirstStep Restaurant',
            description: 'Bienvenue chez FirstStep Restaurant, où la qualité rencontre le goût. Goûtez la différence !',
            primaryColor: '#0ea5e9',
            designTemplate: 'modern',
            userId: user.id,
            serviceId: service.id,
            config: configRaw
        },
        create: {
            slug: tenantSlug,
            userId: user.id,
            serviceId: service.id,
            siteName: 'FirstStep Restaurant',
            description: 'Bienvenue chez FirstStep Restaurant, où la qualité rencontre le goût. Goûtez la différence !',
            primaryColor: '#0ea5e9',
            designTemplate: 'modern',
            config: configRaw
        }
    })
    console.log('TenantWebsite created/updated:', tenant.slug)

    // 5. Cleanup existing data to avoid duplicates on re-run
    await prisma.restaurantCategory.deleteMany({ where: { tenantId: tenant.id } })
    await prisma.restaurantTable.deleteMany({ where: { tenantId: tenant.id } })
    await prisma.restaurantWaiter.deleteMany({ where: { tenantId: tenant.id } })

    // 6. Create Fake Data
    const categoriesData = [
        { name: 'Burgers 🍔', order: 1 },
        { name: 'Pizzas 🍕', order: 2 },
        { name: 'Salades 🥗', order: 3 },
        { name: 'Desserts 🍰', order: 4 },
        { name: 'Boissons 🥤', order: 5 }
    ]

    console.log('Creating categories and dishes...')
    for (const cat of categoriesData) {
        const category = await prisma.restaurantCategory.create({
            data: {
                tenantId: tenant.id,
                name: cat.name,
                order: cat.order,
                isActive: true
            }
        })

        // Add dishes according to category
        if (cat.name.includes('Burgers')) {
            await prisma.restaurantDish.createMany({
                data: [
                    { categoryId: category.id, name: 'Classic Smash Burger', description: 'Pain brioché, 2 steaks hachés façon smash, double cheddar, oignons caramélisés, sauce secrète.', price: 65 },
                    { categoryId: category.id, name: 'Chicken Crispy', description: 'Filet de poulet croustillant, salade iceberg, tomates, sauce mayonnaise légèrement épicée.', price: 55 },
                    { categoryId: category.id, name: 'Truffle Mushroom', description: 'Steak haché de bœuf, champignons sautés, fromage suisse, mayonnaise à la truffe.', price: 85 }
                ]
            })
        } else if (cat.name.includes('Pizzas')) {
            await prisma.restaurantDish.createMany({
                data: [
                    { categoryId: category.id, name: 'Margherita Authentique', description: 'Sauce tomate maison, mozzarella fior di latte, basilic frais, huile d\'olive extra vierge.', price: 45 },
                    { categoryId: category.id, name: 'Quatre Fromages', description: 'Crème fraîche, mozzarella, gorgonzola, chèvre, parmigiano reggiano.', price: 75 },
                    { categoryId: category.id, name: 'Diavola', description: 'Sauce tomate, mozzarella, pepperoni piquant, flocons de piment, miel piquant.', price: 65 }
                ]
            })
        } else if (cat.name.includes('Salades')) {
            await prisma.restaurantDish.createMany({
                data: [
                    { categoryId: category.id, name: 'Salade César', description: 'Laitue romaine, poulet grillé, croûtons à l\'ail, parmesan, sauce césar maison.', price: 50 },
                    { categoryId: category.id, name: 'Salade Quinoa & Avocat', description: 'Quinoa BIO, avocat, tomates cerises, concombre, vinaigrette au citron et huile d\'olive.', price: 45 }
                ]
            })
        } else if (cat.name.includes('Desserts')) {
            await prisma.restaurantDish.createMany({
                data: [
                    { categoryId: category.id, name: 'Tiramisu Classique', description: 'Savoiardi imbibés de café espresso, crème mascarpone onctueuse, cacao amer.', price: 35 },
                    { categoryId: category.id, name: 'Cheesecake New-Yorkais', description: 'Véritable cheesecake cuit au four, coulis de fruits rouges.', price: 40 },
                    { categoryId: category.id, name: 'Fondant au Chocolat', description: 'Cœur coulant chocolat noir 70%, boule de glace vanille.', price: 45 }
                ]
            })
        } else if (cat.name.includes('Boissons')) {
            await prisma.restaurantDish.createMany({
                data: [
                    { categoryId: category.id, name: 'Coca-Cola (33cl)', description: 'Canette bien fraîche.', price: 15 },
                    { categoryId: category.id, name: 'Limonade Maison', description: 'Citrons frais pressés, menthe, sucre de canne, glace pilée.', price: 25 },
                    { categoryId: category.id, name: 'Eau Minérale (50cl)', description: '', price: 10 }
                ]
            })
        }
    }

    console.log('Creating tables...')
    const tablesData = Array.from({ length: 8 }).map((_, i) => ({
        tenantId: tenant.id,
        number: `T${i + 1}`,
        capacity: i % 2 === 0 ? 4 : 2,
        isActive: true
    }))
    await prisma.restaurantTable.createMany({ data: tablesData })

    console.log('Creating wait staff...')
    const waitersData = [
        { tenantId: tenant.id, name: 'Amine', pin: '1234' },
        { tenantId: tenant.id, name: 'Sara', pin: '5678' }
    ]
    await prisma.restaurantWaiter.createMany({ data: waitersData })

    console.log('✅ Fake account created successfully!')
    console.log(`URL de la page publique: /${tenantSlug}`)
    console.log(`Email de connexion: ${email}`)
    console.log(`Mot de passe: @@12firststep`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
