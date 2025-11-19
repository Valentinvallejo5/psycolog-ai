// ⚠️ MIGRACIÓN A CLOUD STORAGE EN PROGRESO
// Ver instrucciones detalladas en /docs/migracion_videos.md
// Los videos deben subirse manualmente al bucket "videos" en Lovable Cloud

const STORAGE_BASE_URL = "https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos";

export const GUIDED_VIDEOS = {
  panic: {
    en: `${STORAGE_BASE_URL}/ansiedadEN.mp4`,
    es: `${STORAGE_BASE_URL}/ansiedadESP1.mp4`,
  },
  meditation: {
    en: `${STORAGE_BASE_URL}/meditacionEN1.mp4`,
    es: `${STORAGE_BASE_URL}/meditacionES1.mp4`,
  },
} as const;

// Additional meditation options available for future rotation
export const MEDITATION_ALTERNATIVES = {
  en: [
    `${STORAGE_BASE_URL}/meditacionEN1.mp4`,
    `${STORAGE_BASE_URL}/meditacionEN2.mp4`
  ],
  es: [
    `${STORAGE_BASE_URL}/meditacionES1.mp4`,
    `${STORAGE_BASE_URL}/meditacionESP2.mp4`
  ],
} as const;
