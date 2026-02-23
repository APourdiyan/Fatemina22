import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { TranscriptSegment } from "@/data/content";
import { usePlayer } from "@/contexts/PlayerContext";

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  lectureId: string;
}

export default function TranscriptPanel({ transcript, lectureId }: TranscriptPanelProps) {
  const { currentTrack, setProgress } = usePlayer();
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const isThisPlaying = currentTrack?.id === lectureId;

  const handleJump = (segment: TranscriptSegment, index: number) => {
    setActiveSegment(index);
    if (isThisPlaying) {
      // Simulate jump by setting progress proportionally
      const maxTime = transcript[transcript.length - 1].time || 1;
      setProgress((segment.time / maxTime) * 100);
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

      <div className="glass-card rounded-xl p-5 space-y-1">
        {transcript.map((seg, i) => (
          <button
            key={i}
            onClick={() => handleJump(seg, i)}
            className={`w-full text-right flex gap-3 p-3 rounded-lg transition-all group ${
              activeSegment === i
                ? "bg-primary/10 border-r-2 border-primary"
                : "hover:bg-secondary/80"
            }`}
          >
            <span className={`text-xs font-mono flex-shrink-0 mt-0.5 px-2 py-0.5 rounded ${
              activeSegment === i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}>
              {seg.timeLabel}
            </span>
            <span className={`text-sm leading-relaxed ${
              activeSegment === i ? "text-foreground font-medium" : "text-muted-foreground"
            }`}>
              {seg.text}
            </span>
          </button>
        ))}
      </div>
    </motion.section>
  );
}
