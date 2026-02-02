import { redirect } from 'next/navigation'

export default async function RestaurantWebsiteIndex() {
    redirect('/dashboard/restaurant')
}
