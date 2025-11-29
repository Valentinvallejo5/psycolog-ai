const STORAGE_BASE = "https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos";

export const GUIDED_VIDEOS = {
  panic: {
    en: `${STORAGE_BASE}/ansiedadEN.mp4`,
    es: `${STORAGE_BASE}/ansiedadESP1.mp4`,
  },
  meditation: {
    en: `${STORAGE_BASE}/meditacionEN1.mp4`,
    es: `${STORAGE_BASE}/meditacionES1.mp4`,
  },
} as const;

// Additional meditation options available for future rotation
export const MEDITATION_ALTERNATIVES = {
  en: [`${STORAGE_BASE}/meditacionEN1.mp4`, `${STORAGE_BASE}/meditacionEN2.mp4`],
  es: [`${STORAGE_BASE}/meditacionES1.mp4`, `${STORAGE_BASE}/meditacionESP2.mp4`],
} as const;
