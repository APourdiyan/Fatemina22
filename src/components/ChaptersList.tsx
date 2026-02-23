import { motion } from "framer-motion";
import { ListOrdered, Play, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chapter {
  id: string;
  title: string;
  time_seconds: number;
  time_label: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
  onChapterClick: (timeSeconds: number) => void;
  currentTime: number;
  isPlaying: boolean;
}

export default function ChaptersList({
  chapters,
  onChapterClick,
  currentTime,
  isPlaying,
}: ChaptersListProps) {
  const getCurrentChapterIndex = () => {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].time_seconds) {
        return i;
      }
    }
    return -1;
  };

  const currentChapterIndex = isPlaying ? getCurrentChapterIndex() : -1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <ListOrdered className="w-5 h-5 text-accent" />
        فصل‌های محتوا ({chapters.length})
      </h2>

      <div className="glass-card rounded-xl overflow-hidden">
        <ScrollArea className="max-h-96">
          <div className="p-2">
            {chapters.map((chapter, index) => {
              const isCurrent = index === currentChapterIndex;
              const isPassed = currentTime > chapter.time_seconds;

              return (
                <button
                  key={chapter.id}
                  onClick={() => onChapterClick(chapter.time_seconds)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-all group ${
                    isCurrent
                      ? "bg-primary/10 border-r-2 border-primary"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrent
                        ? "emerald-gradient text-primary-foreground"
                        : isPassed
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCurrent ? (
                      <Play className="w-4 h-4" />
                    ) : isPassed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-mono">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isCurrent ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {chapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{chapter.time_label}</p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isCurrent ? "opacity-100" : ""
                    }`}
                  >
                    <Play className="w-3 h-3 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </motion.section>
  );
}
