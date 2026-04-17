"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { createEvent } from "@/app/lib/db/events";
import { uploadEventImages } from "@/app/lib/db/images";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

type FormState = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  tag: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  event_time: "",
  tag: "music",
};

const TAG_DOTS: Record<string, string> = {
  music:   "bg-violet-400",
  sport:   "bg-emerald-400",
  social:  "bg-sky-400",
  dance:   "bg-rose-400",
  culture: "bg-amber-400",
};

const TAG_ACTIVE: Record<string, string> = {
  music:   "bg-violet-500/20 border-violet-500/40 text-violet-200",
  sport:   "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",
  social:  "bg-sky-500/20 border-sky-500/40 text-sky-200",
  dance:   "bg-rose-500/20 border-rose-500/40 text-rose-200",
  culture: "bg-amber-500/20 border-amber-500/40 text-amber-200",
};

export default function CreateEventForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authReady, setAuthReady] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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

  // Generate object URL previews whenever files change
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAddFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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

      // Combine date + time into ISO string
      const combinedDate = form.event_date && form.event_time
        ? new Date(`${form.event_date}T${form.event_time}`).toISOString()
        : new Date(form.event_date).toISOString();

      const eventId = await createEvent({
        host_id: user.id,
        title: form.title,
        description: form.description,
        location: form.location,
        tag: form.tag,
        event_date: combinedDate,
      });

      if (files.length > 0) {
        await uploadEventImages(eventId, files);
      }

      router.push("/manager/events");
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

  const inputBase =
    "w-full rounded-lg bg-[#111111] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/50 focus:ring-0 transition-colors duration-150";

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-2">
          New Event
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Create an event
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">

        {/* ── Section 1: Basic info ───────────────────────── */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold text-white mb-0.5">Basic info</h2>
            <p className="text-xs text-white/40">What's happening and why people should come.</p>
          </div>

          {/* Title — larger, prominent */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50" htmlFor="title">
              Event title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rooftop Sunset Sessions"
              className="w-full rounded-lg bg-[#111111] border border-white/[0.08] px-4 py-3.5 text-base text-white placeholder-white/30 outline-none focus:border-orange-500/50 transition-colors duration-150 font-medium"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people what to expect, who it's for, and what makes it special…"
              className={`${inputBase} resize-y min-h-[120px]`}
            />
          </div>
        </section>

        <div className="border-t border-white/[0.06]" />

        {/* ── Section 2: Details ──────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold text-white mb-0.5">Details</h2>
            <p className="text-xs text-white/40">When, where, and what kind of event.</p>
          </div>

          {/* Date + Time — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50" htmlFor="event_date">
                Date
              </label>
              <input
                id="event_date"
                name="event_date"
                type="date"
                required
                value={form.event_date}
                onChange={handleChange}
                className={`${inputBase} [color-scheme:dark]`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50" htmlFor="event_time">
                Time
              </label>
              <input
                id="event_time"
                name="event_time"
                type="time"
                required
                value={form.event_time}
                onChange={handleChange}
                className={`${inputBase} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Category — pill selectors */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const { label } = TAG_CONFIG[tag];
                const dot = TAG_DOTS[tag] ?? "bg-white/30";
                const active = form.tag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, tag }))}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium transition-all duration-150 ${
                      active
                        ? TAG_ACTIVE[tag]
                        : "bg-transparent border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/75"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location — with pin icon */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50" htmlFor="location">
              Location
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-white/30"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.96 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.977.545l.025.012.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Plateau-Mont-Royal, Montreal"
                className={`${inputBase} pl-10`}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-white/[0.06]" />

        {/* ── Section 3: Images ───────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold text-white mb-0.5">Images</h2>
            <p className="text-xs text-white/40">Events with photos get more attendance.</p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleAddFiles(e.target.files)}
          />

          {files.length === 0 ? (
            /* Empty upload zone */
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border border-dashed border-white/[0.12] px-6 py-12 text-sm text-white/40 hover:border-white/25 hover:text-white/60 transition-all duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-white/20"
              >
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="font-medium">Drop images here or click to select</span>
              <span className="text-xs text-white/25">PNG, JPG, WEBP — multiple allowed</span>
            </button>
          ) : (
            /* Thumbnail grid */
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors duration-150"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
                        <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add more tile */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-lg border border-dashed border-white/[0.12] flex flex-col items-center justify-center gap-1 text-white/30 hover:border-white/25 hover:text-white/50 transition-all duration-150 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span className="text-xs font-medium">Add</span>
                </button>
              </div>

              <p className="text-xs text-white/40">
                {files.length} {files.length === 1 ? "image" : "images"} selected
              </p>
            </div>
          )}
        </section>

        {/* ── Error ──────────────────────────────────────── */}
        {error && (
          <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* ── Submit ─────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading || !authReady}
          className="w-full py-3.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating…
            </>
          ) : (
            "Create Event"
          )}
        </button>

      </form>
    </div>
  );
}
