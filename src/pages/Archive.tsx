import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SidebarFilter from "@/components/SidebarFilter";
import ContentCard from "@/components/ContentCard";
import SkeletonCard from "@/components/SkeletonCard";
import { sampleLectures, topics, series as seriesData } from "@/data/content";

export default function Archive() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [selectedTopic, selectedSeries]);

  const filtered = sampleLectures.filter((l) => {
    if (selectedTopic) {
      const topicLabel = topics.find((t) => t.id === selectedTopic)?.label;
      if (l.topic !== topicLabel) return false;
    }
    if (selectedSeries) {
      const seriesLabel = seriesData.find((s) => s.id === selectedSeries)?.label;
      if (l.series !== seriesLabel) return false;
    }
    return true;
  });

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto py-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">آرشیو سخنرانی‌ها</h1>
        <p className="text-muted-foreground">
          جستجو و مرور در مجموعه کامل سخنرانی‌ها، مقالات و ویدیوها
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - right side in RTL */}
        <SidebarFilter
          selectedTopic={selectedTopic}
          selectedSeries={selectedSeries}
          onTopicChange={setSelectedTopic}
          onSeriesChange={setSelectedSeries}
        />

        {/* Content grid */}
        <div className="flex-1">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {loading ? "در حال بارگذاری..." : `${filtered.length} نتیجه`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">نتیجه‌ای برای این فیلتر یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((lecture, i) => (
                <ContentCard key={lecture.id} lecture={lecture} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
