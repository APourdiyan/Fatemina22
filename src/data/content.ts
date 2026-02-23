// Sample data for the platform
export interface TranscriptSegment {
  time: number; // seconds
  timeLabel: string;
  text: string;
}

export interface Reference {
  title: string;
  author: string;
  type: "book" | "article" | "hadith";
}

export interface Lecture {
  id: string;
  title: string;
  series: string;
  topic: string;
  mediaType: "audio" | "video" | "text";
  duration: string;
  date: string;
  description: string;
  episodeNumber?: number;
  location?: string;
  keyPoints?: string[];
  references?: Reference[];
  transcript?: TranscriptSegment[];
  tags?: string[];
}

export interface Quote {
  text: string;
  source: string;
}

export const dailyQuotes: Quote[] = [
  {
    text: "انسان باید هر روز خود را محاسبه کند و ببیند چقدر به خدا نزدیک‌تر شده است.",
    source: "سخنرانی اخلاقی - جلسه ۴۲",
  },
  {
    text: "علم بدون عمل، درختی بی‌ثمر است و عمل بدون علم، راهی بی‌نقشه.",
    source: "تفسیر سوره بقره - جلسه ۱۵",
  },
  {
    text: "هر لحظه‌ای که در آن از خدا غافل باشیم، لحظه‌ای از عمر ماست که هدر رفته است.",
    source: "شرح صحیفه سجادیه - جلسه ۸",
  },
];

export const topics = [
  { id: "ethics", label: "اخلاق", count: 245 },
  { id: "tafsir", label: "تفسیر", count: 180 },
  { id: "history", label: "تاریخ اسلام", count: 120 },
  { id: "fiqh", label: "فقه", count: 95 },
  { id: "hadith", label: "حدیث", count: 150 },
  { id: "philosophy", label: "فلسفه", count: 60 },
];

export const series = [
  { id: "sahifeh", label: "شرح صحیفه سجادیه", episodes: 52 },
  { id: "nahjul", label: "شرح نهج‌البلاغه", episodes: 120 },
  { id: "tafsir-quran", label: "تفسیر قرآن", episodes: 200 },
  { id: "akhlaq", label: "مباحث اخلاقی", episodes: 85 },
  { id: "tarikh", label: "تاریخ تحلیلی اسلام", episodes: 45 },
];

