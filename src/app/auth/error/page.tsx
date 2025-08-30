import { CloudAlert } from "lucide-react"
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
    title: 'Error',
    description: 'Sorry, an error occurred during the authentication process. Please try again or contact support if the problem persists.',
}

export default async function AuthError() {
    const t = await getTranslations('authError');
    const w = await getTranslations('word');

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="px-15 py-20 w-155 bg-neutral-100 dark:bg-neutral-950 shadow-none">
                <CardHeader className="pb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <CloudAlert className="h-8 w-8 text-red-500 dark:text-red-400" />
                    </div>
                    <CardTitle className="mt-3 text-center text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                        {t('title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-600 dark:text-neutral-400">
                        {t('description')}
                    </p>
                </CardContent>
            </Card>
            <p className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {t('needhelp')} <a href="https://discord.gg/6BPfVm6cST" className="text-blue-600 hover:underline dark:text-blue-400">{w('support')}</a>
            </p>
        </div>
    )
}