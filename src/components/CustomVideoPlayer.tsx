import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import ClassicLoader from '@/components/ui/classic-loader';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('videoVolume');
    return saved ? parseFloat(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setProgress(video.currentTime);
    const onMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('canplay', onCanPlay);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const skip = (sec: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.duration, video.currentTime + sec);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setProgress(value);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('videoVolume', newVolume.toString());
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <ClassicLoader />
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto cursor-pointer"
        onClick={togglePlay}
        playsInline
        style={{ minHeight: isLoading ? '400px' : 'auto' }}
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm text-white z-10 transition-opacity duration-300">
          <div className="flex items-center justify-between text-xs mb-1 px-1">
            <span className="text-neutral-400 font-medium">psicolog.ia</span>
            <span className="text-white font-medium">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={duration}
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full accent-white cursor-pointer"
            style={{
              appearance: 'none',
              height: '4px',
              borderRadius: '9999px',
              background: 'white',
            }}
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} aria-label="Silenciar/Activar sonido" className="hover:text-violet-300">
                {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-white cursor-pointer"
                style={{
                  appearance: 'none',
                  height: '4px',
                  borderRadius: '9999px',
                  background: 'white',
                }}
              />
            </div>
            
            <div className="flex items-center gap-6">
              <button onClick={() => skip(-5)} aria-label="Retroceder 5 segundos" className="hover:text-violet-300">
                <RotateCcw size={24} />
              </button>
              <button onClick={togglePlay} aria-label="Reproducir o pausar" className="hover:text-violet-300">
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button onClick={() => skip(5)} aria-label="Avanzar 5 segundos" className="hover:text-violet-300">
                <RotateCw size={24} />
              </button>
              <button onClick={toggleFullscreen} aria-label="Pantalla completa" className="hover:text-violet-300">
                <Maximize2 size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
