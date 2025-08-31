import { createClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createClient()

        try {
            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
            if (sessionError) {
                console.error('Authentication error:', sessionError)
                return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
            }

            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) {
                console.error('No user found in session')
                await supabase.auth.signOut()
                return NextResponse.redirect(`${requestUrl.origin}/login`)
            }

            const uid = session.user.id;

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("uid")
                .eq("uid", uid)
                .single()

            if (profileError && profileError.code !== 'PGRST116') {
                console.error("Profile select error:", profileError)
                await supabase.auth.signOut()
                return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
            }

            if (profileData) {
                return NextResponse.redirect(`${requestUrl.origin}/admin`)
            }

            await init(supabase, session, uid)
            return NextResponse.redirect(`${requestUrl.origin}/welcome`)
        } catch (error) {
            console.error('Unexpected error during authentication:', error)
            return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
        }
    }

    return NextResponse.redirect(`${requestUrl.origin}/admin`)
}

// Initial user data creation function
async function init(supabase: any, session: any, uid: string) {
    try {
        let uploadedAvatarUrl = ""
        if (session.user.user_metadata.avatar_url) {
            try {
                console.log("Uploading avatar image...")
                const response = await fetch(session.user.user_metadata.avatar_url)
                const arrayBuffer = await response.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                const file = `${uid}.jpg`

                const { error: storageError } = await supabase
                    .storage
                    .from("avatars")
                    .upload(file, buffer, {
                        contentType: "image/jpeg",
                        upsert: true
                    })

                if (storageError) {
                    console.error("Storage upload error:", storageError)
                    throw storageError
                } else {
                    const { data: publicUrl } = supabase
                        .storage
                        .from("avatars")
                        .getPublicUrl(file)
                    uploadedAvatarUrl = publicUrl.publicUrl
                    console.log("Avatar uploaded successfully:", uploadedAvatarUrl)
                }
            } catch (fetchError) {
                console.error("Avatar fetch/upload error:", fetchError)
            }
        }

        const initialProfileData = {
            uid: uid,
            name: session.user.user_metadata.name || session.user.user_metadata.full_name || "未設定",
            username: "",
            avatar: uploadedAvatarUrl || session.user.user_metadata.avatar_url || "",
            cover: "",
            bio: {
                introduction: "",
                location: "",
                occupation: "",
                contact: "",
            }
        }

        console.log("Creating profile data...")
        const { error: profileErrorInsert } = await supabase
            .from("profiles")
            .insert(initialProfileData)
        if (profileErrorInsert) {
            console.error("Profile insert error:", profileErrorInsert)
            throw profileErrorInsert
        }

        const initialBlockData = {
            uid: uid,
            block: [
                {
                    "id": "1",
                    "type": "IconLink",
                    "icon": "SiDiscord",
                    "string": "Discord",
                    "image": "",
                    "redirect": "",
                    "lock": ""
                },
                {
                    "id": "2",
                    "type": "IconLink",
                    "icon": "SiX",
                    "string": "X",
                    "image": "",
                    "redirect": "",
                    "lock": ""
                }
            ],
        }

        console.log("Creating block data...")
        const { error: blockErrorInsert } = await supabase
            .from("blocks")
            .insert(initialBlockData)
        if (blockErrorInsert) {
            console.error("Block insert error:", blockErrorInsert)
            throw blockErrorInsert
        }

        const initialThemeData = {
            uid: uid,
            theme: "#ffffff, #D8D8D8, #202020",
            style: "fill, rounded-2xl"
        }

        console.log("Creating theme data...")
        const { error: themeErrorInsert } = await supabase
            .from("themes")
            .insert(initialThemeData)
        if (themeErrorInsert) {
            console.error("Theme insert error:", themeErrorInsert)
            throw themeErrorInsert
        }

        console.log("Initial user data created successfully")

    } catch (error) {
        console.error("Error creating initial user data:", error)
        await cleanupUserData(supabase, uid)
        throw error
    }
}

// User data cleanup function
async function cleanupUserData(supabase: any, uid: string) {
    try {
        console.log("Cleaning up user data due to error...")

        await supabase.from("themes").delete().eq("uid", uid)
        await supabase.from("blocks").delete().eq("uid", uid)
        await supabase.from("profiles").delete().eq("uid", uid)
        await supabase.storage.from("avatars").remove([`${uid}.jpg`])

        console.log("User data cleanup completed")
    } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError)
    }
}