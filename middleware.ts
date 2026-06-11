import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const acceptHeader = request.headers.get('accept') || ''
  const isMarkdownRequested = acceptHeader.includes('text/markdown')

  // Link headers for the homepage (RFC 8288)
  const linkHeaderVal = '</.well-known/api-catalog>; rel="api-catalog", </docs/api>; rel="service-doc"'

  if (pathname === '/') {
    if (isMarkdownRequested) {
      const homeMd = `# FirstStep Platform\n\nFirstStep is a B2B SaaS platform that centralizes business management operations in Morocco.\n\n## Our Solutions\n- **Restaurant Service**: Complete digital menu, live order monitor, table layouts, and custom order options & add-ons.\n- **Cabinet / Clinic Service**: Appointment booking, calendar management, and medical file tracking.\n- **Stock Management & Rentals**: Centralized inventory tracking and reservation systems.\n\n## Key Technical Specifications\n- **Framework**: Next.js, Laravel 11, SQLite/PostgreSQL\n- **Real-Time**: WebSockets for Live Order Monitors and status updates.\n- **Cloud Scale**: Docker containers and high-availability cloud architecture.\n\n## More Information\n- **About**: Learn more about our story, mission, and founder Abderrahmane Raquibi at /about.\n- **Terms**: Read our Terms of Service (CGU) at /terms.\n- **Contact**: Reach out to us at contact@firststep.ma.`
      return new NextResponse(homeMd, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Link': linkHeaderVal
        }
      })
    }

    const response = NextResponse.next()
    response.headers.set('Link', linkHeaderVal)
    return response
  }

  if (pathname === '/about' && isMarkdownRequested) {
    const aboutMd = `# About FirstStep\n\nFirstStep is a scalable, multi-tenant SaaS platform designed to modernize business operations through centralized, modular management systems. It provides industry-specific solutions for stock management, hospitality, automotive rentals, healthcare, and service-based organizations within a unified digital ecosystem.\n\n## Mission\nTo deliver a unified, intelligent, and scalable SaaS ecosystem that simplifies business operations and enables organizations to focus on growth rather than complexity.\n\n## Vision\nTo establish FirstStep as a leading global business management platform by redefining how companies digitize, automate, and scale their operations through modern software infrastructure and AI-driven systems.\n\n## Founder\nFirstStep was founded by Abderrahmane Raquibi, a full-stack software engineer specializing in scalable web architectures and SaaS product development.`
    return new NextResponse(aboutMd, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    })
  }

  if (pathname === '/terms' && isMarkdownRequested) {
    const termsMd = `# Conditions d'utilisation — FirstStep\n\n## 01. Objet\nLes presentes conditions generales d'utilisation regissent l'acces et l'utilisation de la plateforme SaaS FirstStep, editee et exploitee au Maroc.\n\n## 02. Acces a la Plateforme\nL'acces est reserve aux personnes ayant cree un compte et souscrit a un service.\n\n## 03. Services proposes\nFirstStep propose des modules de gestion adaptes aux secteurs : restauration, sante, services professionnels, etc.\n\n## 04. Tarification et paiement\nLes tarifs sont en MAD. Le paiement est du a la souscription.\n\n## 05. Obligations de l'utilisateur\n- Utiliser la Plateforme conformement aux lois marocaines en vigueur.\n- Ne pas pirater, decompiler ou alterer la Plateforme.\n\n## 06. Propriete intellectuelle\nTous les elements sont la propriete exclusive de FirstStep.\n\n## 07. Donnees personnelles\nFirstStep traite les donnees personnelles conformement a la loi marocaine n° 09-08.`
    return new NextResponse(termsMd, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/about', '/terms']
}
