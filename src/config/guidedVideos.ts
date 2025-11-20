export const GUIDED_VIDEOS = {
  panic: {
    en: "/videos/ansiedadEN.mp4",
    es: "/videos/ansiedadESP1.mp4",
  },
  meditation: {
    en: "/videos/meditacionEN1.mp4", // Can alternate with meditacionEN2.mp4
    es: "/videos/meditacionES1.mp4", // Can alternate with meditacionES2!.mp4
  },
} as const;

// Additional meditation options available for future rotation
export const MEDITATION_ALTERNATIVES = {
  en: ["/videos/meditacionEN1.mp4", "/videos/meditacionEN2.mp4"],
  es: ["/videos/meditacionES1.mp4", "/videos/meditacionES2!.mp4"],
} as const;
