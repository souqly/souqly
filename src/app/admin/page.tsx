import { redirect } from 'next/navigation'

// Redirige directement vers la liste des candidatures.
export default function AdminPage() {
  redirect('/admin/candidatures')
}
