import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { TranscriptSegment } from "@/data/content";
import { usePlayer } from "@/contexts/PlayerContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptPanelEnhancedProps {
  transcript: TranscriptSegment[];
  lectureId: string;
  currentTime: number;
}

export default function TranscriptPanelEnhanced({
  transcript,
  lectureId,
  currentTime,
}: TranscriptPanelEnhancedProps) {
  const { currentTrack, setProgress } = usePlayer();
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const activeSegmentRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isThisPlaying = currentTrack?.id === lectureId;

  useEffect(() => {
    if (!isThisPlaying || !transcript.length) return;

    let newActiveIndex = -1;
    for (let i = transcript.length - 1; i >= 0; i--) {
      if (currentTime >= transcript[i].time) {
        newActiveIndex = i;
        break;
      }
    }

    if (newActiveIndex !== activeSegment) {
      setActiveSegment(newActiveIndex);
    }
  }, [currentTime, isThisPlaying, transcript]);

  useEffect(() => {
    if (activeSegment !== null && activeSegmentRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeSegmentRef.current;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const isInView =
        elementRect.top >= containerRect.top &&
        elementRect.bottom <= containerRect.bottom;

      if (!isInView) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeSegment]);

  const handleJump = (segment: TranscriptSegment, index: number) => {
    setActiveSegment(index);
    if (isThisPlaying && currentTrack) {
      const lastSegment = transcript[transcript.length - 1];
      const maxTime = lastSegment?.time || 2700;
      const progress = (segment.time / maxTime) * 100;
      setProgress(progress, segment.time);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-accent" />
        متن سخنرانی
      </h2>

      <div className="glass-card rounded-xl overflow-hidden">
        <ScrollArea className="h-[500px]" ref={scrollContainerRef}>
          <div className="p-4 space-y-1">
            {transcript.map((seg, i) => {
              const isCurrent = activeSegment === i && isThisPlaying;

              return (
                <button
                  key={i}
                  ref={isCurrent ? activeSegmentRef : null}
                  onClick={() => handleJump(seg, i)}
                  className={`w-full text-right flex gap-3 p-3 rounded-lg transition-all group ${
                    isCurrent
                      ? "bg-primary/10 border-r-2 border-primary scale-[1.01]"
                      : "hover:bg-secondary/80"
                  }`}
                >
                  <span
                    className={`text-xs font-mono flex-shrink-0 mt-0.5 px-2 py-0.5 rounded ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {seg.timeLabel}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      isCurrent
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {seg.text}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </motion.section>
  );
}
