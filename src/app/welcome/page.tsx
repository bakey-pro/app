import Image from "next/image"
import { getTranslations } from 'next-intl/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react";

export const metadata = {
    title: 'Welcome',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function WelcomePage() {
    const t = await getTranslations('welcome');
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
                            <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text font-bold text-4xl lg:text-5xl">Welcome</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm lg:text-base text-center mb-7.5">{t('description')}</p>

                            <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-5 py-3.5 mb-8 items-center justify-items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-neutral-600 dark:text-neutral-500 text-lg">bakey.pro</span>
                                    <input className="bg-transparent w-full border-none outline-none text-neutral-950 dark:text-neutral-50 text-lg ml-1.5" type="text" pattern="^[A-Za-z0-9_-]+$" />
                                </div>
                                <button className={`flex items-center justify-center cursor-pointer min-w-9 min-h-9 border outline-none rounded-lg ml-2 text-center`}>
                                    <ChevronRight size="20" className={`transition-colors duration-300 text-neutral-950 dark:text-neutral-50`} />
                                </button>
                            </div>

                            <p className="text-neutral-500 text-sm text-center mt-6">{t('note')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:block overflow-hidden rounded-xl m-3 col-span-6">
                <div className="absolute inset-0">
                    <Image width={1000} height={1100} src="/assets/welcome-bg.png" alt="Background" className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/80 dark:via-black/40 dark:to-black/20" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-10">
                    <div className="text-white space-y-4">
                        <blockquote className="text-2xl font-medium leading-relaxed">
                            "Welcome to Bakey! Show off who you are and let the world get to know you!"
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
