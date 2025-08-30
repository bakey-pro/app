import Image from "next/image"
import { getTranslations } from 'next-intl/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SSO } from "./sso"

export const metadata = {
    title: 'Login',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function LoginPage() {
    const t = await getTranslations('login');
    const w = await getTranslations('word');

    return (
        <div className="grid min-h-svh lg:grid-cols-10">
            <div className="flex flex-col gap-4 p-6 md:p-10 col-span-4">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <Image src="/assets/bakey.svg" alt="Bakey" width={32} height={32} />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xl mx-auto">
                        <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                            <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text font-bold text-4xl lg:text-5xl">Join Bakey</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm lg:text-base text-center mb-7.5">{t('description')}</p>

                            <SSO />

                            <p className="text-neutral-500 text-xs lg:text-sm text-center mt-6">{t('terms1')} <a className="underline" href="/terms/">{w('terms')}</a> {t('terms2')} <a className="underline" href="/privacy/">{w('privacy')}</a>{t('terms3')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:block overflow-hidden rounded-xl m-3 col-span-6">
                <div className="absolute inset-0">
                    <Image width={1500} height={1600} src="/assets/login-bg.png" alt="Background" className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/80 dark:via-black/40 dark:to-black/20" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-10">
                    <div className="text-white space-y-4">
                        <blockquote className="text-2xl font-medium leading-relaxed">
                            "We&apos;re so happy to meet you all through Bakey. We hope you enjoy it!"
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="https://github.com/ri0n-dev.png" alt="@ri0n-dev" />
                                <AvatarFallback>RI</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="font-semibold">Rion</div>
                                <div className="text-sm text-white/80">Founder</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
