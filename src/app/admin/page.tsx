import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <p className="text-gray-600">メール: {user.email}</p>
            <p className="text-gray-600">ID: {user.id}</p>
            <p className="text-gray-600">
                最終ログイン: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ja-JP') : '不明'}
            </p>
        </div>
    )
}