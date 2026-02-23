import { motion } from "framer-motion";
import { BookOpen, Headphones, Video, Clock, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { Lecture } from "@/data/content";

const mediaIcons = {
  audio: Headphones,
  video: Video,
  text: BookOpen,
};

const mediaLabels = {
  audio: "صوتی",
  video: "ویدیویی",
  text: "متنی",
};

interface ContentCardProps {
  lecture: Lecture;
  index: number;
}

export default function ContentCard({ lecture, index }: ContentCardProps) {
  const MediaIcon = mediaIcons[lecture.mediaType];

  return (
    <Link to={`/content/${lecture.id}`}>
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="content-card p-5 cursor-pointer group"
    >
      {/* Header: topic + media type */}
      <div className="flex items-center justify-between mb-3">
        <span className="category-chip">
          {lecture.topic}
        </span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MediaIcon className="w-3.5 h-3.5" />
          <span className="text-xs">{mediaLabels[lecture.mediaType]}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed">
        {lecture.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {lecture.description}
      </p>

      {/* Footer: meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{lecture.duration}</span>
        </div>
        {lecture.episodeNumber && (
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span>جلسه {lecture.episodeNumber}</span>
          </div>
        )}
        <span className="mr-auto text-muted-foreground/60">{lecture.date}</span>
      </div>

      {/* Series badge */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <span className="text-xs text-primary font-medium">{lecture.series}</span>
      </div>
    </motion.article>
    </Link>
  );
}
