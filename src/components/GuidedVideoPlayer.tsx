import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize, Minimize } from 'lucide-react';

type GuidedVideoPlayerProps = {
  src: string;
  onEnd?: () => void;
};

export function GuidedVideoPlayer({ src, onEnd }: GuidedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle mouse/touch movement to show controls
  const handleUserActivity = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after 3 seconds
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      onEnd?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Auto-play on mount
    video.play().catch(err => {
      console.log('Auto-play prevented:', err);
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [src, onEnd, isPlaying]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    handleUserActivity();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
    handleUserActivity();
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.log('Fullscreen error:', err);
    }
    handleUserActivity();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-primary/10 shadow-lg group"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
      />
      
      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center play/pause button (only when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 transition-all shadow-xl flex items-center justify-center"
              aria-label="Play"
            >
              <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
            </button>
          </div>
        )}

        {/* Bottom control bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm">
          {/* Progress bar */}
          <div 
            className="h-1 bg-background/20 cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary-foreground transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            {/* Left: Brand */}
            <div className="text-xs font-medium text-primary-foreground hidden sm:block">
              psicolog.ia
            </div>

            {/* Center: Playback controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center">
              <button
                onClick={() => skip(-10)}
                className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="Retroceder 10 segundos"
              >
                <SkipBack className="w-5 h-5 text-primary-foreground" />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                )}
              </button>

              <button
                onClick={() => skip(10)}
                className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="Adelantar 10 segundos"
              >
                <SkipForward className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Right: Time and fullscreen */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-primary-foreground font-medium whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Maximize className="w-5 h-5 text-primary-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
