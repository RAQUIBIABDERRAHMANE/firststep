import { generateAnnouncementWithAI } from '../app/actions/announcements'

async function test() {
    console.log('Testing generateAnnouncementWithAI...')
    const res = await generateAnnouncementWithAI('Lancement de 30% de remise sur le module Restaurant pour le Ramadan')
    console.log('Result:', JSON.stringify(res, null, 2))
}

test().catch(console.error)
