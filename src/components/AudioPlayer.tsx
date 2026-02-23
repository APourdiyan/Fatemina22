import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  X,
  SkipBack,
  SkipForward,
  Volume2,
  Gauge,
} from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayer() {
  const { currentTrack, isPlaying, playbackSpeed, progress, togglePlay, setSpeed, setProgress, close } = usePlayer();

  if (!currentTrack) return null;

  const nextSpeed = () => {
    const idx = speeds.indexOf(playbackSpeed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 player-surface border-t border-border/20"
      >
        {/* Progress bar */}
        <div className="w-full h-1 bg-player-foreground/10 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((rect.right - e.clientX) / rect.width) * 100; // RTL
          setProgress(pct);
        }}>
          <motion.div
            className="h-full gold-gradient"
            style={{ width: `${progress}%` }}
            layout
          />
        </div>

        <div className="flex items-center gap-4 px-4 md:px-8 py-3">
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-player-foreground truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-player-foreground/60 truncate">
              {currentTrack.series} · جلسه {currentTrack.episodeNumber}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="p-2 rounded-full hover:bg-player-foreground/10 transition-colors text-player-foreground/70">
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5" />}
            </button>

            <button className="p-2 rounded-full hover:bg-player-foreground/10 transition-colors text-player-foreground/70">
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={nextSpeed}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-player-foreground/10 text-xs text-player-foreground/80 hover:bg-player-foreground/20 transition-colors"
            >
              <Gauge className="w-3 h-3" />
              {playbackSpeed}x
            </button>

            <Volume2 className="w-4 h-4 text-player-foreground/50" />

            <button
              onClick={close}
              className="p-1.5 rounded-full hover:bg-player-foreground/10 transition-colors text-player-foreground/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
