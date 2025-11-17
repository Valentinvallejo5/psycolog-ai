type YouTubePlayerProps = {
  videoId: string;
};

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={src}
        title="Guided video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
