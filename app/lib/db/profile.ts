import { supabase } from "@/app/lib/supabase";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, bio, avatar_url")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  fields: { name?: string; bio?: string; avatar_url?: string }
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update(fields)
    .eq("id", userId);

  if (error) throw error;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const path = `${userId}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: "image/jpeg" });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
