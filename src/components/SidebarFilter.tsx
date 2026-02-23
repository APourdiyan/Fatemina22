import { useState } from "react";
import { motion } from "framer-motion";
import { topics, series } from "@/data/content";
import { BookOpen, Layers, ChevronDown, ChevronUp } from "lucide-react";

interface SidebarFilterProps {
  selectedTopic: string | null;
  selectedSeries: string | null;
  onTopicChange: (topic: string | null) => void;
  onSeriesChange: (series: string | null) => void;
}

export default function SidebarFilter({
  selectedTopic,
  selectedSeries,
  onTopicChange,
  onSeriesChange,
}: SidebarFilterProps) {
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [seriesOpen, setSeriesOpen] = useState(true);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="glass-card rounded-2xl p-5 sticky top-20">
        {/* Topics */}
        <button
          onClick={() => setTopicsOpen(!topicsOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            موضوعات
          </div>
          {topicsOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {topicsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-1 mb-6"
          >
            <button
              onClick={() => onTopicChange(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedTopic ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
              }`}
            >
              <span>همه موضوعات</span>
            </button>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => onTopicChange(t.id === selectedTopic ? null : t.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTopic === t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                }`}
              >
                <span>{t.label}</span>
                <span className={`text-xs ${selectedTopic === t.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Series */}
        <button
          onClick={() => setSeriesOpen(!seriesOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Layers className="w-4 h-4 text-accent" />
            سلسله‌مباحث
          </div>
          {seriesOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {seriesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-1"
          >
            {series.map((s) => (
              <button
                key={s.id}
                onClick={() => onSeriesChange(s.id === selectedSeries ? null : s.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSeries === s.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-xs ${selectedSeries === s.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {s.episodes} جلسه
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </aside>
  );
}
