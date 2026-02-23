import { Lecture } from "@/data/content";
import { useEffect } from "react";

interface ContentSEOProps {
  lecture: Lecture;
}

export default function ContentSEO({ lecture }: ContentSEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${lecture.title} | میراث دیجیتال فاطمی‌نیا`;

    // Update/create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", lecture.description.slice(0, 155));

    // JSON-LD Schema
    const schemaType = lecture.mediaType === "text" ? "Article" : "AudioObject";
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: lecture.title,
      description: lecture.description,
      ...(lecture.mediaType !== "text" && { duration: lecture.duration }),
      datePublished: lecture.date,
      author: { "@type": "Person", name: "آیت‌الله فاطمی‌نیا" },
      isPartOf: { "@type": "CreativeWorkSeries", name: lecture.series },
      inLanguage: "fa",
    };

    let scriptTag = document.querySelector('script[data-schema="content"]');
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      scriptTag.setAttribute("data-schema", "content");
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      document.title = "میراث دیجیتال فاطمی‌نیا";
      scriptTag?.remove();
    };
  }, [lecture]);

  return null;
}
