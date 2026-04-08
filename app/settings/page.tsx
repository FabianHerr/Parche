"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { getProfile, updateProfile, uploadAvatar, type UserProfile } from "@/app/lib/profile";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      try {
        const p = await getProfile(data.user.id);
        if (p) {
          setProfile(p);
          setName(p.name ?? "");
          setBio(p.bio ?? "");
          setAvatarPreview(p.avatar_url ?? null);
        }
      } catch (err: unknown) {
        setError((err as { message?: string })?.message ?? "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let avatar_url = profile.avatar_url ?? undefined;

      if (avatarFile) {
        avatar_url = await uploadAvatar(profile.id, avatarFile);
      }

      await updateProfile(profile.id, {
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar_url,
      });

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Something went wrong.";
      console.error("[settings] update error:", err);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex-1 w-full">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-8 w-40 rounded-lg bg-white/5" />
            <div className="h-20 w-20 rounded-full bg-white/5 mx-auto" />
            <div className="h-10 rounded-xl bg-white/5" />
            <div className="h-24 rounded-xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">
            Account
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full bg-white/8 border border-white/15 overflow-hidden hover:border-white/30 transition-colors group"
              aria-label="Change profile photo"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-8 h-8 text-neutral-600 mx-auto mt-6"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-xs text-neutral-600">Click to change photo</p>
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">Email</label>
            <div className="w-full rounded-xl bg-white/3 border border-white/8 px-4 py-2.5 text-sm text-neutral-500 select-none">
              {profile?.email}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/25 focus:bg-white/8 transition-colors"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/25 focus:bg-white/8 transition-colors resize-none"
            />
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
              Profile updated successfully.
            </p>
          )}

          <div className="border-t border-white/8" />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

      </div>
    </main>
  );
}
