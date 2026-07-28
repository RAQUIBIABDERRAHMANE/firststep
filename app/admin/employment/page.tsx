import { Metadata } from 'next'
import EmploymentAdminClient from './EmploymentAdminClient'

export const metadata: Metadata = {
  title: 'Gestion des Candidatures Développeurs | Admin FirstStep',
  description: 'Gestion des dossiers de candidature développeur et génération des contrats d\'engagement.',
}

export default function AdminEmploymentPage() {
  return <EmploymentAdminClient />
}
