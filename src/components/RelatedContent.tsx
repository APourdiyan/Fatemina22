import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Clock, Headphones, Video, BookOpen } from "lucide-react";
import { Lecture } from "@/data/content";

const mediaIcons = { audio: Headphones, video: Video, text: BookOpen };

interface RelatedContentProps {
  lectures: Lecture[];
}

export default function RelatedContent({ lectures }: RelatedContentProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        محتوای مرتبط
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lectures.map((lecture, i) => {
          const MediaIcon = mediaIcons[lecture.mediaType];
          return (
            <Link
              key={lecture.id}
              to={`/content/${lecture.id}`}
              className="content-card p-4 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <MediaIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {lecture.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{lecture.series}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{lecture.duration}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
