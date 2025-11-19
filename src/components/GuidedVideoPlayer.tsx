import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize, Minimize, Loader2 } from 'lucide-react';

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
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

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
    
    // Set new timeout to hide controls after 2.5 seconds
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  // Pause auto-hide when hovering over controls
  const handleControlsMouseEnter = () => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
  };

  const handleControlsMouseLeave = () => {
    if (isPlaying) {
      handleUserActivity();
    }
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

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
      console.error('Error loading video');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
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
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
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

  const handleVideoClick = (e: React.MouseEvent) => {
    // Only toggle if clicking on video, not on controls
    if (e.target === videoRef.current || e.target === containerRef.current) {
      togglePlayPause();
    }
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
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        style={{ WebkitMediaControls: 'false' } as any}
      />

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center px-6">
            <p className="text-white font-medium mb-2">No se pudo cargar el video</p>
            <p className="text-white/70 text-sm">Por favor, intenta nuevamente más tarde</p>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-primary animate-spin drop-shadow-lg" />
        </div>
      )}
      
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
        <div 
          className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md"
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}
        >
          {/* Progress bar */}
          <div 
            className="h-1 bg-white/20 cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            {/* Left: Brand */}
            <div className="text-xs font-medium text-white drop-shadow-lg hidden sm:block">
              psicolog.ia
            </div>

            {/* Center: Playback controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); skip(-5); }}
                className="p-2 rounded-full hover:bg-primary/30 transition-colors duration-200"
                aria-label="Retroceder 5 segundos"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                className="p-2 rounded-full hover:bg-primary/30 transition-colors duration-200"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-white" fill="currentColor" />
                )}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); skip(5); }}
                className="p-2 rounded-full hover:bg-primary/30 transition-colors duration-200"
                aria-label="Adelantar 5 segundos"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Right: Time and fullscreen */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-white font-medium whitespace-nowrap drop-shadow-lg">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                className="p-2 rounded-full hover:bg-primary/30 transition-colors duration-200"
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Maximize className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
