import { Metadata } from 'next'
import EmploymentCanvasClient from './EmploymentCanvasClient'

export const metadata: Metadata = {
  title: 'Éditeur de Modèle de Contrat Développeur | Admin FirstStep',
  description: 'Éditeur visuel interactif des coordonnées et styles du modèle de contrat d\'emploi développeur.',
}

export default function AdminEmploymentTemplatePage() {
  return <EmploymentCanvasClient />
}
