"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { createEvent } from "@/app/lib/events";
import { uploadEventImages } from "@/app/lib/images";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

type FormState = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  tag: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  tag: "music",
};

export default function CreateEventPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setAuthReady(true);
      }
    });
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const eventId = await createEvent({
        host_id: user.id,
        ...form,
        event_date: new Date(form.event_date).toISOString(),
      });

      if (files.length > 0) {
        await uploadEventImages(eventId, files);
      }

      router.push(`/events/${eventId}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "Something went wrong.";
      console.error("[create-event] error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 w-full">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">
            New Event
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create an event
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rooftop Sunset Sessions"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/25 focus:bg-white/8 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people what to expect..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/25 focus:bg-white/8 transition-colors resize-none"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Plateau-Mont-Royal, Montreal"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/25 focus:bg-white/8 transition-colors"
            />
          </div>

          {/* Date & Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="event_date">
              Date & Time
            </label>
            <input
              id="event_date"
              name="event_date"
              type="datetime-local"
              required
              value={form.event_date}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/25 focus:bg-white/8 transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="tag">
              Category
            </label>
            <select
              id="tag"
              name="tag"
              required
              value={form.tag}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/25 focus:bg-white/8 transition-colors [color-scheme:dark]"
            >
              {ALL_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {TAG_CONFIG[tag].label}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400" htmlFor="images">
              Images <span className="text-neutral-600">(optional)</span>
            </label>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center gap-2 w-full rounded-xl bg-white/5 border border-dashed border-white/15 px-4 py-6 text-sm text-neutral-500 cursor-pointer hover:border-white/25 hover:bg-white/8 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-neutral-600">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                : "Click to select images"}
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-white/8" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !authReady}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create event"}
          </button>

        </form>
      </div>
    </main>
  );
}
