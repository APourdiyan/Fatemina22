import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Headphones,
  Video,
  BookOpen,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";
import ContentEditor from "./ContentEditor";
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

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  series: string;
  topic: string;
  media_type: "audio" | "video" | "text";
  duration: string;
  episode_number: number;
  view_count: number;
  created_at: string;
}

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

export default function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, filterType]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setContent(data || []);
    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "خطا در بارگذاری",
        description: "بارگذاری محتوا با مشکل مواجه شد",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.includes(searchQuery) ||
          item.series.includes(searchQuery) ||
          item.topic.includes(searchQuery)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.media_type === filterType);
    }

    setFilteredContent(filtered);
  };

  const handleCreate = () => {
    setEditingId(null);
    setEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase.from("content").delete().eq("id", deletingId);

      if (error) throw error;

      await supabase.from("admin_activity").insert({
        action: "delete",
        entity_type: "content",
        entity_id: deletingId,
        details: {},
      });

      toast({
        title: "حذف موفق",
        description: "محتوا با موفقیت حذف شد",
      });

      loadContent();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "خطا در حذف",
        description: "حذف محتوا با مشکل مواجه شد",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleEditorClose = (refresh: boolean) => {
    setEditorOpen(false);
    setEditingId(null);
    if (refresh) {
      loadContent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مدیریت محتوا</h2>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت و ویرایش کامل محتوای پلتفرم
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          افزودن محتوا
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در عنوان، سلسله یا موضوع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="نوع محتوا" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="audio">صوتی</SelectItem>
            <SelectItem value="video">ویدیویی</SelectItem>
            <SelectItem value="text">متنی</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground mt-4">در حال بارگذاری...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {searchQuery || filterType !== "all"
                ? "نتیجه‌ای یافت نشد"
                : "هنوز محتوایی اضافه نشده است"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عنوان</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">موضوع</TableHead>
                <TableHead className="text-right">سلسله</TableHead>
                <TableHead className="text-right">جلسه</TableHead>
                <TableHead className="text-right">بازدید</TableHead>
                <TableHead className="text-right w-20">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => {
                const Icon = mediaIcons[item.media_type];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{item.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Icon className="w-3 h-3" />
                        {mediaLabels[item.media_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{item.topic}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.series}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{item.episode_number || "–"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{item.view_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>

      <ContentEditor
        open={editorOpen}
        contentId={editingId}
        onClose={handleEditorClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف محتوا</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این محتوا اطمینان دارید؟ این عملیات قابل بازگشت نیست و تمام
              داده‌های مرتبط از جمله فصل‌ها و متن نیز حذف خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
