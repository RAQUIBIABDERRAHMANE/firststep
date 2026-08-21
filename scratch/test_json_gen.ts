import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

async function testJsonGeneration() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const systemPrompt = `Tu es un expert copywriter et responsable marketing pour FirstStep (firststepco.com), une plateforme SaaS B2B au Maroc (restaurants, cliniques, commerces, entreprises).
Ta mission est de générer une annonce percutante, concise et attractive pour la barre d'annonce e-commerce et la landing page.

Réponds UNIQUEMENT avec un objet JSON valide ayant la structure suivante :
{
  "title": "Titre court et impactant (max 50 caractères)",
  "content": "Description vendeuse et concise en français (1 ou 2 phrases max, max 130 caractères)",
  "badge": "Un mot ou deux (ex: Nouveau, Promo -30%, Offre Flash, Mise à jour, Exclusivité)",
  "badgeColor": "Une couleur parmi : blue, emerald, amber, purple, rose, cyan",
  "linkUrl": "Lien de redirection (ex: #signup, /services, #services, /services/restaurant)",
  "linkLabel": "Texte du bouton d'action (ex: Découvrir, Profiter de l'offre, En savoir plus)"
}`

    for (const model of ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b']) {
        try {
            console.log(`Trying ${model}...`)
            const completion = await groq.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 'Génère les données d\'annonce pour cette idée : "Réduction de 30% sur le module restaurant pour le ramadan"' }
                ],
                response_format: { type: 'json_object' }
            })
            const raw = completion.choices[0]?.message?.content
            console.log(`✅ Success with ${model}! Raw output:`, raw)
            return model
        } catch (e: any) {
            console.log(`❌ ${model} failed:`, e?.message)
        }
    }
}

testJsonGeneration()
