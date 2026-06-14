import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import prisma from '../lib/prisma'
import { hashPassword } from '../lib/auth'

const bloggerJsonPath = 'C:/Users/Zouhair/.gemini/antigravity-ide/brain/f81c2b29-b3fd-40d8-b8d7-3c40a1ffa306/.system_generated/steps/47/content.md'

// Helper function to assign realistic Moroccan prices in MAD
function getEstimatedPrice(title: string, category: string): number {
    const t = title.toLowerCase();
    const c = category.toLowerCase();
    
    if (c.includes('sushi')) {
        return 65;
    } else if (c.includes('salée') || c.includes('salee')) {
        return 55;
    } else if (c.includes('cup')) {
        if (t.includes('dubai')) return 60;
        return 40;
    } else if (c.includes('fondant')) {
        return 45;
    } else if (c.includes('pancake')) {
        return 50;
    } else if (c.includes('gaufre') || c.includes('waffle')) {
        return 45;
    } else if (c.includes('crêpe') || c.includes('crepe')) {
        if (t.includes('kunafa')) return 55;
        return 45;
    } else if (c.includes('pastry') || c.includes('pastries')) {
        if (t.includes('kunafa')) return 65;
        return 50;
    } else if (c.includes('signature')) {
        if (t.includes('box')) return 120;
        if (t.includes('pizza')) return 75;
        if (t.includes('skillet') || t.includes('cookie')) return 55;
        return 50;
    }
    return 45; // Default fallback price
}

