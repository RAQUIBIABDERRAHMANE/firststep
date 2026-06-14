import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import { uploadImage } from '@/lib/r2'

export const dynamic = 'force-dynamic'

const API_KEY = process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.replace(/^["']|["']$/g, '') : undefined

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'Google AI API key is not configured.' }, { status: 500 })
  }

  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages history.' }, { status: 400 })
    }

    // Format message history for Google Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    // System instruction to guide Gemini's behavior
    const systemInstruction = {
      parts: [
        {
          text: `You are an expert AI Marketing Assistant for FirstStep (a Moroccan B2B SaaS platform).
FirstStep provides three modular services:
1. Restaurant POS/Menu (dynamic digital menus, waiter portals, print requests).
2. Cabinet/Clinic Management (medical records, appointments).
3. Stock Management & Rentals.

Your role is to write premium, high-converting copy (marketing campaigns, SMS alerts, website landing copy, slogans) and help generate corresponding banner/service images.
Answer in French by default (or English if the user writes in English). Keep it professional, modern, and aligned with Moroccan business sensibilities.

CRITICAL INSTRUCTION FOR IMAGES:
If the user asks you to generate, create, draw, design, or show an image/banner/logo/photo, you must write the image prompt inside a special XML tag like this:
<generate_image>photorealistic high-quality image prompt here, specify style, aspect ratio, details</generate_image>
Place only ONE generate_image tag per response. Keep the prompt inside the tag in English for better image generator results.
Do not use markdown images yourself; just use the XML tag. The system will intercept this tag, generate the image using Google's Imagen model, upload it to Cloudflare R2, and convert it to a visible image link.`
        }
      ]
    }

    console.log('[Marketing AI] Sending chat history to Gemini...');
    
    // Call Gemini 2.5 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error('[Marketing AI] Gemini API error:', errText)
      return NextResponse.json({ error: 'Gemini API failed to generate response.' }, { status: 500 })
    }

    const geminiData = await geminiRes.json()
    let textResponse = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    console.log('[Marketing AI] Gemini response text:', textResponse)

    // Check if Gemini wants to generate an image
    const imageTagRegex = /<generate_image>([\s\S]*?)<\/generate_image>/i
    const match = textResponse.match(imageTagRegex)

    if (match) {
      const imagePrompt = match[1].trim()
      console.log(`[Marketing AI] Detected image generation prompt: "${imagePrompt}"`)

      try {
        console.log('[Marketing AI] Calling Imagen 4 API...')
        const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`
        const imagenRes = await fetch(imagenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [
              {
                prompt: imagePrompt
              }
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: '16:9',
              outputMimeType: 'image/jpeg'
            }
          })
        })

        if (imagenRes.ok) {
          const imagenData = await imagenRes.json()
          const base64Bytes = imagenData?.predictions?.[0]?.bytesBase64Encoded

          if (base64Bytes) {
            console.log('[Marketing AI] Image generated successfully! Converting bytes to buffer...')
            const buffer = Buffer.from(base64Bytes, 'base64')
            const filename = `marketing/img-${Date.now()}.jpg`
            
            console.log('[Marketing AI] Uploading generated image to Cloudflare R2...')
            const r2Url = await uploadImage(buffer, filename, 'image/jpeg')
            console.log(`[Marketing AI] Image stored in R2: ${r2Url}`)

            // Replace XML tag with markdown image link in the response
            textResponse = textResponse.replace(
              imageTagRegex,
              `\n\n![${imagePrompt}](${r2Url})\n\n*(Image générée avec Imagen 4.0 et stockée sur Cloudflare R2)*`
            )
          } else {
            console.warn('[Marketing AI] No image bytes returned in Imagen response.')
            textResponse = textResponse.replace(
              imageTagRegex,
              '\n\n*(Erreur : Aucun octet d\'image n\'a été renvoyé par le générateur)*'
            )
          }
        } else {
          const errText = await imagenRes.text()
          console.error('[Marketing AI] Imagen API failed:', errText)
          
          let friendlyError = 'l\'API Imagen a renvoyé une erreur'
          try {
            const errJson = JSON.parse(errText)
            if (errJson?.error?.message?.includes('paid plans') || errJson?.error?.message?.includes('upgrade your account')) {
              friendlyError = 'La génération d\'images Imagen requiert un compte Google AI Studio payant avec facturation activée'
            } else if (errJson?.error?.message) {
              friendlyError = errJson.error.message
            }
          } catch {}

          textResponse = textResponse.replace(
            imageTagRegex,
            `\n\n*(Échec de la génération d'image : ${friendlyError})*`
          )
        }
      } catch (imgErr) {
        console.error('[Marketing AI] Image generation exception:', imgErr)
        textResponse = textResponse.replace(
          imageTagRegex,
          '\n\n*(Échec de la génération d\'image en raison d\'une erreur de connexion)*'
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        role: 'model',
        content: textResponse
      }
    })

  } catch (error) {
    console.error('[Marketing AI] Chat error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
