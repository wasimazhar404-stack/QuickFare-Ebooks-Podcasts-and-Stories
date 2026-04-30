import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  BookCheck,
  Flame,
  FileText,
  Clock,
  Download,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Award,
  Star,
  Library,
  Heart,
  NotebookPen,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { books } from "@/data/books";
import type { Book } from "@/data/books";

/* ─────────────────────── demo data ─────────────────────── */
const DEMO_PROGRESS: Record<number, number> = {
  1: 34, 5: 67, 12: 12, 8: 89, 3: 100, 7: 100,
  15: 100, 22: 45, 30: 78, 45: 5, 50: 100, 60: 92,
};
const DEMO_COMPLETED = [3, 7, 15, 50, 60];
const DEMO_WISHLIST = [2, 9, 18, 25, 33, 41];
const DEMO_NOTES = [
  { id: 1, bookId: 1, page: 23, text: "The rituals of Hajj remind us of Ibrahim's unwavering faith and submission to Allah's will.", note: "Deep reflection on sacrifice", color: "#C9A84C", date: "2024-03-15" },
  { id: 2, bookId: 5, page: 89, text: "Artificial intelligence is not just a tool; it's a mirror reflecting human creativity and ambition.", note: "Key insight for my AI article", color: "#1E5C45", date: "2024-03-14" },
  { id: 3, bookId: 1, page: 45, text: "The standing at Arafah is the pinnacle of Hajj, a moment of complete surrender to the Creator.", note: "Must revisit this section", color: "#C9A84C", date: "2024-03-12" },
  { id: 4, bookId: 12, page: 5, text: "Seerah begins not with birth, but with the lineage that shaped the Prophet's noble character.", note: "Beautiful opening", color: "#B87333", date: "2024-03-10" },
  { id: 5, bookId: 8, page: 112, text: "Ramadan is the month in which the Quran was revealed as guidance for mankind.", note: "Share with family group", color: "#1E5C45", date: "2024-03-08" },
  { id: 6, bookId: 3, page: 200, text: "Understanding Umrah rituals transforms a physical journey into a deeply spiritual experience.", note: "Completed - excellent book", color: "#C9A84C", date: "2024-03-05" },
];
const DEMO_ACTIVITY = [
  { type: "completed" as const, bookId: 3, date: "2 days ago" },
  { type: "note" as const, bookId: 1, date: "3 days ago" },
  { type: "started" as const, bookId: 22, date: "1 week ago" },
  { type: "rated" as const, bookId: 7, date: "2 weeks ago" },
  { type: "wishlist" as const, bookId: 18, date: "2 weeks ago" },
  { type: "completed" as const, bookId: 15, date: "3 weeks ago" },
];

/* ─────────────────────── helpers ─────────────────────── */
const getBook = (id: number): Book | undefined => books.find((b) => b.id === id);

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * ease));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

/* Responsive Progress Ring */
const ProgressRing = ({ percent, className = "" }: { percent: number; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Mobile size (40px) / Desktop size (56px) */}
      <svg className="w-10 h-10 lg:w-14 lg:h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
        <circle
          cx="28" cy="28" r="24"
          stroke="#C9A84C" strokeWidth="3" fill="none"
          strokeDasharray={2 * Math.PI * 24}
          strokeDashoffset={2 * Math.PI * 24 * (1 - percent / 100)}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center rotate-90 text-[9px] lg:text-[10px] font-semibold text-white">
        {Math.round(percent)}%
      </span>
    </div>
  );
};

