'use server'

import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export async function improveEmailPrompt(prompt: string, subject?: string) {
    try {
        const systemPrompt = `You are an expert email marketing strategist for FirstStep (firststepco.com), a B2B SaaS platform serving professionals (doctors, clinics, restaurants).
Your job is to rewrite and improve a user's rough email prompt into a detailed, structured brief that guides an AI to generate a high-converting, on-brand email.
The improved prompt should:
- Clarify the goal, tone (professional yet warm), and target audience (FirstStep clients)
- Add persuasive elements: benefits, urgency, social proof, brand authority
- Suggest where to use variables: {{companyName}}, {{email}}, {{name}}, {{registrationDate}}
- Specify the CTA clearly (e.g. "link to dashboard at https://firststepco.com/dashboard")
- Mention that the email must include the FirstStep logo and use brand color #2563eb for buttons
- Be written as a clear instruction paragraph (NOT as the email itself)
- Stay in the same language as the input
Return ONLY the improved prompt text, no explanation.`

        const userPrompt = subject
            ? `Subject: "${subject}"\n\nOriginal prompt: ${prompt}`
            : `Original prompt: ${prompt}`

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.1-8b-instant',
        })

        const content = chatCompletion.choices[0]?.message?.content
        if (!content) return { error: 'No response from AI' }

        return { success: true, improvedPrompt: content.trim() }
    } catch (error) {
        console.error('Prompt improvement failed:', error)
        return { error: 'Failed to improve prompt' }
    }
}

