import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Headphones,
  Video,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

const supabase = createClient(supabaseUrl, supabaseKey);

interface DashboardStats {
  totalContent: number;
  totalAudioHours: number;
  totalSeries: number;
  totalViews: number;
  contentByType: {
    audio: number;
    video: number;
    text: number;
  };
}

interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  details: any;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    totalAudioHours: 0,
    totalSeries: 0,
    totalViews: 0,
    contentByType: { audio: 0, video: 0, text: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: contentData } = await supabase
        .from("content")
        .select("media_type, duration_seconds, series, view_count");

      if (contentData) {
        const audioCount = contentData.filter((c) => c.media_type === "audio").length;
        const videoCount = contentData.filter((c) => c.media_type === "video").length;
        const textCount = contentData.filter((c) => c.media_type === "text").length;

        const totalSeconds = contentData.reduce(
          (sum, c) => sum + (c.duration_seconds || 0),
          0
        );
        const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

        const uniqueSeries = new Set(contentData.map((c) => c.series)).size;
        const totalViews = contentData.reduce((sum, c) => sum + (c.view_count || 0), 0);

        setStats({
          totalContent: contentData.length,
          totalAudioHours: totalHours,
          totalSeries: uniqueSeries,
          totalViews,
          contentByType: {
            audio: audioCount,
            video: videoCount,
            text: textCount,
          },
        });
      }

      const { data: activityData } = await supabase
        .from("admin_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (activityData) {
        setRecentActivity(activityData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "کل محتوا",
      value: stats.totalContent,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "ساعت صوتی",
      value: `${stats.totalAudioHours} ساعت`,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "سلسله‌مباحث",
      value: stats.totalSeries,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
    },
    {
      title: "کل بازدیدها",
      value: stats.totalViews.toLocaleString("fa-IR"),
      icon: Users,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
  ];

  const actionLabels: Record<string, string> = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
  };

  const entityLabels: Record<string, string> = {
    content: "محتوا",
    chapter: "فصل",
    transcript: "متن",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">خوش آمدید</h2>
        <p className="text-muted-foreground">
          خلاصه‌ای از فعالیت‌های پلتفرم و آمار کلی
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    {stat.title}
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                توزیع انواع محتوا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">صوتی</p>
                      <p className="text-xs text-muted-foreground">محتوای صوتی</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {stats.contentByType.audio}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Video className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">ویدیویی</p>
                      <p className="text-xs text-muted-foreground">محتوای تصویری</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {stats.contentByType.video}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">متنی</p>
                      <p className="text-xs text-muted-foreground">مقالات و نوشته‌ها</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {stats.contentByType.text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                فعالیت‌های اخیر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    هنوز فعالیتی ثبت نشده است
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">
                              {actionLabels[activity.action] || activity.action}
                            </span>{" "}
                            {entityLabels[activity.entity_type] || activity.entity_type}
                          </p>
                          {activity.details?.title && (
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.details.title}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.created_at).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
