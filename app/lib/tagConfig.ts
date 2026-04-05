export type TagConfig = {
  color: string;
  imageBg: string;
  label: string;
};

export const TAG_CONFIG: Record<string, TagConfig> = {
  music:   { label: "Music",   color: "bg-violet-500/20 text-violet-300",  imageBg: "from-violet-900/60 to-neutral-900" },
  sport:   { label: "Sport",   color: "bg-emerald-500/20 text-emerald-300", imageBg: "from-emerald-900/60 to-neutral-900" },
  social:  { label: "Social",  color: "bg-amber-500/20 text-amber-300",    imageBg: "from-amber-900/60 to-neutral-900" },
  dance:   { label: "Dance",   color: "bg-rose-500/20 text-rose-300",      imageBg: "from-rose-900/60 to-neutral-900" },
  culture: { label: "Culture", color: "bg-sky-500/20 text-sky-300",        imageBg: "from-sky-900/60 to-neutral-900" },
};

export const ALL_TAGS = Object.keys(TAG_CONFIG);