export const sampleLectures: Lecture[] = [
  {
    id: "1",
    title: "معنای حقیقی توکل بر خدا",
    series: "شرح صحیفه سجادیه",
    topic: "اخلاق",
    mediaType: "audio",
    duration: "۴۵:۳۰",
    date: "۱۴۰۳/۰۹/۱۵",
    description: "بررسی عمیق مفهوم توکل و تفاوت آن با تنبلی و بی‌تفاوتی در زندگی روزمره",
    episodeNumber: 23,
    location: "حسینیه ارشاد، تهران",
    tags: ["توکل", "ایمان", "زندگی"],
    keyPoints: [
      "تعریف دقیق توکل در قرآن کریم و روایات اهل‌بیت (ع)",
      "تفاوت توکل با تنبلی و سهل‌انگاری",
      "نقش توکل در آرامش روانی انسان مؤمن",
      "مراتب مختلف توکل از دیدگاه عرفا",
      "راهکارهای عملی تقویت حس توکل در زندگی روزمره",
    ],
    references: [
      { title: "صحیفه سجادیه", author: "امام سجاد (ع)", type: "hadith" },
      { title: "المیزان فی تفسیر القرآن", author: "علامه طباطبایی", type: "book" },
      { title: "منازل السائرین", author: "خواجه عبدالله انصاری", type: "book" },
    ],
    transcript: [
      { time: 0, timeLabel: "۰۰:۰۰", text: "بسم الله الرحمن الرحیم. سلام علیکم و رحمة الله و برکاته." },
      { time: 15, timeLabel: "۰۰:۱۵", text: "بحث امروز ما درباره یکی از مهم‌ترین مفاهیم قرآنی است، یعنی مفهوم توکل بر خداوند متعال." },
      { time: 45, timeLabel: "۰۰:۴۵", text: "در آیه شریفه می‌خوانیم: و من یتوکل علی الله فهو حسبه. هر کس بر خدا توکل کند، خدا برای او کافی است." },
      { time: 90, timeLabel: "۰۱:۳۰", text: "اما سؤال اصلی اینجاست: آیا توکل به معنای دست روی دست گذاشتن است؟ مسلماً خیر." },
      { time: 150, timeLabel: "۰۲:۳۰", text: "توکل یعنی تلاش کردن و نتیجه را به خدا سپردن. این همان چیزی است که پیامبر اکرم فرمودند." },
      { time: 210, timeLabel: "۰۳:۳۰", text: "در روایت آمده که شخصی خدمت رسول الله رسید و عرض کرد: شتر خود را رها کنم و توکل کنم؟" },
      { time: 270, timeLabel: "۰۴:۳۰", text: "حضرت فرمودند: اعقلها و توکل. یعنی اول شتر خود را ببند، سپس توکل کن." },
      { time: 330, timeLabel: "۰۵:۳۰", text: "این حدیث شریف به ما درس بزرگی می‌دهد: توکل بدون تلاش، توکل نیست بلکه تنبلی است." },
      { time: 420, timeLabel: "۰۷:۰۰", text: "خواجه عبدالله انصاری در منازل السائرین مراتب توکل را به سه درجه تقسیم می‌کند." },
      { time: 510, timeLabel: "۰۸:۳۰", text: "درجه اول: توکل عوام که همان اعتماد به خداوند در تأمین معاش و رفع مشکلات است." },
      { time: 600, timeLabel: "۱۰:۰۰", text: "درجه دوم: توکل خواص که سپردن تمام امور به خداوند و رضایت به قضای الهی است." },
      { time: 720, timeLabel: "۱۲:۰۰", text: "و در نهایت درجه سوم: توکل اهل معرفت که فنای در اراده الهی و مشاهده تدبیر اوست." },
    ],
  },
  {
    id: "2",
    title: "تفسیر آیات نور - جلسه اول",
    series: "تفسیر قرآن",
    topic: "تفسیر",
    mediaType: "video",
    duration: "۱:۱۲:۰۰",
    date: "۱۴۰۳/۰۹/۱۲",
    description: "شروع تفسیر سوره نور و بررسی زمینه‌های نزول و ارتباط آیات",
    episodeNumber: 1,
    location: "مسجد جامع، قم",
    tags: ["تفسیر", "سوره نور", "قرآن"],
    keyPoints: [
      "معرفی سوره نور و جایگاه آن در قرآن",
      "بررسی شأن نزول سوره و ارتباط آن با حوادث تاریخی",
      "تحلیل ساختار سوره و انسجام آیات",
    ],
    references: [
      { title: "المیزان فی تفسیر القرآن", author: "علامه طباطبایی", type: "book" },
      { title: "تفسیر نمونه", author: "آیت‌الله مکارم شیرازی", type: "book" },
    ],
    transcript: [
      { time: 0, timeLabel: "۰۰:۰۰", text: "بسم الله الرحمن الرحیم. سوره‌ای که امروز شروع به تفسیر آن می‌کنیم، سوره مبارکه نور است." },
      { time: 30, timeLabel: "۰۰:۳۰", text: "این سوره یکی از سوره‌های مدنی قرآن است که در آن احکام مهم اجتماعی بیان شده است." },
    ],
  },
  {
    id: "3",
    title: "نقش امام حسین (ع) در تحولات اجتماعی",
    series: "تاریخ تحلیلی اسلام",
    topic: "تاریخ اسلام",
    mediaType: "audio",
    duration: "۵۸:۱۵",
    date: "۱۴۰۳/۰۹/۱۰",
    description: "تحلیل جامعه‌شناختی قیام امام حسین و تأثیر آن بر جوامع اسلامی",
    episodeNumber: 12,
    location: "دانشگاه تهران",
    tags: ["امام حسین", "عاشورا", "تاریخ"],
    keyPoints: [
      "زمینه‌های اجتماعی و سیاسی قیام کربلا",
      "تأثیر عاشورا بر تحولات فرهنگی جهان اسلام",
      "درس‌های معاصر از نهضت حسینی",
    ],
    references: [
      { title: "لهوف", author: "سید ابن طاووس", type: "book" },
      { title: "مقتل الحسین", author: "ابومخنف", type: "book" },
    ],
  },
  {
    id: "4",
    title: "آداب دعا و مناجات",
    series: "مباحث اخلاقی",
    topic: "اخلاق",
    mediaType: "audio",
    duration: "۳۸:۴۵",
    date: "۱۴۰۳/۰۹/۰۸",
    description: "شرایط و آداب دعا کردن و چگونگی ارتباط معنوی با خداوند",
    episodeNumber: 34,
    tags: ["دعا", "مناجات", "اخلاق"],
    keyPoints: [
      "شرایط استجابت دعا در قرآن و روایات",
      "آداب ظاهری و باطنی دعا",
      "موانع استجابت دعا",
    ],
  },
  {
    id: "5",
    title: "فلسفه عبادت در اسلام",
    series: "مباحث اخلاقی",
    topic: "فلسفه",
    mediaType: "video",
    duration: "۱:۰۵:۲۰",
    date: "۱۴۰۳/۰۹/۰۵",
    description: "چرا عبادت می‌کنیم و فلسفه وجودی عبادات مختلف در اسلام",
    episodeNumber: 35,
    tags: ["عبادت", "فلسفه", "معرفت"],
    keyPoints: [
      "مفهوم عبادت از دیدگاه قرآن",
      "رابطه عبادت با معرفت الهی",
      "فلسفه تکرار در عبادات",
    ],
  },
  {
    id: "6",
    title: "تفسیر سوره یاسین - بخش دوم",
    series: "تفسیر قرآن",
    topic: "تفسیر",
    mediaType: "text",
    duration: "۲۰ دقیقه مطالعه",
    date: "۱۴۰۳/۰۹/۰۳",
    description: "ادامه تفسیر سوره یاسین با تمرکز بر داستان اصحاب قریه",
    episodeNumber: 45,
    tags: ["تفسیر", "سوره یاسین"],
    keyPoints: [
      "داستان اصحاب قریه و پیام‌های آن",
      "ارتباط داستان با وضعیت معاصر",
    ],
  },
  {
    id: "7",
    title: "حقوق متقابل زن و مرد",
    series: "مباحث اخلاقی",
    topic: "فقه",
    mediaType: "audio",
    duration: "۵۲:۱۰",
    date: "۱۴۰۳/۰۹/۰۱",
    description: "بررسی دیدگاه اسلام درباره حقوق خانواده و روابط زوجین",
    episodeNumber: 36,
    tags: ["خانواده", "فقه", "حقوق"],
    keyPoints: [
      "اصول حقوق خانواده در اسلام",
      "حقوق و وظایف متقابل زوجین",
    ],
  },
  {
    id: "8",
    title: "شرح خطبه متقین",
    series: "شرح نهج‌البلاغه",
    topic: "اخلاق",
    mediaType: "audio",
    duration: "۱:۲۰:۰۰",
    date: "۱۴۰۳/۰۸/۲۸",
    description: "تحلیل جامع خطبه متقین و ویژگی‌های انسان پرهیزگار",
    episodeNumber: 87,
    tags: ["نهج البلاغه", "تقوا", "اخلاق"],
    keyPoints: [
      "ویژگی‌های انسان متقی از زبان امیرالمؤمنین",
      "مراتب تقوا و سیر تکاملی آن",
      "مقایسه انسان متقی و انسان غافل",
    ],
    references: [
      { title: "نهج‌البلاغه", author: "امام علی (ع)", type: "hadith" },
      { title: "شرح نهج‌البلاغه", author: "ابن ابی‌الحدید", type: "book" },
    ],
  },
];

export const featuredCollections = [
  {
    id: "1",
    title: "شرح صحیفه سجادیه",
    description: "مجموعه کامل شرح دعاهای امام سجاد (ع)",
    lectureCount: 52,
    topic: "حدیث",
  },
  {
    id: "2",
    title: "اخلاق عملی",
    description: "راهنمای عملی سیر و سلوک اخلاقی",
    lectureCount: 85,
    topic: "اخلاق",
  },
  {
    id: "3",
    title: "تفسیر موضوعی قرآن",
    description: "تفسیر آیات قرآن به صورت موضوعی",
    lectureCount: 200,
    topic: "تفسیر",
  },
  {
    id: "4",
    title: "تاریخ تحلیلی صدر اسلام",
    description: "بررسی تحلیلی وقایع صدر اسلام",
    lectureCount: 45,
    topic: "تاریخ",
  },
];
