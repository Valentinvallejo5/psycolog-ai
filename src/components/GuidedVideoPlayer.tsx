import { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

type GuidedVideoPlayerProps = {
  src: string;
  onEnd?: () => void;
};

export function GuidedVideoPlayer({ src, onEnd }: GuidedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-play on mount
    video.play().catch(err => {
      console.log('Auto-play prevented:', err);
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src, onEnd]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-primary/10 shadow-lg">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
      />
      
      {/* Custom play/pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-all shadow-xl flex items-center justify-center group"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
        <div 
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
