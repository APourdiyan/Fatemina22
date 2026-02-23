import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ListOrdered, Play, CheckCircle2 } from "lucide-react";
import { Lecture } from "@/data/content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayer } from "@/contexts/PlayerContext";

interface SeriesEpisodeListProps {
  seriesName: string;
  episodes: Lecture[];
  currentId: string;
}

export default function SeriesEpisodeList({ seriesName, episodes, currentId }: SeriesEpisodeListProps) {
  const { currentTrack, isPlaying } = usePlayer();
  const sorted = [...episodes].sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0));
  const currentIndex = sorted.findIndex((e) => e.id === currentId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-accent" />
          {seriesName}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          جلسه {currentIndex + 1} از {sorted.length}
        </p>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / sorted.length) * 100}%` }}
          />
        </div>
      </div>

      <ScrollArea className="max-h-80">
        <div className="p-2">
          {sorted.map((ep) => {
            const isCurrent = ep.id === currentId;
            const isPlayingThis = currentTrack?.id === ep.id && isPlaying;

            return (
              <Link
                key={ep.id}
                to={`/content/${ep.id}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isCurrent
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  isCurrent
                    ? "emerald-gradient text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {isPlayingThis ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    ep.episodeNumber ?? "–"
                  )}
                </span>
                <span className="truncate flex-1">{ep.title}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{ep.duration}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
