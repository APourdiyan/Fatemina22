import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Headphones, Video, BookOpen } from "lucide-react";
import { sampleLectures } from "@/data/content";
import { usePlayer } from "@/contexts/PlayerContext";

const mediaIcons = {
  audio: Headphones,
  video: Video,
  text: BookOpen,
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { play } = usePlayer();

  const filtered = query.length > 0
    ? sampleLectures.filter(
        (l) =>
          l.title.includes(query) ||
          l.series.includes(query) ||
          l.topic.includes(query) ||
          l.description.includes(query)
      )
    : sampleLectures.slice(0, 5);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors text-sm w-full max-w-md"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-right">جستجو در آرشیو...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="عنوان، موضوع یا سلسله‌مباحث را جستجو کنید..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                  dir="rtl"
                />
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    نتیجه‌ای یافت نشد
                  </div>
                ) : (
                  filtered.map((lecture) => {
                    const Icon = mediaIcons[lecture.mediaType];
                    return (
                      <button
                        key={lecture.id}
                        onClick={() => {
                          play(lecture);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-right"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lecture.title}</p>
                          <p className="text-xs text-muted-foreground">{lecture.series} · {lecture.duration}</p>
                        </div>
                        <span className="category-chip text-[10px]">{lecture.topic}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
                <span>↵ برای انتخاب</span>
                <span>ESC برای بستن</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
