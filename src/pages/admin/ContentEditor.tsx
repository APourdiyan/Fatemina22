import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

const supabase = createClient(supabaseUrl, supabaseKey);

interface ContentEditorProps {
  open: boolean;
  contentId: string | null;
  onClose: (refresh: boolean) => void;
}

interface ChapterData {
  id?: string;
  title: string;
  time_label: string;
  time_seconds: number;
}

interface FormData {
  title: string;
  slug: string;
  series: string;
  topic: string;
  media_type: "audio" | "video" | "text";
  media_url: string;
  duration: string;
  duration_seconds: number;
  date: string;
  description: string;
  episode_number: string;
  location: string;
  tags: string;
  key_points: string;
}

export default function ContentEditor({ open, contentId, onClose }: ContentEditorProps) {
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [newChapter, setNewChapter] = useState({ title: "", time_label: "" });

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      media_type: "audio",
      date: new Date().toLocaleDateString("fa-IR"),
    },
  });

  const mediaType = watch("media_type");

  useEffect(() => {
    if (open && contentId) {
      loadContent();
    } else if (open && !contentId) {
      reset({
        media_type: "audio",
        date: new Date().toLocaleDateString("fa-IR"),
      });
      setChapters([]);
    }
  }, [open, contentId]);

  const loadContent = async () => {
    if (!contentId) return;

    try {
      const { data: contentData, error: contentError } = await supabase
        .from("content")
        .select("*")
        .eq("id", contentId)
        .single();

      if (contentError) throw contentError;

      if (contentData) {
        reset({
          title: contentData.title,
          slug: contentData.slug,
          series: contentData.series,
          topic: contentData.topic,
          media_type: contentData.media_type,
          media_url: contentData.media_url || "",
          duration: contentData.duration || "",
          duration_seconds: contentData.duration_seconds || 0,
          date: contentData.date || "",
          description: contentData.description || "",
          episode_number: contentData.episode_number?.toString() || "",
          location: contentData.location || "",
          tags: Array.isArray(contentData.tags) ? contentData.tags.join(", ") : "",
          key_points: Array.isArray(contentData.key_points)
            ? contentData.key_points.join("\n")
            : "",
        });

        const { data: chaptersData } = await supabase
          .from("chapters")
          .select("*")
          .eq("content_id", contentId)
          .order("order_index");

        if (chaptersData) {
          setChapters(chaptersData);
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "خطا در بارگذاری",
        description: "بارگذاری اطلاعات با مشکل مواجه شد",
        variant: "destructive",
      });
    }
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const generateSlug = (title: string): string => {
    return title
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF\w-]/g, "")
      .substring(0, 100);
  };

  const addChapter = () => {
    if (!newChapter.title || !newChapter.time_label) {
      toast({
        title: "خطا",
        description: "لطفاً عنوان و زمان فصل را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    const timeSeconds = parseTimeToSeconds(newChapter.time_label);
    setChapters([
      ...chapters,
      {
        title: newChapter.title,
        time_label: newChapter.time_label,
        time_seconds: timeSeconds,
      },
    ]);
    setNewChapter({ title: "", time_label: "" });
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const slug = data.slug || generateSlug(data.title);
      const tags = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const keyPoints = data.key_points
        .split("\n")
        .map((k) => k.trim())
        .filter((k) => k);

      const contentPayload = {
        title: data.title,
        slug,
        series: data.series,
        topic: data.topic,
        media_type: data.media_type,
        media_url: data.media_url,
        duration: data.duration,
        duration_seconds: data.duration_seconds || parseTimeToSeconds(data.duration),
        date: data.date,
        description: data.description,
        episode_number: data.episode_number ? parseInt(data.episode_number) : null,
        location: data.location,
        tags,
        key_points: keyPoints,
      };

      let finalContentId = contentId;

      if (contentId) {
        const { error } = await supabase
          .from("content")
          .update(contentPayload)
          .eq("id", contentId);

        if (error) throw error;

        await supabase.from("chapters").delete().eq("content_id", contentId);

        await supabase.from("admin_activity").insert({
          action: "update",
          entity_type: "content",
          entity_id: contentId,
          details: { title: data.title },
        });
      } else {
        const { data: newContent, error } = await supabase
          .from("content")
          .insert(contentPayload)
          .select()
          .single();

        if (error) throw error;
        finalContentId = newContent.id;

        await supabase.from("admin_activity").insert({
          action: "create",
          entity_type: "content",
          entity_id: newContent.id,
          details: { title: data.title },
        });
      }

      if (chapters.length > 0 && finalContentId) {
        const chaptersPayload = chapters.map((chapter, index) => ({
          content_id: finalContentId,
          title: chapter.title,
          time_label: chapter.time_label,
          time_seconds: chapter.time_seconds,
          order_index: index,
        }));

        const { error: chaptersError } = await supabase
          .from("chapters")
          .insert(chaptersPayload);

        if (chaptersError) throw chaptersError;
      }

      toast({
        title: "موفقیت",
        description: contentId ? "محتوا با موفقیت به‌روزرسانی شد" : "محتوا با موفقیت ایجاد شد",
      });

      onClose(true);
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "خطا در ذخیره",
        description: "ذخیره محتوا با مشکل مواجه شد",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose(false)}>
      <SheetContent side="left" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{contentId ? "ویرایش محتوا" : "افزودن محتوای جدید"}</SheetTitle>
          <SheetDescription>
            اطلاعات کامل محتوا و فصل‌های آن را وارد کنید
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[calc(100vh-180px)] mt-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
                <TabsTrigger value="chapters">فصل‌ها</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان</Label>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                    placeholder="عنوان محتوا"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">نامک (Slug)</Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="به صورت خودکار از عنوان ساخته می‌شود"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="series">سلسله مباحث</Label>
                    <Input
                      id="series"
                      {...register("series", { required: true })}
                      placeholder="نام سلسله"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">موضوع</Label>
                    <Input
                      id="topic"
                      {...register("topic", { required: true })}
                      placeholder="موضوع اصلی"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="media_type">نوع محتوا</Label>
                    <Select
                      value={mediaType}
                      onValueChange={(value) =>
                        setValue("media_type", value as "audio" | "video" | "text")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">صوتی</SelectItem>
                        <SelectItem value="video">ویدیویی</SelectItem>
                        <SelectItem value="text">متنی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="episode_number">شماره جلسه</Label>
                    <Input
                      id="episode_number"
                      type="number"
                      {...register("episode_number")}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="media_url">لینک فایل</Label>
                  <Input
                    id="media_url"
                    {...register("media_url")}
                    placeholder="https://example.com/media.mp3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">مدت زمان</Label>
                    <Input
                      id="duration"
                      {...register("duration")}
                      placeholder="۴۵:۳۰"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">تاریخ</Label>
                    <Input id="date" {...register("date")} placeholder="۱۴۰۳/۰۹/۱۵" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">محل برگزاری</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="مسجد جامع، قم"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="توضیحات کامل محتوا"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">برچسب‌ها</Label>
                  <Input
                    id="tags"
                    {...register("tags")}
                    placeholder="برچسب۱, برچسب۲, برچسب۳"
                  />
                  <p className="text-xs text-muted-foreground">
                    برچسب‌ها را با کاما از هم جدا کنید
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key_points">نکات کلیدی</Label>
                  <Textarea
                    id="key_points"
                    {...register("key_points")}
                    placeholder="هر نکته در یک خط"
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="chapters" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      افزودن فصل جدید
                    </h3>
                    <div className="grid grid-cols-[1fr,auto,auto] gap-2">
                      <Input
                        placeholder="عنوان فصل"
                        value={newChapter.title}
                        onChange={(e) =>
                          setNewChapter({ ...newChapter, title: e.target.value })
                        }
                      />
                      <Input
                        placeholder="05:30"
                        value={newChapter.time_label}
                        onChange={(e) =>
                          setNewChapter({ ...newChapter, time_label: e.target.value })
                        }
                        className="w-24"
                      />
                      <Button type="button" onClick={addChapter} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      زمان را به فرمت MM:SS یا HH:MM:SS وارد کنید
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      فصل‌های اضافه شده ({chapters.length})
                    </h3>
                    {chapters.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        هنوز فصلی اضافه نشده است
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((chapter, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 rounded-lg border border-border bg-secondary/50"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {chapter.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {chapter.time_label}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeChapter(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "در حال ذخیره..." : contentId ? "به‌روزرسانی" : "ایجاد محتوا"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              انصراف
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