async function main() {
    console.log('Reading Blogger JSON content from step file...');
    if (!fs.existsSync(bloggerJsonPath)) {
        throw new Error(`Blogger content file not found at: ${bloggerJsonPath}`);
    }

    const fileContent = fs.readFileSync(bloggerJsonPath, 'utf-8');
    const lines = fileContent.split('\n');
    const jsonLine = lines.find(l => l.trim().startsWith('{"version"'));
    if (!jsonLine) {
        throw new Error('Could not find the JSON line in the content file.');
    }

    const bloggerData = JSON.parse(jsonLine);
    const entries = bloggerData.feed?.entry || [];
    console.log(`Parsed ${entries.length} entries from Blogger feed.`);

    console.log('Hashing password for account...');
    const email = 'contact@chocolatedipmaroc.com';
    const hashedPassword = await hashPassword('@@12chocolatedip');

    // 1. Create or Update User
    console.log(`Upserting user: ${email}...`);
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                companyName: 'Chocolate Dip',
                role: 'CLIENT',
            }
        });
        console.log('User account updated successfully.');
    } else {
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                companyName: 'Chocolate Dip',
                role: 'CLIENT',
            }
        });
        console.log('User account created successfully.');
    }

    // 2. Ensure Service exists
    const serviceSlug = 'restaurant-website';
    console.log(`Verifying service: ${serviceSlug}...`);
    let service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
    if (!service) {
        service = await prisma.service.create({
            data: {
                name: 'Restaurant Website & Online Ordering',
                slug: serviceSlug,
                status: 'AVAILABLE',
                category: 'restaurant',
            }
        });
        console.log('Restaurant Website service registered.');
    }

    // 3. Link User to Service
    console.log('Linking User to Service...');
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
    });

    // 4. Create/Update TenantWebsite
    const tenantSlug = 'chocolatedip';
    const configRaw = JSON.stringify({
        hasOrdering: true,
        hasWaiters: true,
        theme: 'modern',
        currency: 'MAD',
        contactEmail: email,
        contactPhone: '05 28 21 21 73 / 07 73 42 20 26',
        address: 'Agadir Bay, Agadir, Maroc',
        hours: 'Mon-Sun: 2:00 PM - 12:00 AM'
    });

    console.log(`Upserting TenantWebsite with slug: ${tenantSlug}...`);
    let tenant = await prisma.tenantWebsite.upsert({
        where: { slug: tenantSlug },
        update: {
            siteName: 'Chocolate Dip',
            description: 'Imaginez un lieu où chaque envie de chocolat se réalise. Bienvenue chez Chocolate Dip Agadir, l’adresse incontournable pour les amateurs de douceurs. Découvrez un menu alléchant où le chocolat est la star : crêpes fines, gaufres croustillantes ou pancakes moelleux, généreusement nappés de notre sélection de chocolats belges fondus.',
            logo: 'https://blogger.googleusercontent.com/img/a/AVvXsEg2jcfZ_EhLtIkAm77k01nODRRJ9qrBYeh2ozXNrWOsbwIM_4o22orDnA70cJTPmbkGTjMRPDtpaWRC9myzNf747IxSAHcesgi5BJUvf8kRJKvhdU8YwXw0pB4RdqX63fmGtn4fCycILj0m_in4EXELTEGYpbydykqbtfANcZOLd12rXBisNyXprk4Eba4=s853',
            coverImage: 'https://blogger.googleusercontent.com/img/a/AVvXsEh6YBUt5FHowFwB8GzNEfzYOe1K48p9Gj6cOdezKsJMIXCfPnN0iYf8jvZy80zm8-rr5Ztemq2Kq4gXXSr_AqsOaR9XR_57mOCCFf55T5yZ8JCgW5RKdaJ6F2bajMppQ4qe96ZD3kJ3arXe3BzTb5NbPBHT3I3Obqdo_PciIrVyJX04X8FQqKgD7XOG1W0=s1600',
            primaryColor: '#e27355',
            designTemplate: 'modern',
            userId: user.id,
            serviceId: service.id,
            config: configRaw
        },
        create: {
            slug: tenantSlug,
            siteName: 'Chocolate Dip',
            description: 'Imaginez un lieu où chaque envie de chocolat se réalise. Bienvenue chez Chocolate Dip Agadir, l’adresse incontournable pour les amateurs de douceurs. Découvrez un menu alléchant où le chocolat est la star : crêpes fines, gaufres croustillantes ou pancakes moelleux, généreusement nappés de notre sélection de chocolats belges fondus.',
            logo: 'https://blogger.googleusercontent.com/img/a/AVvXsEg2jcfZ_EhLtIkAm77k01nODRRJ9qrBYeh2ozXNrWOsbwIM_4o22orDnA70cJTPmbkGTjMRPDtpaWRC9myzNf747IxSAHcesgi5BJUvf8kRJKvhdU8YwXw0pB4RdqX63fmGtn4fCycILj0m_in4EXELTEGYpbydykqbtfANcZOLd12rXBisNyXprk4Eba4=s853',
            coverImage: 'https://blogger.googleusercontent.com/img/a/AVvXsEh6YBUt5FHowFwB8GzNEfzYOe1K48p9Gj6cOdezKsJMIXCfPnN0iYf8jvZy80zm8-rr5Ztemq2Kq4gXXSr_AqsOaR9XR_57mOCCFf55T5yZ8JCgW5RKdaJ6F2bajMppQ4qe96ZD3kJ3arXe3BzTb5NbPBHT3I3Obqdo_PciIrVyJX04X8FQqKgD7XOG1W0=s1600',
            primaryColor: '#e27355',
            designTemplate: 'modern',
            userId: user.id,
            serviceId: service.id,
            config: configRaw
        }
    });

    console.log('Cleaning up existing restaurant configuration for this tenant...');
    await prisma.restaurantCategory.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.restaurantTable.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.restaurantWaiter.deleteMany({ where: { tenantId: tenant.id } });

    // 5. Create Categories
    const categoryNames = [
        'Pancakes',
        'Gaufres',
        'crêpe',
        'Crêpes Salées',
        'Strawberry Cups',
        'Choco Sushi',
        'Les Fondants',
        'Signatures',
        'Sweet Pastry'
    ];

    console.log('Inserting categories and dishes...');
    const categoryMap = new Map<string, string>();

    for (let i = 0; i < categoryNames.length; i++) {
        const catName = categoryNames[i];
        // Display nice names in UI, keeping 'crêpe' -> 'Crêpes sucrées' or capitalize
        const displayName = catName === 'crêpe' ? 'Crêpes sucrées' : catName;
        const category = await prisma.restaurantCategory.create({
            data: {
                tenantId: tenant.id,
                name: displayName,
                order: i + 1,
                isActive: true
            }
        });
        categoryMap.set(catName, category.id);
        console.log(`Created category: ${displayName}`);
    }

    // 6. Parse and Insert Dishes from Blogger Feed
    let dishCount = 0;
    for (const entry of entries) {
        const title = entry.title?.$t || '';
        const cats: string[] = (entry.category || []).map((c: any) => c.term);
        if (cats.length === 0) continue;

        // Find matching category ID
        const matchedCatName = categoryNames.find(cName => cats.includes(cName));
        if (!matchedCatName) {
            console.log(`Skipping dish '${title}' as its categories [${cats.join(', ')}] are not in our list.`);
            continue;
        }

        const categoryId = categoryMap.get(matchedCatName)!;

        // Extract description
        const htmlContent = entry.content?.$t || '';
        let description = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        description = description.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        
        // If description starts with title, remove it
        if (description.toLowerCase().startsWith(title.toLowerCase())) {
            description = description.slice(title.length).trim();
            // clean any leading punctuation
            if (description.startsWith('.') || description.startsWith(',') || description.startsWith('-')) {
                description = description.slice(1).trim();
            }
        }

        // Get image URL
        let imageUrl = '';
        if (entry.media$thumbnail?.url) {
            imageUrl = entry.media$thumbnail.url.replace(/=s72-c/, '=s640');
        } else {
            const imgMatch = htmlContent.match(/src="([^"]+)"/);
            if (imgMatch) {
                imageUrl = imgMatch[1];
            }
        }

        const price = getEstimatedPrice(title, matchedCatName);

        await prisma.restaurantDish.create({
            data: {
                categoryId,
                name: title,
                description: description || null,
                price,
                image: imageUrl || null,
                isActive: true,
                order: dishCount + 1
            } as any
        });
        dishCount++;
        console.log(`Created dish: ${title} (${price} MAD) in category: ${matchedCatName}`);
    }

    console.log(`Successfully imported ${dishCount} dishes!`);

    // 7. Auto-generate tables
    console.log('Generating tables...');
    const tablesData = Array.from({ length: 8 }).map((_, i) => ({
        tenantId: tenant.id,
        number: `T${i + 1}`,
        capacity: i % 2 === 0 ? 4 : 2,
        isActive: true
    }));
    await prisma.restaurantTable.createMany({ data: tablesData });
    console.log('Tables generated successfully.');

    // 8. Auto-generate waiters
    console.log('Generating wait staff...');
    const waitersData = [
        { tenantId: tenant.id, name: 'Amine', pin: '1234' },
        { tenantId: tenant.id, name: 'Sara', pin: '5678' }
    ];
    await prisma.restaurantWaiter.createMany({ data: waitersData });
    console.log('Wait staff generated successfully.');

    console.log('\n=========================================');
    console.log('🎉 Seeding successfully completed!');
    console.log(`Slug: /${tenantSlug}`);
    console.log(`Email: ${email}`);
    console.log(`Password: @@12chocolatedip`);
    console.log('=========================================');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