export async function generateEmailContent(prompt: string, subject?: string) {
    const contactEmail = process.env.EMAIL_USER || 'contact@firststepco.com'

    try {
        const systemPrompt = `You are a world-class HTML email designer and copywriter for FirstStep (firststepco.com) — a premium B2B SaaS platform serving professionals (doctors, clinics, restaurants).

OUTPUT FORMAT — respond with exactly two parts separated by ---HTML---:
SUBJECT: <compelling subject line>
---HTML---
<the complete HTML email — no markdown fences, no explanations>

DESIGN SYSTEM (all CSS must be inline, no <style> blocks):
- Background:       #070b14
- Card bg:          #0c1420
- Card border:      1px solid rgba(255,255,255,0.07)
- Hero bg:          linear-gradient(160deg,#0d1f3c 0%,#0c1420 100%)
- Accent blue:      #2563eb
- Accent line:      linear-gradient(90deg,#1d4ed8,#3b82f6,#60a5fa)
- Heading color:    #f1f5f9
- Body text:        #94a3b8
- Muted text:       #64748b
- Feature card bg:  rgba(255,255,255,0.03)
- Feature card border: 1px solid rgba(255,255,255,0.08)
- CTA bg:           linear-gradient(135deg,#1e40af,#2563eb)
- CTA hover n/a (inline only)
- Footer bg:        #070b14

ELEMENT STYLES (use exactly as shown):
  h1 headline:   font-size:28px;font-weight:800;color:#f1f5f9;margin:0 0 12px 0;line-height:1.25;letter-spacing:-0.03em;
  h2 section:    font-size:20px;font-weight:700;color:#e2e8f0;margin:0 0 10px 0;line-height:1.3;
  p body:        font-size:15px;line-height:1.75;color:#94a3b8;margin:0 0 18px 0;
  p small:       font-size:13px;line-height:1.6;color:#64748b;margin:0;
  strong:        color:#cbd5e1;font-weight:600;
  hr:            border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;
  badge pill:    display:inline-block;background:rgba(37,99,235,0.2);border:1px solid rgba(59,130,246,0.35);color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:4px 14px;border-radius:100px;margin-bottom:20px;
  CTA button:    display:inline-block;background:linear-gradient(135deg,#1e40af,#2563eb);color:#ffffff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.01em;box-shadow:0 4px 20px rgba(37,99,235,0.4);
  feature card:  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;margin-bottom:12px;
  highlight box: background:rgba(37,99,235,0.08);border-left:3px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;
  list item:     font-size:15px;line-height:1.75;color:#94a3b8;margin-bottom:8px;
  checkmark li:  color:#94a3b8; — prefix with ✓  in color:#34d399

AVAILABLE PERSONALIZATION VARIABLES (use as-is in text):
  {{companyName}}  {{name}}  {{email}}  {{registrationDate}}

FULL HTML SKELETON — generate the COMPLETE email using this exact structure.
Replace ALL [PLACEHOLDER] sections with real content. Keep ALL structure and styles outside [PLACEHOLDER] sections EXACTLY as-is.

<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:#070b14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Hidden preheader text -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">[PREHEADER: 1–2 sentence email preview text]</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#070b14;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <!-- ═══ CARD ═══ -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;width:100%;background-color:#0c1420;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);box-shadow:0 32px 64px rgba(0,0,0,0.6);">

          <!-- TOP ACCENT LINE -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#1d4ed8 0%,#3b82f6 50%,#60a5fa 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER — logo + tagline -->
          <tr>
            <td style="padding:28px 40px 24px;background:linear-gradient(160deg,#0d1f3c 0%,#0c1420 100%);border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="https://firststepco.com/og-image.png" alt="FirstStep" style="height:34px;width:auto;display:block;" />
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="font-size:11px;font-weight:600;color:#475569;letter-spacing:0.04em;text-transform:uppercase;">Client Dashboard</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO SECTION -->
          <tr>
            <td style="padding:44px 40px 36px;background:linear-gradient(180deg,#0d1f3c 0%,#0c1420 80%);">
              <!-- Badge pill — [REPLACE text with campaign category e.g. Nouveauté · Promotions · Important] -->
              <div style="display:inline-block;background:rgba(37,99,235,0.2);border:1px solid rgba(59,130,246,0.35);color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:4px 14px;border-radius:100px;margin-bottom:20px;">[BADGE TEXT]</div>

              <!-- Main headline -->
              <h1 style="font-size:30px;font-weight:800;color:#f1f5f9;margin:0 0 14px 0;line-height:1.2;letter-spacing:-0.03em;">[MAIN HEADLINE — compelling, personalized if appropriate using {{companyName}}]</h1>

              <!-- Subtitle -->
              <p style="font-size:16px;line-height:1.7;color:#94a3b8;margin:0;">[SUBTITLE — 1–2 sentences expanding the headline, what the reader will gain]</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,0.25),transparent);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding:40px;background-color:#0c1420;">

              <!-- [FILL BODY CONTENT — use paragraphs, feature cards, highlight boxes, lists as appropriate] -->
              <!-- EXAMPLE ELEMENTS (remove and replace with actual content): -->

              <!-- GREETING PARAGRAPH: -->
              <!-- <p style="font-size:15px;line-height:1.75;color:#94a3b8;margin:0 0 18px 0;">Bonjour <strong style="color:#cbd5e1;font-weight:600;">{{companyName}}</strong>,</p> -->

              <!-- FEATURE CARD (repeat for each key point): -->
              <!-- <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:12px;">
                     <tr><td style="padding:20px;">
                       <p style="font-size:14px;font-weight:700;color:#e2e8f0;margin:0 0 6px 0;">🔹 [Feature Title]</p>
                       <p style="font-size:14px;line-height:1.65;color:#94a3b8;margin:0;">[Feature description]</p>
                     </td></tr>
                   </table> -->

              <!-- HIGHLIGHT BOX: -->
              <!-- <div style="background:rgba(37,99,235,0.08);border-left:3px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0;">
                     <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0;">[Key insight or quote]</p>
                   </div> -->

              <!-- CHECKLIST: -->
              <!-- <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;">
                     <p style="font-size:15px;color:#94a3b8;margin:0 0 10px 0;"><span style="color:#34d399;font-weight:700;">✓</span>&nbsp; [Item 1]</p>
                   </td></tr></table> -->

              <!-- CTA SECTION: -->
              <!-- <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(37,99,235,0.07);border:1px solid rgba(37,99,235,0.2);border-radius:12px;margin:32px 0 0 0;">
                     <tr><td style="padding:32px;text-align:center;">
                       <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 20px 0;">[CTA supporting text]</p>
                       <a href="https://firststepco.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1e40af,#2563eb);color:#ffffff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 4px 20px rgba(37,99,235,0.4);">[CTA Label]</a>
                     </td></tr>
                   </table> -->

              [REPLACE ALL ABOVE COMMENTS WITH ACTUAL GENERATED EMAIL CONTENT]

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:32px 40px;background-color:#070b14;border-top:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <!-- Social / links row -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:16px;"><a href="https://firststepco.com" style="font-size:12px;color:#3b82f6;text-decoration:none;font-weight:500;">Site web</a></td>
                        <td style="padding-right:16px;"><a href="https://firststepco.com/dashboard" style="font-size:12px;color:#3b82f6;text-decoration:none;font-weight:500;">Dashboard</a></td>
                        <td><a href="mailto:${contactEmail}" style="font-size:12px;color:#3b82f6;text-decoration:none;font-weight:500;">Support</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
                    <p style="font-size:12px;color:#334155;margin:0 0 6px 0;line-height:1.5;">&#169; 2026 <strong style="color:#475569;font-weight:600;">FirstStep</strong> &mdash; Empowering businesses with authoritative systems.</p>
                    <p style="font-size:12px;color:#1e293b;margin:0;line-height:1.5;">Vous recevez cet email en tant que client FirstStep. &nbsp;<a href="https://firststepco.com/unsubscribe?email={{email}}" style="color:#475569;text-decoration:underline;text-underline-offset:2px;">Se d&eacute;sabonner</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /CARD -->

      </td>
    </tr>
  </table>
</body>
</html>

IMPORTANT GENERATION RULES:
1. Replace EVERY [PLACEHOLDER] with real, on-brand content — do NOT leave any placeholder text
2. Choose 2–4 feature cards OR 1 highlight box + checklist depending on the email's purpose
3. Always include exactly ONE CTA section near the bottom of the body
4. Always start with a personalized greeting using {{companyName}}
5. Keep the badge text to 1–3 words (e.g., "Nouveauté", "Mise à jour", "Offre spéciale")
6. Write in the same language as the user's instructions
7. Contact info: ${contactEmail} | Dashboard: https://firststepco.com/dashboard`

        const userPrompt = subject
            ? `Existing subject (improve it or keep it): "${subject}"\n\nInstructions: ${prompt}`
            : `Instructions: ${prompt}`

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
        })

        let raw = chatCompletion.choices[0]?.message?.content
        if (!raw) return { error: 'No response from AI' }

        // Strip markdown code fences
        raw = raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

        // Parse subject + html
        const separator = '---HTML---'
        const sepIndex = raw.indexOf(separator)
        let generatedSubject: string | undefined
        let content: string

        if (sepIndex !== -1) {
            const subjectLine = raw.slice(0, sepIndex).trim()
            generatedSubject = subjectLine.replace(/^SUBJECT:\s*/i, '').trim()
            content = raw.slice(sepIndex + separator.length).trim()
        } else {
            // Fallback: model didn't follow format, take all as HTML
            content = raw
        }

        return { success: true, content, subject: generatedSubject }
    } catch (error) {
        console.error('AI Email Generation Failed:', error)
        return { error: 'Failed to generate email content' }
    }
}

export async function generateWebsiteSuggestions(type: string = 'professional cabinet', context?: string) {
    try {
        const prompt = `You are a professional branding expert for small businesses. 
        Generate 3 high-end, professional site names and corresponding short taglines/descriptions for a "${type}".
        ${context ? `The user provided this context: "${context}". Please build upon or refine this.` : ''}
        
        Focus on clinical excellence, trust, precision, and care.
        Format the response as a JSON array of objects with "siteName" and "description" fields.
        Example: [{"siteName": "Elite Medical", "description": "High-precision therapeutic care"}]
        Return ONLY the JSON. No other text.`

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' }
        })

        const content = chatCompletion.choices[0]?.message?.content
        if (!content) return { error: 'No response from AI' }

        const data = JSON.parse(content)
        // Handle both direct array or wrapped in an object
        let suggestions = Array.isArray(data) ? data : (data.suggestions || Object.values(data)[0])

        if (!Array.isArray(suggestions)) {
            // Fallback for some LLM formats
            suggestions = [data]
        }

        return { success: true, suggestions: suggestions.slice(0, 3) }
    } catch (error) {
        console.error('AI Generation Failed:', error)
        return { error: 'Failed to generate suggestions' }
    }
}
