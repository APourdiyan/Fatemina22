import { motion } from "framer-motion";
import { Lightbulb, BookMarked } from "lucide-react";
import { Lecture } from "@/data/content";

interface KnowledgePanelProps {
  lecture: Lecture;
}

const refTypeLabels = { book: "کتاب", article: "مقاله", hadith: "حدیث" };

export default function KnowledgePanel({ lecture }: KnowledgePanelProps) {
  const hasKeyPoints = lecture.keyPoints && lecture.keyPoints.length > 0;
  const hasReferences = lecture.references && lecture.references.length > 0;

  if (!hasKeyPoints && !hasReferences) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 space-y-6"
    >
      {/* Key Points */}
      {hasKeyPoints && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            نکات کلیدی
          </h2>
          <div className="glass-card rounded-xl p-5">
            <ul className="space-y-3">
              {lecture.keyPoints!.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* References */}
      {hasReferences && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-accent" />
            منابع و مراجع
          </h2>
          <div className="glass-card rounded-xl p-5">
            <div className="space-y-3">
              {lecture.references!.map((ref, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ref.title}</p>
                    <p className="text-xs text-muted-foreground">{ref.author} · {refTypeLabels[ref.type]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
