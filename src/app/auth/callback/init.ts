"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default async function AuthCallbackHandler() {
  const router = useRouter();

  try {
    console.log("Starting auth callback handler...");
    const supabase = createClient();

    let session;
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      const { data: oauthData, error: signInError } = await supabase.auth.getSession();

      if (signInError || !oauthData?.session) {
        console.error("Error during OAuth callback:", signInError);
        await supabase.auth.signOut();
        return router.push("/login");
      }

      session = oauthData.session;
    }

    if (!session?.user) {
      console.error("No user found in session");
      await supabase.auth.signOut();
      return router.push("/login");
    }

    console.log("User authenticated:", session.user.email);

    console.log("User authenticated:", session.user?.email);
    const uid = session.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("uid")
      .eq("uid", uid)
      .single();

    if (profileError) {
      console.error("Profile select error:", profileError);
      await supabase.auth.signOut();
      return router.push("/auth/error/");
    }

    if (profileData) {
      return router.push("/admin");
    }

    let uploadedAvatarUrl = "";
    if (session.user.user_metadata.avatar_url) {
      try {
        const response = await fetch(session.user.user_metadata.avatar_url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const file = `${uid}.jpg`;

        const { error: storageError } = await supabase
          .storage
          .from("avatars")
          .upload(file, buffer, { contentType: "image/jpeg", upsert: true });

        if (storageError) {
          console.error("Storage upload error:", storageError);
          await supabase.auth.signOut();
          return router.push("/auth/error/");
        } else {
          const { data: publicUrl } = supabase
            .storage
            .from("avatars")
            .getPublicUrl(file);
          uploadedAvatarUrl = publicUrl.publicUrl;
        }
      } catch (fetchError) {
        console.error("Avatar fetch error:", fetchError);
        await supabase.auth.signOut();
        return router.push("/auth/error/");
      }
    }

    const initialProfileData = {
      uid: uid,
      name: session.user.user_metadata.name || "name",
      username: "",
      avatar: uploadedAvatarUrl || session.user.user_metadata.avatar_url || "",
      cover: "",
      bio: {
        introduction: "",
        location: "",
        occupation: "",
        contact: "",
      }
    };

    const { error: profileErrorInsert } = await supabase
      .from("profiles")
      .insert(initialProfileData);
    if (profileErrorInsert) {
      console.error("Profile insert error:", profileErrorInsert);
      await supabase.auth.signOut();
      return router.push("/auth/error/");
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
    };

    const { error: blockErrorInsert } = await supabase
      .from("blocks")
      .insert(initialBlockData);
    if (blockErrorInsert) {
      console.error("Block insert error:", blockErrorInsert);
      await supabase.auth.signOut();
      return router.push("/auth/error/");
    }

    const initialThemeData = {
      uid: uid,
      theme: "#ffffff, #D8D8D8, #202020",
      style: "fill, rounded-2xl"
    };

    const { error: themeErrorInsert } = await supabase
      .from("themes")
      .insert(initialThemeData);
    if (themeErrorInsert) {
      console.error("Theme insert error:", themeErrorInsert);
      await supabase.auth.signOut();
      return router.push("/auth/error/");
    }

    return router.push("/welcome");

  } catch (error) {
    console.error('Auth callback error:', error);
    return router.push("/auth/error/");
  }
}
