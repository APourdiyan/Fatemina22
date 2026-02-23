import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import ContentCard from "@/components/ContentCard";
import { sampleLectures } from "@/data/content";

export default function Index() {
  const latestLectures = sampleLectures.slice(0, 4);

  return (
    <div className="space-y-8 pb-32">
      <HeroSection />

      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <FeaturedCollections />

        {/* Latest lectures */}
        <section className="py-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">آخرین سخنرانی‌ها</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestLectures.map((lecture, i) => (
              <ContentCard key={lecture.id} lecture={lecture} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
