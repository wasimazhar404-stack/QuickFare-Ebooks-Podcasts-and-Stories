import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  ChevronRight,
  Eye,
  CheckCircle,
  Zap,
  Infinity,
  Shield,
  FileText,
  Globe,
  Calendar,
  ThumbsUp,
  Copy,
  Check,
  Facebook,
  Twitter,
  Phone,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { books, type Book } from "@/data/books";
import { useAppStore } from "@/store/useAppStore";
import BookCard from "@/components/BookCard";

/* ───────── helpers ───────── */
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === Number(id));
}

function getRelatedBooks(book: Book, count = 10): Book[] {
  const sameCategory = books.filter(
    (b) => b.id !== book.id && (b.category === book.category || b.subcategory === book.subcategory)
  );
  const similar = books.filter(
    (b) =>
      b.id !== book.id &&
      !sameCategory.includes(b) &&
      b.tags.some((t) => book.tags.includes(t))
  );
  return [...sameCategory, ...similar].slice(0, count);
}

function getAuthorBooks(book: Book, count = 6): Book[] {
  return books
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, count);
}

function formatPrice(price: number) {
  return `₨${Math.round(price).toLocaleString("en-IN")}`;
}

function StarRating({ rating, size = 20, className = "" }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
        >
          <Star
            size={size}
            className={i < Math.floor(rating) ? "text-gold fill-gold" : "text-midnight-400 fill-midnight-400"}
          />
        </motion.div>
      ))}
    </div>
  );
}

function generateChapters(pages: number) {
  const chapterCount = Math.max(5, Math.min(15, Math.floor(pages / 25)));
  const titles = [
    "Introduction & Overview",
    "Preparing for the Journey",
    "Understanding the Basics",
    "Step-by-Step Guide",
    "Essential Tips & Tricks",
    "Common Mistakes to Avoid",
    "Advanced Techniques",
    "Practical Applications",
    "Case Studies & Examples",
    "Resources & References",
    "Frequently Asked Questions",
    "Glossary of Terms",
    "Appendix: Checklists",
    "Final Thoughts",
    "About the Author",
  ];
  const chapters = [];
  let currentPage = 1;
  for (let i = 0; i < chapterCount; i++) {
    const chapterPages = Math.floor(pages / chapterCount);
    const endPage = Math.min(currentPage + chapterPages - 1, pages);
    chapters.push({
      number: i + 1,
      title: titles[i] || `Chapter ${i + 1}`,
      pageStart: currentPage,
      pageEnd: endPage,
      hasPreview: i < 3,
    });
    currentPage = endPage + 1;
  }
  return chapters;
}

const REVIEW_DATA = [
  { name: "Ahmad R.", avatar: "AR", rating: 5, date: "2 weeks ago", title: "Absolutely essential guide", body: "This book transformed my understanding of the subject. The step-by-step approach is incredibly helpful.", helpful: 24 },
  { name: "Fatima K.", avatar: "FK", rating: 5, date: "1 month ago", title: "Well researched and practical", body: "I appreciate how the author combines scholarly knowledge with practical tips. Highly recommended.", helpful: 18 },
  { name: "Usman M.", avatar: "UM", rating: 4, date: "3 weeks ago", title: "Great content, could use more visuals", body: "The content is excellent but I wish there were more diagrams and illustrations.", helpful: 12 },
  { name: "Zainab A.", avatar: "ZA", rating: 5, date: "2 months ago", title: "A must-read for everyone", body: "Whether you are a beginner or advanced, this book has something for everyone.", helpful: 31 },
  { name: "Bilal H.", avatar: "BH", rating: 4, date: "1 week ago", title: "Informative and engaging", body: "Could not put it down. The writing style makes complex topics accessible.", helpful: 8 },
];

const RATING_BREAKDOWN = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

/* ───────── toast hook ───────── */
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(t);
  }, [msg]);
  return { msg, show: setMsg };
}

