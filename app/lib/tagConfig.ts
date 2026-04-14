export type TagConfig = {
  color: string;
  imageBg: string;
  label: string;
};

export const TAG_CONFIG: Record<string, TagConfig> = {
  music:   { label: "Music",   color: "bg-violet-500/10 text-violet-300",  imageBg: "from-violet-900 to-[#0a0a0a]" },
  sport:   { label: "Sport",   color: "bg-emerald-500/10 text-emerald-300", imageBg: "from-emerald-900 to-[#0a0a0a]" },
  social:  { label: "Social",  color: "bg-sky-500/10 text-sky-300",         imageBg: "from-sky-900 to-[#0a0a0a]" },
  dance:   { label: "Dance",   color: "bg-rose-500/10 text-rose-300",       imageBg: "from-rose-900 to-[#0a0a0a]" },
  culture: { label: "Culture", color: "bg-amber-500/10 text-amber-300",     imageBg: "from-amber-900 to-[#0a0a0a]" },
};

export const ALL_TAGS = Object.keys(TAG_CONFIG);
