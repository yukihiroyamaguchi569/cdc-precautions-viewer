export type Precaution = 'Standard' | 'Contact' | 'Droplet' | 'Airborne';

export interface PrecautionRecord {
  id: string;
  name: string;
  sub: string | null;
  nameJa: string | null;
  aliases: string[];
  precautions: Precaution[];
  duration: string;
  durationJa: string | null;
  comments: string | null;
  commentsJa: string | null;
  updated: string | null;
  seeAlso: string | null;
}

export interface Dataset {
  meta: {
    title: string;
    subtitle: string;
    source: string;
    sourceUrl: string;
    webVersionDate: string;
    license: string;
    generatedAt: string;
    count: number;
  };
  records: PrecautionRecord[];
}

/** Visual + semantic metadata for each precaution type. */
export const PRECAUTION_META: Record<
  Precaution,
  { label: string; labelJa: string; badge: string; dot: string }
> = {
  Standard: {
    label: 'Standard',
    labelJa: '標準予防策',
    badge:
      'bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-500',
    dot: 'bg-slate-400',
  },
  Contact: {
    label: 'Contact',
    labelJa: '接触予防策',
    badge:
      'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-500/50',
    dot: 'bg-emerald-500',
  },
  Droplet: {
    label: 'Droplet',
    labelJa: '飛沫予防策',
    badge:
      'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-500/20 dark:text-sky-200 dark:ring-sky-500/50',
    dot: 'bg-sky-500',
  },
  Airborne: {
    label: 'Airborne',
    labelJa: '空気予防策',
    badge:
      'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-500/50',
    dot: 'bg-rose-500',
  },
};