/* ════════════════════════════════
   BookDetail Page — Mobile First
   ════════════════════════════════ */
export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = getBookById(id || "1");

  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const isInWatchlist = useAppStore((s) => s.isInWatchlist(Number(id)));
  const getProgress = useAppStore((s) => s.getProgress(Number(id)));
  const progress = getProgress;

  const [activeTab, setActiveTab] = useState<"synopsis" | "chapters" | "reviews" | "details">("synopsis");
  const [coverTilt, setCoverTilt] = useState({ x: 0, y: 0 });
  const coverRef = useRef<HTMLDivElement>(null);
  const { msg, show } = useToast();
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(3);
  const [scrolled, setScrolled] = useState(false);

  const chapters = useMemo(() => (book ? generateChapters(book.pages) : []), [book]);
  const relatedBooks = useMemo(() => (book ? getRelatedBooks(book) : []), [book]);
  const authorBooks = useMemo(() => (book ? getAuthorBooks(book) : []), [book]);

  /* Hide tab bar on scroll (mobile) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!coverRef.current) return;
      const rect = coverRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      setCoverTilt({ x: clamp(y, -5, 5), y: clamp(x, -5, 5) });
    },
    []
  );

  const handleMouseLeave = useCallback(() => setCoverTilt({ x: 0, y: 0 }), []);

  if (!book) {
    return (
      <div className="min-h-screen bg-midnight pt-24 pb-16 flex flex-col items-center justify-center px-4">
        <h1 className="font-playfair text-3xl sm:text-4xl text-white mb-4 text-center">Book Not Found</h1>
        <Link to="/browse" className="text-gold hover:underline">Browse Books</Link>
      </div>
    );
  }

  const toggleWishlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(book.id);
      show("Removed from Library");
    } else {
      addToWatchlist(book.id);
      show("Added to Library");
    }
    setWishlistPulse(true);
    setTimeout(() => setWishlistPulse(false), 300);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out "${book.title}" on QuickFare!`;
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const originalPrice = book.price * 1.5;
  const discount = Math.round(((originalPrice - book.price) / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 bg-gold text-midnight px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg text-sm sm:text-base whitespace-nowrap"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HERO — Mobile: stacked, cover on top ═══════ */}
      <section className="relative min-h-[auto] sm:min-h-[85vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={book.cover}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "blur(2px)" }}
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.75) 50%, rgba(10,10,15,0.5) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
        </div>

        {/* Content — Mobile: stacked, cover first */}
        <div className="relative z-10 max-w-container-2xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-10 sm:pb-16">
          <div className="flex flex-col lg:grid lg:grid-cols-[55%_45%] gap-6 sm:gap-12 items-center">

            {/* MOBILE FIRST: Cover Art (order-1 on mobile) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 flex flex-col items-center perspective-1000 w-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={coverRef}
                className="relative preserve-3d"
                style={{
                  transform: `perspective(1000px) rotateX(${coverTilt.x}deg) rotateY(${coverTilt.y}deg)`,
                  transition: "transform 0.15s ease-out",
                  width: "min(300px, 70vw)",
                  maxWidth: "300px",
                  aspectRatio: "2/3",
                }}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl"
                  style={{
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.1)",
                    border: "2px solid rgba(201,168,76,0.2)",
                  }}
                  loading="eager"
                />
                {/* Reflection - hidden on mobile */}
                <div
                  className="absolute -bottom-[10%] left-0 w-full h-full pointer-events-none hidden sm:block"
                  style={{
                    transform: "scaleY(-1) translateY(-8px)",
                    opacity: 0.12,
                    filter: "blur(2px)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  }}
                >
                  <img src={book.cover} alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>

              {/* Mobile: Quick action row below cover */}
              <div className="flex items-center justify-center gap-4 mt-5 lg:hidden">
                <div className="flex items-center gap-2">
                  <StarRating rating={book.rating} size={22} />
                  <span className="text-lg font-bold text-white">{book.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[#A0A0B0]">(1,247 reviews)</span>
              </div>
            </motion.div>

            {/* Info Section (order-2 on mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 w-full"
            >
              {/* Breadcrumb — hidden on small mobile, visible on sm+ */}
              <nav className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-[#A0A0B0] mb-4 sm:mb-6 flex-wrap">
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                <ChevronRight size={14} />
                <Link to="/browse" className="hover:text-gold transition-colors">Browse</Link>
                <ChevronRight size={14} />
                <Link to={`/categories`} className="hover:text-gold transition-colors">{book.category}</Link>
                <ChevronRight size={14} />
                <span className="text-white truncate max-w-[150px]">{book.title}</span>
              </nav>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-3 py-1 rounded-full bg-gold text-midnight text-[10px] sm:text-xs font-bold"
                >
                  {book.subcategory}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="px-3 py-1 rounded-full border border-gold/60 text-gold text-[10px] sm:text-xs font-semibold"
                >
                  {book.category}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1 rounded-full border border-gold/60 text-gold text-[10px] sm:text-xs font-semibold capitalize"
                >
                  {book.language}
                </motion.span>
              </div>

              {/* Title — Mobile: text-2xl, Tablet: text-3xl, Desktop: text-4xl */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-3"
              >
                {book.title}
              </motion.h1>

              {/* Subtitle — Mobile: text-sm */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm sm:text-base lg:text-xl text-[#A0A0B0] mb-2"
              >
                {book.subtitle}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-xs sm:text-sm text-[#A0A0B0] mb-4 sm:mb-5"
              >
                By QuickFare Editorial
              </motion.p>

              {/* Rating — Desktop only (mobile shows below cover) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="hidden lg:flex items-center gap-3 mb-6"
              >
                <StarRating rating={book.rating} size={20} />
                <span className="text-2xl font-bold text-white">{book.rating.toFixed(1)}</span>
                <span className="text-sm text-[#A0A0B0]">(1,247 reviews)</span>
              </motion.div>

              {/* Price & Purchase */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-baseline gap-3 mb-5 sm:mb-6 flex-wrap"
              >
                <span className="text-2xl sm:text-3xl font-bold text-gold">{formatPrice(book.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base sm:text-lg text-[#A0A0B0] line-through">{formatPrice(originalPrice)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] sm:text-xs font-semibold">
                      Save {discount}%
                    </span>
                  </>
                )}
                {book.isPremium && (
                  <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] sm:text-xs font-bold">
                    PREMIUM
                  </span>
                )}
                {!book.isPremium && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald/20 text-emerald-light text-[10px] sm:text-xs font-bold">
                    FREE
                  </span>
                )}
              </motion.div>

              {/* CTA Buttons — Mobile: full-width stacked */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 mb-5 sm:mb-6"
              >
                <button
                  onClick={() => navigate(`/read/${book.id}`)}
                  className="flex items-center justify-center gap-2 bg-gold text-midnight font-bold px-6 sm:px-8 py-3.5 rounded-lg hover:bg-gold-light transition-colors w-full sm:w-auto sm:min-w-[180px]"
                >
                  <BookOpen size={18} className="sm:w-5 sm:h-5" />
                  Read Now
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center gap-2 border px-4 sm:px-6 py-3.5 rounded-lg hover:border-gold hover:text-gold transition-all w-full sm:w-auto min-h-[48px] ${
                    isInWatchlist ? "text-gold border-gold/50" : "text-white border-white/20"
                  }`}
                >
                  <motion.div animate={{ scale: wishlistPulse ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                    {isInWatchlist ? <BookmarkCheck size={18} className="text-gold sm:w-5 sm:h-5" /> : <BookmarkPlus size={18} className="sm:w-5 sm:h-5" />}
                  </motion.div>
                  {isInWatchlist ? "In Library" : "Add to Library"}
                </button>
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="flex items-center justify-center gap-2 border border-white/20 px-4 sm:px-5 py-3.5 rounded-lg hover:border-gold hover:text-gold transition-colors text-white w-full sm:w-auto min-h-[48px]"
                >
                  <Share2 size={18} className="sm:w-5 sm:h-5" />
                  Share
                </button>
              </motion.div>

              {/* Share dropdown */}
              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2 mb-4 flex-wrap"
                  >
                    {[
                      { icon: <Copy size={16} />, key: "copy", label: copied ? "Copied!" : "Copy" },
                      { icon: <Phone size={16} />, key: "whatsapp", label: "WhatsApp" },
                      { icon: <Twitter size={16} />, key: "twitter", label: "X" },
                      { icon: <Facebook size={16} />, key: "facebook", label: "FB" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => handleShare(s.key)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-midnight-200 hover:bg-midnight-300 transition-colors text-xs sm:text-sm text-[#A0A0B0] hover:text-white min-h-[40px]"
                      >
                        {s.icon}
                        <span className="sm:inline">{s.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs text-[#A0A0B0] mb-6 sm:mb-8"
              >
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-gold sm:w-[14px] sm:h-[14px]" /> Instant Access</span>
                <span className="flex items-center gap-1.5"><Infinity size={12} className="text-gold sm:w-[14px] sm:h-[14px]" /> Lifetime Ownership</span>
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-gold sm:w-[14px] sm:h-[14px]" /> 30-Day Refund</span>
              </motion.div>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-[#A0A0B0]"
              >
                <span className="flex items-center gap-1.5"><FileText size={13} className="sm:w-[14px] sm:h-[14px]" /> PDF + EPUB</span>
                <span className="flex items-center gap-1.5"><BookOpen size={13} className="sm:w-[14px] sm:h-[14px]" /> {book.pages} pages</span>
                <span className="flex items-center gap-1.5"><Globe size={13} className="sm:w-[14px] sm:h-[14px]" /> {book.language.charAt(0).toUpperCase() + book.language.slice(1)}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} className="sm:w-[14px] sm:h-[14px]" /> Jan 2025</span>
                <span className="flex items-center gap-1.5"><Shield size={13} className="text-emerald-light sm:w-[14px] sm:h-[14px]" /> All Ages</span>
              </motion.div>

              {/* Progress if started */}
              {progress > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 sm:mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs sm:text-sm text-gold font-semibold">{progress}% Completed</span>
                  </div>
                  <div className="w-full max-w-xs h-1.5 bg-midnight-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gold rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ TABS — Mobile: horizontal scrollable ═══════ */}
      <section className="bg-midnight py-8 sm:py-16">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6">
          {/* Tab nav — sticky, scrollable on mobile */}
          <div className={`sticky top-14 sm:top-16 z-30 bg-midnight/95 backdrop-blur-md border-b border-white/5 mb-6 sm:mb-8 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-shadow ${scrolled ? "shadow-lg shadow-black/20" : ""}`}>
            <div className="flex gap-0 overflow-x-auto hide-scrollbar">
              {(["synopsis", "chapters", "reviews", "details"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3.5 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold capitalize transition-colors whitespace-nowrap min-h-[48px] flex-shrink-0 ${
                    activeTab === tab ? "text-white" : "text-[#A0A0B0] hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="bookTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Synopsis ── */}
              {activeTab === "synopsis" && (
                <div className="max-w-3xl">
                  <p className="text-base sm:text-lg text-[#A0A0B0] leading-relaxed sm:leading-relaxed mb-6 sm:mb-8">{book.description}</p>
                  <p className="text-base sm:text-lg text-[#A0A0B0] leading-relaxed sm:leading-relaxed mb-6 sm:mb-8">
                    This carefully crafted book offers insights, guidance, and practical knowledge for readers
                    seeking to expand their understanding. Whether you are a beginner or have some experience,
                    the clear explanations and organized structure make it easy to follow along.
                  </p>
                  <p className="text-base sm:text-lg text-[#A0A0B0] leading-relaxed sm:leading-relaxed mb-8 sm:mb-12">
                    Each chapter builds upon the previous one, creating a comprehensive learning experience
                    that you can return to again and again as a reference guide.
                  </p>

                  {/* What you'll learn */}
                  <h3 className="font-playfair text-xl sm:text-2xl text-white mb-4 sm:mb-6">What You&apos;ll Learn</h3>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
                    {[
                      "Step-by-step fundamentals",
                      "Practical implementation tips",
                      "Common pitfalls to avoid",
                      "Advanced strategies and techniques",
                      "Real-world case studies",
                      "Expert insights and shortcuts",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 min-h-[44px]">
                        <CheckCircle size={18} className="text-emerald-light shrink-0 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base text-white">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Who this is for */}
                  <h3 className="font-playfair text-xl sm:text-2xl text-white mb-3 sm:mb-4">Who This Is For</h3>
                  <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
                    {["Beginners", "Intermediate Readers", "Researchers", "Practitioners", "Students", "General Audience"].map(
                      (tag) => (
                        <span key={tag} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-midnight-200 border border-white/10 text-xs sm:text-sm text-[#A0A0B0]">
                          {tag}
                        </span>
                      )
                    )}
                  </div>

                  {/* Sample pages */}
                  <h3 className="font-playfair text-xl sm:text-2xl text-white mb-4 sm:mb-6">Sample Pages</h3>
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="relative w-[160px] sm:w-[200px] h-[210px] sm:h-[260px] rounded-lg bg-midnight-200 border border-white/10 overflow-hidden hover:scale-105 transition-transform cursor-pointer group flex-shrink-0"
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-[#A0A0B0] text-xs">
                          Sample Page {n}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg] pointer-events-none">
                          <span className="text-[#A0A0B0]/40 text-xl sm:text-2xl font-bold tracking-widest uppercase">Sample</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Chapters — Mobile: full-width, 48px min touch ═══════ */}
              {activeTab === "chapters" && (
                <div className="max-w-3xl">
                  <p className="text-sm sm:text-base text-[#A0A0B0] mb-4 sm:mb-6">{chapters.length} Chapters &bull; {book.pages} Pages</p>
                  <div className="space-y-0">
                    {chapters.map((ch, i) => (
                      <motion.div
                        key={ch.number}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group flex items-center gap-3 sm:gap-5 py-3.5 sm:py-4 border-b border-white/5 hover:bg-midnight-100/50 px-3 -mx-1 sm:-mx-3 rounded-lg transition-colors cursor-pointer min-h-[52px] sm:min-h-[48px]"
                        onClick={() => navigate(`/read/${book.id}?chapter=${ch.number}`)}
                      >
                        <span className="font-mono text-gold text-base sm:text-lg w-8 sm:w-10 flex-shrink-0">{String(ch.number).padStart(2, "0")}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base text-white font-semibold group-hover:text-gold transition-colors truncate">{ch.title}</h4>
                          <p className="text-[10px] sm:text-xs text-[#A0A0B0]">Pages {ch.pageStart}-{ch.pageEnd}</p>
                        </div>
                        {ch.hasPreview && <Eye size={15} className="text-[#A0A0B0] flex-shrink-0" />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Reviews — Mobile: stacked, full-width ═══════ */}
              {activeTab === "reviews" && (
                <div className="max-w-3xl">
                  {/* Summary */}
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-8 sm:mb-10">
                    <div className="text-center sm:text-left">
                      <div className="font-playfair text-4xl sm:text-5xl text-gold mb-2">{book.rating.toFixed(1)}</div>
                      <div className="flex justify-center sm:justify-start gap-0.5 mb-2">
                        <StarRating rating={book.rating} size={16} />
                      </div>
                      <p className="text-xs sm:text-sm text-[#A0A0B0]">1,247 reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {RATING_BREAKDOWN.map((r) => (
                        <div key={r.stars} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-[10px] sm:text-xs text-[#A0A0B0] w-6 sm:w-8 flex-shrink-0">{r.stars}&#9733;</span>
                          <div className="flex-1 h-1.5 sm:h-2 bg-midnight-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${r.percent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-gold rounded-full"
                            />
                          </div>
                          <span className="text-[10px] sm:text-xs text-[#A0A0B0] w-8 text-right flex-shrink-0">{r.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setReviewFormOpen(true)}
                    className="mb-6 sm:mb-8 px-5 sm:px-6 py-2.5 rounded-lg border border-white/20 text-white hover:border-gold hover:text-gold transition-colors text-sm min-h-[44px]"
                  >
                    Write a Review
                  </button>

                  {/* Review cards */}
                  <div className="space-y-3 sm:space-y-4">
                    {REVIEW_DATA.slice(0, reviewsVisible).map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-midnight-100 rounded-xl p-4 sm:p-6"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs sm:text-sm flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold text-white text-sm sm:text-base truncate">{review.name}</h4>
                              <span className="text-[10px] sm:text-xs text-[#A0A0B0] flex-shrink-0">{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 mt-1">
                              <StarRating rating={review.rating} size={12} />
                            </div>
                          </div>
                        </div>
                        <h5 className="font-semibold text-white text-sm sm:text-base mb-2">{review.title}</h5>
                        <p className="text-xs sm:text-sm text-[#A0A0B0] leading-relaxed mb-3 sm:mb-4">{review.body}</p>
                        <button className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#A0A0B0] hover:text-gold transition-colors min-h-[36px]">
                          <ThumbsUp size={13} className="sm:w-4 sm:h-4" /> Helpful ({review.helpful})
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {reviewsVisible < REVIEW_DATA.length && (
                    <button
                      onClick={() => setReviewsVisible((v) => v + 2)}
                      className="mt-4 sm:mt-6 w-full py-3 rounded-lg border border-white/10 text-[#A0A0B0] hover:text-white hover:border-white/20 transition-colors text-sm min-h-[48px]"
                    >
                      Load More Reviews
                    </button>
                  )}
                </div>
              )}

              {/* ── Details ── */}
              {activeTab === "details" && (
                <div className="max-w-3xl">
                  <div className="grid sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-8 sm:mb-10">
                    {[
                      { label: "ISBN", value: `978-0-${String(book.id).padStart(4, "0")}-${String(1000 + book.id).slice(1)}` },
                      { label: "Publisher", value: "QuickFare Editorial" },
                      { label: "Published", value: "January 2025" },
                      { label: "Language", value: book.language.charAt(0).toUpperCase() + book.language.slice(1) },
                      { label: "Pages", value: String(book.pages) },
                      { label: "File Size", value: "~12 MB" },
                      { label: "Format", value: "PDF, EPUB" },
                      { label: "Age Rating", value: "All Ages" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between sm:block py-2 border-b border-white/5">
                        <span className="text-[10px] sm:text-xs text-[#A0A0B0] sm:block">{item.label}</span>
                        <span className="text-sm sm:text-base text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Categories &amp; Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                    {[book.category, book.subcategory, ...book.tags].map((tag) => (
                      <span key={tag} className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-midnight-200 text-xs sm:text-sm text-[#A0A0B0] border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Share this Book</h4>
                  <div className="flex gap-2 sm:gap-3">
                    {["whatsapp", "facebook", "twitter", "copy"].map((p) => (
                      <button
                        key={p}
                        onClick={() => handleShare(p)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-midnight-200 flex items-center justify-center text-[#A0A0B0] hover:text-gold hover:bg-midnight-300 transition-colors min-h-[36px] min-w-[36px]"
                      >
                        {p === "copy" ? <Copy size={16} className="sm:w-[18px] sm:h-[18px]" /> : p === "whatsapp" ? <Phone size={16} className="sm:w-[18px] sm:h-[18px]" /> : p === "facebook" ? <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════ RELATED BOOKS — Mobile: horizontal scroll carousel ═══════ */}
      {relatedBooks.length > 0 && (
        <section className="bg-midnight-100 py-10 sm:py-16">
          <div className="max-w-container-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-5 sm:mb-8">
              <div className="min-w-0 flex-1">
                <h2 className="font-playfair text-2xl sm:text-3xl text-white mb-1">You May Also Like</h2>
                <p className="text-xs sm:text-base text-[#A0A0B0] truncate">More from {book.category} and {book.subcategory}</p>
              </div>
              <Link to="/browse" className="text-gold hover:underline text-xs sm:text-sm flex items-center gap-1 flex-shrink-0 ml-3">
                See all <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
            </div>
            <div className="flex gap-3 sm:gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
              {relatedBooks.map((b, i) => (
                <div key={b.id} className="flex-shrink-0 w-[160px] sm:w-auto">
                  <BookCard book={b} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ AUTHOR / PUBLISHER ═══════ */}
      <section className="bg-midnight py-10 sm:py-16">
        <div className="max-w-container-lg mx-auto px-4 sm:px-6">
          <div className="bg-midnight-100 border border-gold/20 rounded-2xl p-5 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 border-2 border-gold">
              <BookOpen size={28} className="text-gold sm:w-8 sm:h-8" />
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl text-white mb-2">QuickFare Editorial</h3>
            <p className="text-xs sm:text-base text-[#A0A0B0] max-w-lg mx-auto mb-5 sm:mb-6">
              Premium educational content for the modern Muslim. Every book is researched, designed,
              and produced to the highest standards.
            </p>
            <div className="flex justify-center gap-6 sm:gap-8 mb-5 sm:mb-6">
              <div className="text-center">
                <div className="text-gold font-bold text-base sm:text-lg">400+</div>
                <div className="text-[10px] sm:text-xs text-[#A0A0B0]">Books Published</div>
              </div>
              <div className="text-center">
                <div className="text-gold font-bold text-base sm:text-lg">20+</div>
                <div className="text-[10px] sm:text-xs text-[#A0A0B0]">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-gold font-bold text-base sm:text-lg">50K+</div>
                <div className="text-[10px] sm:text-xs text-[#A0A0B0]">Happy Readers</div>
              </div>
            </div>
            <button className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-white/20 text-white hover:border-gold hover:text-gold transition-colors text-sm min-h-[44px]">
              Follow Publisher
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ AUTHOR BOOKS — Horizontal scroll ═══════ */}
      {authorBooks.length > 0 && (
        <section className="bg-midnight-100 py-10 sm:py-16">
          <div className="max-w-container-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-playfair text-2xl sm:text-3xl text-white mb-5 sm:mb-8">More from {book.category}</h2>
            <div className="flex gap-3 sm:gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
              {authorBooks.map((b, i) => (
                <div key={b.id} className="flex-shrink-0 w-[160px] sm:w-auto">
                  <BookCard book={b} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ Review Form Modal — Mobile: full-screen-ish ═══════ */}
      <AnimatePresence>
        {reviewFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => setReviewFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-midnight-100 border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h3 className="font-playfair text-lg sm:text-xl text-white">Write a Review</h3>
                <button onClick={() => setReviewFormOpen(false)} className="text-[#A0A0B0] hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-1 mb-4 justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={28} className="text-midnight-400 hover:text-gold cursor-pointer transition-colors min-h-[36px] min-w-[36px]" />
                ))}
              </div>
              <input
                type="text"
                placeholder="Review title"
                className="w-full bg-midnight-200 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#A0A0B0] mb-4 focus:outline-none focus:border-gold text-sm sm:text-base"
              />
              <textarea
                placeholder="Write your review..."
                rows={4}
                className="w-full bg-midnight-200 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#A0A0B0] mb-5 sm:mb-6 focus:outline-none focus:border-gold resize-none text-sm sm:text-base"
              />
              <button className="w-full bg-gold text-midnight font-bold py-3 rounded-lg hover:bg-gold-light transition-colors text-sm sm:text-base min-h-[48px]">
                Submit Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
