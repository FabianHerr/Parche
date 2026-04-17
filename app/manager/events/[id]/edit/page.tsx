"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import {
  getEventById,
  type EventWithMeta,
} from "@/app/lib/db/events";
import { uploadEventImages, deleteEventImages } from "@/app/lib/db/images";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

// ─── Types ──────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  tag: string;
};

type ExistingImage = { url: string; deleted: boolean };

// ─── Constants (mirror CreateEventForm) ─────────────────────────────────────

const TAG_DOTS: Record<string, string> = {
  music: "bg-violet-400",
  sport: "bg-emerald-400",
  social: "bg-sky-400",
  dance: "bg-rose-400",
  culture: "bg-amber-400",
};

const TAG_ACTIVE: Record<string, string> = {
  music: "bg-violet-500/20 border-violet-500/40 text-violet-200",
  sport: "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",
  social: "bg-sky-500/20 border-sky-500/40 text-sky-200",
  dance: "bg-rose-500/20 border-rose-500/40 text-rose-200",
  culture: "bg-amber-500/20 border-amber-500/40 text-amber-200",
};

const inputBase =
  "w-full rounded-lg bg-[#111111] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/50 focus:ring-0 transition-colors duration-150";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseDateFields(isoDate: string): { event_date: string; event_time: string } {
  const d = new Date(isoDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    event_date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    event_time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Page state
  const [pageLoading, setPageLoading] = useState(true);
  const [event, setEvent] = useState<EventWithMeta | null>(null);

  // Form state
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    location: "",
    event_date: "",
    event_time: "",
    tag: "music",
  });
  const [originalForm, setOriginalForm] = useState<FormState | null>(null);

  // Image state
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Key detail change confirmation modal
  // Stores the original value of each key field before it was changed,
  // so we can revert if the user cancels the confirmation modal.
  const [pendingOriginals, setPendingOriginals] = useState<
    Partial<Record<string, string>>
  >({});
  const [showKeyDetailModal, setShowKeyDetailModal] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Async state
  const [loading, setLoading] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── Load event + auth check ───────────────────────────────────────────────

  const loadEvent = useCallback(
    async (userId: string) => {
      try {
        const data = await getEventById(eventId);
        if (!data || data.host_id !== userId) {
          router.replace("/manager/events");
          return;
        }
        const { event_date, event_time } = parseDateFields(data.event_date);
        const initial: FormState = {
          title: data.title,
          description: data.description,
          location: data.location,
          tag: data.tag,
          event_date,
          event_time,
        };
        setEvent(data);
        setForm(initial);
        setOriginalForm(initial);
        setExistingImages(data.images.map((url) => ({ url, deleted: false })));
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : (err as { message?: string })?.message ?? "Failed to load event.";
        setError(msg);
      } finally {
        setPageLoading(false);
      }
    },
    [eventId, router]
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        loadEvent(data.user.id);
      }
    });
  }, [router, loadEvent]);

  // Generate object URL previews for new files
  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-3 w-20 bg-white/[0.06] rounded mb-3" />
        <div className="h-8 w-40 bg-white/[0.08] rounded mb-2" />
        <div className="h-3 w-56 bg-white/[0.05] rounded mb-10" />
        <div className="flex flex-col gap-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-white/[0.04] border border-white/[0.06]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!event) return null; // being redirected

  // ── Derived state (after event is loaded) ────────────────────────────────

  const now = new Date();
  const eventDate = new Date(event.event_date);
  const isPast = eventDate < now;
  const msUntil = eventDate.getTime() - now.getTime();
  const isWithin24h = !isPast && msUntil < 24 * 60 * 60 * 1000;

  const hasChanges =
    originalForm !== null &&
    (form.title !== originalForm.title ||
      form.description !== originalForm.description ||
      form.location !== originalForm.location ||
      form.event_date !== originalForm.event_date ||
      form.event_time !== originalForm.event_time ||
      form.tag !== originalForm.tag ||
      existingImages.some((img) => img.deleted) ||
      newFiles.length > 0);

  const activeExisting = existingImages.filter((img) => !img.deleted);
  const totalImages = activeExisting.length + newFiles.length;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // For Date, Time, Location fields — intercepts change to show confirmation modal
  function handleKeyDetailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Only store the original value the first time each field is touched
    setPendingOriginals((prev) => {
      if (name in prev) return prev;
      return { ...prev, [name]: form[name as keyof FormState] };
    });
    setForm((prev) => ({ ...prev, [name]: value }));
    setShowKeyDetailModal(true);
  }

  function confirmKeyDetailChange() {
    setPendingOriginals({});
    setShowKeyDetailModal(false);
  }

  function cancelKeyDetailChange() {
    // Revert all key detail fields that were changed since modal opened
    setForm((prev) => ({ ...prev, ...pendingOriginals }));
    setPendingOriginals({});
    setShowKeyDetailModal(false);
  }

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList) return;
    setNewFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) =>
      prev.map((img) => (img.url === url ? { ...img, deleted: true } : img))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const combinedDate =
        form.event_date && form.event_time
          ? new Date(`${form.event_date}T${form.event_time}`).toISOString()
          : new Date(form.event_date).toISOString();

      // 1. Update event row — RLS enforces host_id = auth.uid()
      console.log("[edit-event] sending update:", { eventId, combinedDate, form });
      const { data: updateData, error: updateError } = await supabase
        .from("events")
        .update({
          title: form.title,
          description: form.description,
          location: form.location,
          tag: form.tag,
          event_date: combinedDate,
        })
        .eq("id", eventId)
        .select();
      console.log("[edit-event] update response:", { updateData, updateError });
      if (updateError) {
        console.error("[edit-event] update error:", updateError);
        throw updateError;
      }
      if (!updateData || updateData.length === 0) {
        throw new Error("Update matched no rows — check RLS policies or event ownership.");
      }

      // 2. Delete removed images from storage + event_images table
      const toDelete = existingImages
        .filter((img) => img.deleted)
        .map((img) => img.url);
      if (toDelete.length > 0) {
        await deleteEventImages(toDelete);
      }

      // 3. Upload new images to storage + insert into event_images table
      if (newFiles.length > 0) {
        await uploadEventImages(eventId, newFiles);
      }

      setSuccessMessage("Event updated");
      router.refresh(); // invalidate Next.js router cache so / and /manager/events show fresh data
      setTimeout(() => router.push("/manager/events"), 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "Something went wrong.";
      console.error("[edit-event] error:", err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setDeletingEvent(true);
    setError(null);

    try {
      // 1. Delete all image files from storage + event_images rows
      //    Use event.images (source of truth from DB) not local UI state
      if (event.images.length > 0) {
        await deleteEventImages(event.images);
      }

      // 2. Delete RSVPs
      const { error: rsvpsError } = await supabase
        .from("rsvps")
        .delete()
        .eq("event_id", eventId);
      if (rsvpsError) {
        console.error("[delete-event] rsvps error:", rsvpsError);
        throw rsvpsError;
      }

      // 3. Delete event row — RLS enforces host_id = auth.uid()
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      if (eventError) {
        console.error("[delete-event] event error:", eventError);
        throw eventError;
      }

      router.push("/manager/events");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "Delete failed.";
      console.error("[delete-event] error:", err);
      setError(msg);
      setShowDeleteModal(false);
    } finally {
      setDeletingEvent(false);
    }
  }

  // ── Reusable locked-field wrapper ─────────────────────────────────────────

  const lockedField = (
    children: React.ReactNode,
    showWarning: boolean
  ) => (
    <div className="flex flex-col gap-1.5">
      <div className={isPast || isWithin24h ? "opacity-40 pointer-events-none" : ""}>
        {children}
      </div>
      {showWarning && (
        <p className="text-xs text-amber-500/70">
          Cannot be changed less than 24 hours before the event
        </p>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <Link
          href="/manager/events"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-150 mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          My Events
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-2">
            Manager Mode
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Edit Event
          </h1>
          <p className="text-sm text-white/40 mt-1.5 truncate">{event.title}</p>
        </div>

        {/* Past event banner */}
        {isPast && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/20 text-amber-300/80 text-sm mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            This event has already taken place and can no longer be edited.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">

          {/* ── Section 1: Basic info ─────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-white mb-0.5">Basic info</h2>
              <p className="text-xs text-white/40">What's happening and why people should come.</p>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50" htmlFor="title">
                Event title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                disabled={isPast}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Rooftop Sunset Sessions"
                className="w-full rounded-lg bg-[#111111] border border-white/[0.08] px-4 py-3.5 text-base text-white placeholder-white/30 outline-none focus:border-orange-500/50 transition-colors duration-150 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
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
                disabled={isPast}
                value={form.description}
                onChange={handleChange}
                placeholder="Tell people what to expect, who it's for, and what makes it special…"
                className={`${inputBase} resize-y min-h-[120px] disabled:opacity-40 disabled:cursor-not-allowed`}
              />
            </div>
          </section>

          <div className="border-t border-white/[0.06]" />

          {/* ── Section 2: Details ────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-white mb-0.5">Details</h2>
              <p className="text-xs text-white/40">When, where, and what kind of event.</p>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50" htmlFor="event_date">
                  Date
                </label>
                {lockedField(
                  <input
                    id="event_date"
                    name="event_date"
                    type="date"
                    required
                    disabled={isPast || isWithin24h}
                    value={form.event_date}
                    onChange={isPast || isWithin24h ? undefined : handleKeyDetailChange}
                    className={`${inputBase} [color-scheme:dark] disabled:cursor-not-allowed`}
                  />,
                  isWithin24h
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50" htmlFor="event_time">
                  Time
                </label>
                {lockedField(
                  <input
                    id="event_time"
                    name="event_time"
                    type="time"
                    required
                    disabled={isPast || isWithin24h}
                    value={form.event_time}
                    onChange={isPast || isWithin24h ? undefined : handleKeyDetailChange}
                    className={`${inputBase} [color-scheme:dark] disabled:cursor-not-allowed`}
                  />,
                  false // warning shown under date, not time
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Category</label>
              <div className={`flex flex-wrap gap-2 ${isPast ? "opacity-40 pointer-events-none" : ""}`}>
                {ALL_TAGS.map((tag) => {
                  const { label } = TAG_CONFIG[tag];
                  const dot = TAG_DOTS[tag] ?? "bg-white/30";
                  const active = form.tag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={isPast}
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

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50" htmlFor="location">
                Location
              </label>
              {lockedField(
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
                    disabled={isPast || isWithin24h}
                    value={form.location}
                    onChange={isPast || isWithin24h ? undefined : handleKeyDetailChange}
                    placeholder="e.g. Plateau-Mont-Royal, Montreal"
                    className={`${inputBase} pl-10 disabled:cursor-not-allowed`}
                  />
                </div>,
                isWithin24h
              )}
            </div>
          </section>

          <div className="border-t border-white/[0.06]" />

          {/* ── Section 3: Images ─────────────────────────────────────── */}
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
              disabled={isPast}
              className="hidden"
              onChange={(e) => handleAddFiles(e.target.files)}
            />

            {totalImages === 0 && !isPast ? (
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
                  {/* Existing images */}
                  {activeExisting.map((img) => (
                    <div
                      key={img.url}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08] shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {!isPast && (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.url)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors duration-150"
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-2.5 h-2.5"
                          >
                            <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* New file previews */}
                  {newPreviews.map((src, i) => (
                    <div
                      key={src}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08] shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors duration-150"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="w-2.5 h-2.5"
                        >
                          <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add more tile */}
                  {!isPast && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-lg border border-dashed border-white/[0.12] flex flex-col items-center justify-center gap-1 text-white/30 hover:border-white/25 hover:text-white/50 transition-all duration-150 shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                      <span className="text-xs font-medium">Add</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/40">
                  {totalImages} {totalImages === 1 ? "image" : "images"} selected
                </p>
              </div>
            )}
          </section>

          {/* ── Error ──────────────────────────────────────────────────── */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* ── Success ────────────────────────────────────────────────── */}
          {successMessage && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage} — redirecting…
            </div>
          )}

          {/* ── Save button (hidden for past events) ───────────────────── */}
          {!isPast && (
            <button
              type="submit"
              disabled={loading || !hasChanges}
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
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          )}
        </form>

        {/* ── Danger zone ──────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-4">
            Danger Zone
          </p>
          <div className="flex items-center justify-between gap-4 px-4 py-4 rounded-lg border border-red-500/20 bg-red-500/[0.04]">
            <div>
              <p className="text-sm font-medium text-white">Delete Event</p>
              <p className="text-xs text-white/40 mt-0.5">
                Permanently remove this event and all its data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="shrink-0 px-3.5 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-150"
            >
              Delete
            </button>
          </div>
        </div>

      </div>

      {/* ── Key detail confirmation modal ─────────────────────────────────── */}
      {showKeyDetailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-2">
              Changing a key detail
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              You&apos;re changing a key detail. Attendees will not be
              automatically notified of this change.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelKeyDetailChange}
                className="flex-1 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmKeyDetailChange}
                className="flex-1 py-2.5 rounded-lg bg-orange-500 text-sm text-white font-medium hover:bg-orange-400 transition-colors duration-150"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-2">
              Delete this event?
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              This will permanently delete your event and all its data. This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingEvent}
                className="flex-1 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingEvent}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-sm text-white font-medium hover:bg-red-400 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingEvent ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  "Delete event"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
