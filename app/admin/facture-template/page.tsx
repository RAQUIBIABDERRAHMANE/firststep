import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import FactureCanvasClient from './FactureCanvasClient'

export default async function FactureTemplatePage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/login')
  }

  return <FactureCanvasClient />
}