/* ─── CountUpStat component (hooks-safe) ─── */
function CountUpStat({ target, icon: Icon, color, label, sub }: { target: number; icon: React.ElementType; color: string; label: string; sub: string }) {
  const { val, ref } = useCountUp(target);
  return (
    <div className="flex flex-col items-center gap-1.5 lg:gap-2">
      <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${color}`} />
      <div ref={ref} className="font-outfit text-2xl lg:text-3xl font-bold text-white">{val}</div>
      <div className="text-center">
        <p className="text-xs lg:text-sm font-medium text-white">{label}</p>
        <p className="text-[10px] lg:text-xs text-[#A0A0B0]">{sub}</p>
      </div>
    </div>
  );
}

/* ─────────────────────── tabs ─────────────────────── */
type TabKey = "all" | "reading" | "completed" | "wishlist" | "notes";
const TAB_DEFS: { key: TabKey; label: string; labelUr: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Books", labelUr: "تمام کتابیں", icon: Library },
  { key: "reading", label: "Reading Now", labelUr: "اب پڑھ رہے ہیں", icon: BookOpen },
  { key: "completed", label: "Completed", labelUr: "مکمل", icon: BookCheck },
  { key: "wishlist", label: "Wishlist", labelUr: "خواہشات", icon: Heart },
  { key: "notes", label: "Notes", labelUr: "نوٹس", icon: NotebookPen },
];

/* ═══════════════════════ Library Page ═══════════════════════ */
export default function LibraryPage() {
  const language = useAppStore((s) => s.language);
  const watchlist = useAppStore((s) => s.watchlist);
  const storeProgress = useAppStore((s) => s.readingProgress);

  /* Merge store progress with demo progress for richness */
  const progress = useMemo(() => ({ ...DEMO_PROGRESS, ...storeProgress }), [storeProgress]);
  const readingIds = useMemo(() => Object.entries(progress).filter(([, p]) => p > 0 && p < 100).map(([id]) => Number(id)), [progress]);
  const completedIds = useMemo(() => DEMO_COMPLETED, []);
  const wishlistIds = useMemo(() => [...new Set([...DEMO_WISHLIST, ...watchlist])], [watchlist]);

  const [tab, setTab] = useState<TabKey>("all");
  const [noteSearch, setNoteSearch] = useState("");

  /* Simulated counts */
  const booksOwned = 47;
  const currentlyReading = readingIds.length;
  const completed = completedIds.length;
  const streak = 7;
  const totalPages = 2847;
  const totalHours = Math.round(totalPages * 1.5 / 60);

  const t = (en: string, ur: string) => (language === "ur" ? ur : en);

  const handleExportNotes = () => {
    const text = DEMO_NOTES.map((n) => {
      const b = getBook(n.bookId);
      return `Book: ${b?.title || "Unknown"}\nPage: ${n.page}\nHighlight: "${n.text}"\nNote: ${n.note}\nDate: ${n.date}\n---`;
    }).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quickfare-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-midnight text-white pt-16 lg:pt-20 pb-20 lg:pb-16">
      {/* ═══════ HEADER ═══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/pattern-islamic.svg')", backgroundSize: 200 }} />
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16 pt-8 lg:pt-12 pb-6 lg:pb-8 relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl lg:text-4xl md:text-5xl text-white mb-4 lg:mb-8"
          >
            {t("My Library", "میری لائبریری")}
          </motion.h1>

          {/* Stats Grid: 2x2 mobile, 5-across desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-midnight-100 rounded-xl p-4 lg:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-0 items-center"
          >
            <CountUpStat target={booksOwned} icon={Library} color="text-gold" label={t("Books", "کتابیں")} sub={t("Owned", "ملکیت")} />
            <div className="hidden md:block w-px h-14 bg-white/5 mx-auto" />
            <CountUpStat target={currentlyReading} icon={BookOpen} color="text-emerald-light" label={t("Active", "فعال")} sub={t("Reading", "پڑھنا")} />
            <div className="hidden md:block w-px h-14 bg-white/5 mx-auto" />
            <CountUpStat target={completed} icon={BookCheck} color="text-green-400" label={t("Done", "مکمل")} sub={t("Completed", "مکمل")} />
            <div className="hidden md:block w-px h-14 bg-white/5 mx-auto" />
            <CountUpStat target={streak} icon={Flame} color="text-orange-400" label={t("Streak", "مسلسل")} sub={t("Days", "دن")} />
            <div className="hidden md:block w-px h-14 bg-white/5 mx-auto" />
            <CountUpStat target={totalHours} icon={Clock} color="text-white" label={t("Hours", "گھنٹے")} sub={t("Read", "پڑھا")} />
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 lg:mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs lg:text-sm text-[#A0A0B0]">{t("Your reading goal: 50 books this year", "آپ کا پڑھنے کا ہدف: اس سال 50 کتابیں")}</span>
              <span className="text-xs lg:text-sm text-[#A0A0B0]">{booksOwned} / 50 &bull; 94%</span>
            </div>
            <div className="h-2 bg-midnight-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gold rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TABS ═══════ */}
      <section className="max-w-container-2xl mx-auto px-4 lg:px-16 pt-6 lg:pt-8 pb-12 lg:pb-16">
        {/* Scrollable pill tabs on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 lg:pb-4 mb-4 lg:mb-0 hide-scrollbar border-b border-white/5 snap-x snap-mandatory">
          {TAB_DEFS.map((tdef) => {
            const count =
              tdef.key === "all" ? booksOwned :
              tdef.key === "reading" ? currentlyReading :
              tdef.key === "completed" ? completed :
              tdef.key === "wishlist" ? wishlistIds.length :
              DEMO_NOTES.length;
            const isActive = tab === tdef.key;
            return (
              <button
                key={tdef.key}
                onClick={() => setTab(tdef.key)}
                className={`relative flex items-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-t-lg text-xs lg:text-sm font-medium transition-all shrink-0 snap-start min-h-[44px] ${
                  isActive ? "text-white bg-midnight-100" : "text-[#A0A0B0] hover:text-white hover:bg-white/5"
                }`}
              >
                <tdef.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="whitespace-nowrap">{language === "ur" ? tdef.labelUr : tdef.label}</span>
                <span className={`ml-0.5 lg:ml-1 text-[9px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-gold text-midnight" : "bg-white/10 text-[#A0A0B0]"}`}>
                  {count}
                </span>
                {isActive && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pt-4 lg:pt-6"
          >
            {/* ─── ALL BOOKS ─── */}
            {tab === "all" && (
              <div>
                {/* 2 cols mobile, 3 tablet, 4 desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
                  {[...readingIds, ...completedIds, ...wishlistIds].slice(0, 24).map((id, i) => {
                    const book = getBook(id);
                    if (!book) return null;
                    const p = progress[id] || 0;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link to={`/book/${book.id}`} className="block group">
                          <div className="relative rounded-lg overflow-hidden shadow-lg border border-transparent group-hover:border-gold/30 transition-all duration-300" style={{ aspectRatio: "2/3" }}>
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
                            {p > 0 && p < 100 && (
                              <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2">
                                <ProgressRing percent={p} className="w-8 h-8 lg:w-10 lg:h-10" />
                              </div>
                            )}
                            {p === 100 && (
                              <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-green-500/90 text-white text-[9px] lg:text-[10px] font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                                {t("DONE", "مکمل")}
                              </div>
                            )}
                            {!p && (
                              <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-red-500 text-white text-[9px] lg:text-[10px] font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full animate-pulse">
                                NEW
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
                              <h3 className="text-white font-playfair font-semibold text-xs lg:text-sm leading-tight line-clamp-2">{book.title}</h3>
                              <p className="text-[#A0A0B0] text-[10px] lg:text-[11px] mt-0.5">{book.subcategory}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="mt-8 lg:mt-12">
                  <h2 className="font-playfair text-xl lg:text-2xl text-white mb-4 lg:mb-6">{t("Recent Activity", "حالیہ سرگرمی")}</h2>
                  <div className="space-y-3 lg:space-y-4 max-w-2xl">
                    {DEMO_ACTIVITY.map((act, i) => {
                      const book = getBook(act.bookId);
                      if (!book) return null;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}
                          className="flex items-center gap-3 lg:gap-4 bg-midnight-100 rounded-xl p-3 lg:p-4 border border-white/5"
                        >
                          {/* Smaller avatar on mobile */}
                          <div className="w-9 h-12 lg:w-12 lg:h-16 rounded-md overflow-hidden shrink-0">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs lg:text-sm font-medium truncate">{book.title}</p>
                            <p className="text-[#A0A0B0] text-[11px] lg:text-xs">
                              {act.type === "completed" && t("Completed reading", "پڑھنا مکمل")}
                              {act.type === "note" && t("Added a note", "نوٹ شامل کیا")}
                              {act.type === "started" && t("Started reading", "پڑھنا شروع")}
                              {act.type === "rated" && t("Rated", "درجہ بندی")}
                              {act.type === "wishlist" && t("Added to wishlist", "خواہشات میں شامل")}
                              {" "}&bull;{" "}{act.date}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {act.type === "completed" && <BookCheck className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />}
                            {act.type === "note" && <NotebookPen className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />}
                            {act.type === "started" && <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-light" />}
                            {act.type === "rated" && <Star className="w-4 h-4 lg:w-5 lg:h-5 text-gold fill-gold" />}
                            {act.type === "wishlist" && <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── READING NOW ─── */}
            {tab === "reading" && (
              <div className="space-y-3 lg:space-y-4">
                {readingIds.length === 0 ? (
                  <EmptyState t={t} message={t("No books currently being read.", "اب کوئی کتاب نہیں پڑھی جا رہی۔")} />
                ) : (
                  readingIds.map((id, i) => {
                    const book = getBook(id);
                    if (!book) return null;
                    const p = progress[id] || 0;
                    const curPage = Math.round((p / 100) * book.pages);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex flex-col md:flex-row gap-4 lg:gap-5 bg-midnight-100 rounded-xl p-4 lg:p-5 border border-white/5 hover:border-gold/20 transition-colors"
                      >
                        <div className="shrink-0 w-[100px] h-[150px] lg:w-[120px] lg:h-[180px] rounded-lg overflow-hidden">
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-playfair text-lg lg:text-xl text-white mb-1">{book.title}</h3>
                            <p className="text-[#A0A0B0] text-xs lg:text-sm mb-2 lg:mb-3">{book.subtitle}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs lg:text-sm text-[#A0A0B0]">
                                {t("Page", "صفحہ")} {curPage} {t("of", "از")} {book.pages}
                              </span>
                              <span className="text-xs lg:text-sm text-gold font-semibold">{p}%</span>
                            </div>
                            <div className="h-1.5 bg-midnight-200 rounded-full overflow-hidden max-w-md">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${p}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-gold rounded-full"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 lg:gap-4 mt-3 lg:mt-4">
                            <button className="bg-gold text-midnight font-semibold px-4 lg:px-5 py-2 lg:py-2 rounded-full text-xs lg:text-sm hover:bg-gold-light transition-colors min-h-[40px]">
                              {t("Continue Reading", "پڑھنا جاری رکھیں")}
                            </button>
                            <button className="flex items-center gap-1.5 text-[#A0A0B0] hover:text-gold text-xs lg:text-sm transition-colors min-h-[40px] px-2">
                              <NotebookPen className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                              {t("Take Note", "نوٹ لیں")}
                            </button>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 text-xs lg:text-sm text-[#A0A0B0]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            <span>{Math.round(book.pages * 1.5 / 60)}h {Math.round((book.pages * 1.5) % 60)}m {t("total", "کل")}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            <span>{Math.ceil(Math.random() * 20 + 5)} {t("sessions", "سیشنز")}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            <span>{Math.ceil(Math.random() * 8 + 1)} {t("notes", "نوٹس")}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── COMPLETED ─── */}
            {tab === "completed" && (
              <div>
                <p className="text-[#A0A0B0] mb-4 lg:mb-6 text-sm lg:text-base">
                  {t("You completed", "آپ نے مکمل کیں")} <span className="text-white font-semibold">{completed}</span> {t("books this year", "اس سال کتابیں")}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
                  {completedIds.map((id, i) => {
                    const book = getBook(id);
                    if (!book) return null;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="group"
                      >
                        <Link to={`/book/${book.id}`} className="block">
                          <div className="relative rounded-lg overflow-hidden shadow-lg border border-transparent group-hover:border-gold/30 transition-all" style={{ aspectRatio: "2/3" }}>
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
                            <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-green-500/90 text-white text-[9px] lg:text-[10px] font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full flex items-center gap-1">
                              <BookCheck className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                              {t("DONE", "مکمل")}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
                              <h3 className="text-white font-playfair font-semibold text-xs lg:text-sm leading-tight line-clamp-2">{book.title}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${s <= 4 ? "text-gold fill-gold" : "text-white/20"}`} />
                                ))}
                                <span className="text-gold text-[10px] lg:text-[11px] font-semibold ml-1">{book.rating}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className="mt-1.5 lg:mt-2 text-center">
                          <p className="text-[#A0A0B0] text-[10px] lg:text-[11px]">{t("Completed March 2024", "مارچ 2024 میں مکمل")}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Genre breakdown */}
                <div className="mt-8 lg:mt-10 bg-midnight-100 rounded-xl p-4 lg:p-6 border border-white/5 max-w-lg">
                  <h3 className="font-playfair text-base lg:text-lg text-white mb-3 lg:mb-4">{t("Genre Breakdown", "زمرہ وار تقسیم")}</h3>
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1E5C45" strokeWidth="3.8" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C9A84C" strokeWidth="3.8"
                          strokeDasharray={`${2 * Math.PI * 15.9 * 0.33}`} strokeDashoffset={0} strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#1E5C45]" />
                        <span className="text-white">Islamic — 8 {t("books", "کتابیں")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-gold" />
                        <span className="text-white">Global — 4 {t("books", "کتابیں")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── WISHLIST ─── */}
            {tab === "wishlist" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
                {wishlistIds.map((id, i) => {
                  const book = getBook(id);
                  if (!book) return null;
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="group"
                    >
                      <div className="relative rounded-lg overflow-hidden shadow-lg border border-transparent group-hover:border-gold/30 transition-all" style={{ aspectRatio: "2/3" }}>
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
                        <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-white/10 backdrop-blur text-white text-[9px] lg:text-[10px] font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                          ₨{book.price}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
                          <h3 className="text-white font-playfair font-semibold text-xs lg:text-sm leading-tight line-clamp-2">{book.title}</h3>
                          <p className="text-[#A0A0B0] text-[10px] lg:text-[11px] mt-0.5">{book.subcategory}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-midnight/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-gold text-midnight font-semibold px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm hover:bg-gold-light transition-colors">
                            {t("Buy Now", "اب خریدیں")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ─── NOTES ─── */}
            {tab === "notes" && (
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                    <input
                      type="text"
                      placeholder={t("Search notes...", "نوٹس تلاش کریں...")}
                      value={noteSearch}
                      onChange={(e) => setNoteSearch(e.target.value)}
                      className="w-full bg-midnight-100 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#6B6B7B] focus:border-gold focus:outline-none min-h-[44px]"
                    />
                  </div>
                  <button
                    onClick={handleExportNotes}
                    className="flex items-center gap-2 border border-gold/40 text-gold rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gold/10 transition-colors shrink-0 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("Export All Notes", "تمام نوٹس ایکسپورٹ کریں")}</span>
                    <span className="sm:hidden">{t("Export", "ایکسپورٹ")}</span>
                  </button>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  {DEMO_NOTES.filter((n) => {
                    if (!noteSearch) return true;
                    const q = noteSearch.toLowerCase();
                    const b = getBook(n.bookId);
                    return n.text.toLowerCase().includes(q) || n.note.toLowerCase().includes(q) || (b?.title || "").toLowerCase().includes(q);
                  }).map((note, i) => {
                    const book = getBook(note.bookId);
                    if (!book) return null;
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="bg-midnight-100 rounded-xl p-4 lg:p-5 border border-white/5 hover:border-gold/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          <div className="w-10 h-14 lg:w-12 lg:h-16 rounded-md overflow-hidden shrink-0">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium text-xs lg:text-sm truncate pr-2">{book.title}</h4>
                              <span className="text-[#A0A0B0] text-[10px] lg:text-[11px] shrink-0">{t("Page", "صفحہ")} {note.page}</span>
                            </div>
                            <div
                              className="pl-2 lg:pl-3 border-l-[3px] py-1 my-2"
                              style={{ borderColor: note.color }}
                            >
                              <p className="text-[#A0A0B0] text-xs lg:text-sm italic line-clamp-2">&ldquo;{note.text}&rdquo;</p>
                            </div>
                            <p className="text-white text-xs lg:text-sm mb-2 lg:mb-3">{note.note}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B6B7B] text-[10px] lg:text-[11px]">{note.date}</span>
                              <div className="flex items-center gap-2">
                                <button className="text-[#A0A0B0] hover:text-gold transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="text-[#A0A0B0] hover:text-red-400 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="text-[#A0A0B0] hover:text-gold transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ─── ACHIEVEMENTS ─── */}
        <div className="mt-10 lg:mt-16 bg-midnight-100 rounded-2xl p-5 lg:p-8 border border-white/5">
          <h2 className="font-playfair text-xl lg:text-2xl text-white mb-4 lg:mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 lg:w-6 lg:h-6 text-gold" />
            {t("Your Achievements", "آپ کے اعزازات")}
          </h2>
          {/* 4-across on mobile */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: BookOpen, title: t("First Book", "پہلی کتاب"), desc: t("Read your first book", "اپنی پہلی کتاب پڑھیں"), unlocked: true },
              { icon: BookCheck, title: t("Bookworm", "کتاب بگولا"), desc: t("Read 10 books", "10 کتابیں پڑھیں"), unlocked: true },
              { icon: Award, title: t("Islamic Scholar", "اسلامی عالم"), desc: t("Read 5 Islamic books", "5 اسلامی کتابیں پڑھیں"), unlocked: true },
              { icon: Flame, title: t("Speed Reader", "تیز پڑھنے والا"), desc: t("100 pages in one session", "ایک سیشن میں 100 صفحات"), unlocked: true },
              { icon: NotebookPen, title: t("Note Taker", "نوٹ لینے والا"), desc: t("Add 50 notes", "50 نوٹس شامل کریں"), unlocked: false },
              { icon: Clock, title: t("Night Owl", "رات کا بوما"), desc: t("Read after 10 PM", "رات 10 بجے کے بعد پڑھیں"), unlocked: false },
              { icon: Star, title: t("Tech Guru", "ٹیک گرو"), desc: t("Read 3 AI/Tech books", "3 AI/ٹیک کتابیں پڑھیں"), unlocked: true },
              { icon: Heart, title: t("Early Bird", "صبح کا پرندہ"), desc: t("Read before 6 AM", "صبح 6 بجے سے پہلے پڑھیں"), unlocked: false },
            ].map((ach, i) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`flex flex-col items-center text-center p-3 lg:p-5 rounded-xl border transition-all ${
                  ach.unlocked
                    ? "bg-midnight border-gold/30 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
                    : "bg-midnight-200 border-white/5 opacity-60 grayscale"
                }`}
              >
                <div className={`w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mb-2 lg:mb-3 ${ach.unlocked ? "bg-gold/15" : "bg-white/5"}`}>
                  <ach.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${ach.unlocked ? "text-gold" : "text-[#6B6B7B]"}`} />
                </div>
                <p className={`text-[10px] lg:text-sm font-semibold ${ach.unlocked ? "text-white" : "text-[#6B6B7B]"}`}>{ach.title}</p>
                <p className="text-[9px] lg:text-[11px] text-[#A0A0B0] mt-0.5 lg:mt-1 hidden sm:block">{ach.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ t, message }: { t: (en: string, ur: string) => string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-20 text-center">
      <Library className="w-12 h-12 lg:w-16 lg:h-16 text-[#3A3A4A] mb-4" />
      <p className="text-[#A0A0B0] text-sm lg:text-lg mb-2">{message}</p>
      <Link to="/browse" className="mt-4 bg-gold text-midnight font-semibold px-5 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm hover:bg-gold-light transition-colors min-h-[40px] flex items-center">
        {t("Browse Collection", "مجموعہ دیکھیں")}
      </Link>
    </div>
  );
}
