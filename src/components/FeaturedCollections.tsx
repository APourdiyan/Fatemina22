import { motion } from "framer-motion";
import { Library, ChevronLeft } from "lucide-react";
import { featuredCollections } from "@/data/content";

const topicColors: Record<string, string> = {
  "حدیث": "bg-primary/10 text-primary",
  "اخلاق": "bg-accent/10 text-accent",
  "تفسیر": "bg-emerald-glow/20 text-primary",
  "تاریخ": "bg-gold-muted text-gold",
};

export default function FeaturedCollections() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مجموعه‌های ویژه</h2>
          <p className="text-sm text-muted-foreground mt-1">
            دسترسی سریع به مهم‌ترین مجموعه‌های آموزشی
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          مشاهده همه
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredCollections.map((collection, i) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="content-card p-6 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${topicColors[collection.topic] || "bg-secondary text-secondary-foreground"}`}>
              <Library className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {collection.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {collection.description}
            </p>
            <span className="text-xs font-medium text-primary">
              {collection.lectureCount} جلسه
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
