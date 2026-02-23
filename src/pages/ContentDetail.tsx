import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  Download,
  Heart,
  Link2,
  Clock,
  CalendarDays,
  MapPin,
  BookOpen,
  ChevronLeft,
  Headphones,
  Video,
  Hash,
  Quote,
  Share2,
  RotateCcw,
} from "lucide-react";
import { sampleLectures, Lecture } from "@/data/content";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import ContentSEO from "@/components/ContentSEO";
import SeriesEpisodeList from "@/components/SeriesEpisodeList";
import TranscriptPanelEnhanced from "@/components/TranscriptPanelEnhanced";
import KnowledgePanel from "@/components/KnowledgePanel";
import RelatedContent from "@/components/RelatedContent";
import ChaptersList from "@/components/ChaptersList";
import { createClient } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

const supabase = createClient(supabaseUrl, supabaseKey);

const mediaIcons = { audio: Headphones, video: Video, text: BookOpen };
const mediaLabels = { audio: "صوتی", video: "ویدیویی", text: "متنی" };

interface Chapter {
  id: string;
  title: string;
  time_seconds: number;
  time_label: string;
}

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const lecture = sampleLectures.find((l) => l.id === id);
  const { play, togglePlay, currentTrack, isPlaying, getSavedProgress, currentTime } = usePlayer();
  const [savedProgress, setSavedProgress] = useState<any>(null);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (lecture) {
      checkSavedProgress();
      loadChapters();
    }
  }, [lecture?.id]);

  const checkSavedProgress = async () => {
    if (!lecture) return;
    const progress = await getSavedProgress(lecture.id);
    if (progress && progress.progress > 5 && progress.progress < 95) {
      setSavedProgress(progress);
      setShowResumeDialog(true);
    }
  };

  const loadChapters = async () => {
    if (!lecture) return;
    try {
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .eq("content_id", lecture.id)
        .order("order_index");

      if (data && data.length > 0) {
        setChapters(data);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">محتوا یافت نشد</h2>
          <Link to="/archive" className="text-primary hover:underline">
            بازگشت به آرشیو
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentlyPlaying = currentTrack?.id === lecture.id && isPlaying;
  const MediaIcon = mediaIcons[lecture.mediaType];

  const seriesLectures = sampleLectures.filter((l) => l.series === lecture.series);
  const relatedLectures = sampleLectures
    .filter(
      (l) =>
        l.id !== lecture.id &&
        (l.topic === lecture.topic || l.tags?.some((t) => lecture.tags?.includes(t)))
    )
    .slice(0, 4);

  const handlePlay = () => {
    if (currentTrack?.id === lecture.id) {
      togglePlay();
    } else {
      play(lecture);
      setShowResumeDialog(false);
    }
  };

  const handleResume = () => {
    if (savedProgress) {
      play(lecture, savedProgress.progress);
      setShowResumeDialog(false);
      toast({
        title: "ادامه پخش",
        description: `از دقیقه ${Math.floor(savedProgress.currentTime / 60)} ادامه می‌یابد`,
      });
    }
  };

  const handleStartFresh = () => {
    play(lecture, 0);
    setShowResumeDialog(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "لینک کپی شد",
      description: "لینک این محتوا در کلیپ‌بورد کپی شد",
    });
  };

  const handleCopyCitation = () => {
    const citation = `${lecture.title}، ${lecture.series}، آیت‌الله فاطمی‌نیا، ${lecture.date}، ${window.location.href}`;
    navigator.clipboard.writeText(citation);
    toast({
      title: "استناد کپی شد",
      description: "فرمت استناد در کلیپ‌بورد کپی شد",
    });
  };

  const handleChapterClick = (timeSeconds: number) => {
    if (currentTrack?.id === lecture.id) {
      const duration = lecture.transcript?.[lecture.transcript.length - 1]?.time || 2700;
      const progress = (timeSeconds / duration) * 100;
      play(lecture, progress);
    } else {
      const duration = lecture.transcript?.[lecture.transcript.length - 1]?.time || 2700;
      const progress = (timeSeconds / duration) * 100;
      play(lecture, progress);
    }
    toast({
      title: "پرش به فصل",
      description: "پخش از این نقطه آغاز شد",
    });
  };

  return (
    <>
      <ContentSEO lecture={lecture} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen pb-32"
      >
        <div className="bg-secondary/50 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <nav
              className="flex items-center gap-2 text-sm text-muted-foreground"
              aria-label="breadcrumb"
            >
              <Link to="/" className="hover:text-foreground transition-colors">
                خانه
              </Link>
              <ChevronLeft className="w-3.5 h-3.5" />
              <Link to="/archive" className="hover:text-foreground transition-colors">
                {lecture.topic}
              </Link>
              <ChevronLeft className="w-3.5 h-3.5" />
              <Link to="/archive" className="hover:text-foreground transition-colors">
                {lecture.series}
              </Link>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {lecture.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="gap-1">
                    <MediaIcon className="w-3.5 h-3.5" />
                    {mediaLabels[lecture.mediaType]}
                  </Badge>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {lecture.topic}
                  </Badge>
                  {lecture.episodeNumber && (
                    <Badge variant="outline" className="gap-1">
                      <Hash className="w-3 h-3" />
                      جلسه {lecture.episodeNumber}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-relaxed mb-4">
                  {lecture.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {lecture.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{lecture.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>{lecture.date}</span>
                  </div>
                  {lecture.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{lecture.location}</span>
                    </div>
                  )}
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {lecture.series}
                  </span>
                </div>
              </motion.header>

              <Separator className="mb-8" />

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative rounded-2xl overflow-hidden emerald-gradient p-8 md:p-12">
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)`,
                      }}
                    />
                  </div>

                  <div className="relative flex flex-col items-center text-center gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
                      <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-primary-foreground/60" />
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
                        {lecture.title}
                      </h2>
                      <p className="text-primary-foreground/70 text-sm">{lecture.series}</p>
                    </div>

                    <Button
                      onClick={handlePlay}
                      size="lg"
                      className="rounded-full px-8 gap-2 gold-gradient text-accent-foreground border-0 shadow-lg hover:opacity-90"
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          توقف
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          پخش
                        </>
                      )}
                    </Button>

                    {isCurrentlyPlaying && (
                      <div className="flex items-end gap-1 h-8">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-gold-light rounded-full"
                            animate={{
                              height: [8, 20 + Math.random() * 12, 8],
                            }}
                            transition={{
                              duration: 0.6 + Math.random() * 0.4,
                              repeat: Infinity,
                              delay: i * 0.05,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  دانلود
                </Button>
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  علاقه‌مندی
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleCopyLink}>
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleCopyCitation}>
                  <Quote className="w-4 h-4" />
                  کپی استناد
                </Button>
              </motion.div>

              <Separator className="mb-8" />

              {chapters.length > 0 && (
                <ChaptersList
                  chapters={chapters}
                  onChapterClick={handleChapterClick}
                  currentTime={currentTime}
                  isPlaying={isCurrentlyPlaying}
                />
              )}

              <KnowledgePanel lecture={lecture} />

              {lecture.transcript && lecture.transcript.length > 0 && (
                <TranscriptPanelEnhanced
                  transcript={lecture.transcript}
                  lectureId={lecture.id}
                  currentTime={currentTime}
                />
              )}

              {relatedLectures.length > 0 && <RelatedContent lectures={relatedLectures} />}
            </div>

            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {seriesLectures.length > 1 && (
                  <SeriesEpisodeList
                    seriesName={lecture.series}
                    episodes={seriesLectures}
                    currentId={lecture.id}
                  />
                )}

                {lecture.tags && lecture.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl p-5"
                  >
                    <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-accent" />
                      برچسب‌ها
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lecture.tags.map((tag) => (
                        <span key={tag} className="category-chip text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              ادامه پخش
            </AlertDialogTitle>
            <AlertDialogDescription>
              شما قبلاً این محتوا را تا دقیقه{" "}
              {savedProgress && Math.floor(savedProgress.currentTime / 60)} گوش داده‌اید. می‌خواهید
              از همان نقطه ادامه دهید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStartFresh}>
              از ابتدا پخش کن
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResume}>ادامه پخش</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
