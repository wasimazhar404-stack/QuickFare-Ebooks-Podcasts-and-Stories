import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  BookOpen,
  ArrowRight,
  Loader2,
  BookmarkPlus,
  BookmarkCheck,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { books, type Book } from "@/data/books";
import { useAppStore } from "@/store/useAppStore";
import BookCard from "@/components/BookCard";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "All",
  "Islamic",
  "Hajj & Umrah",
  "Quran & Hadith",
  "Seerah",
  "Aqeedah",
  "Duas & Supplications",
  "Islamic Finance",
  "Islamic Lifestyle",
  "Islamic Health",
  "Islamic Kids",
  "Parenting & Family",
  "Women in Islam",
  "Youth & Teens",
  "Dawah & Outreach",
  "Death & Afterlife",
  "Spirituality",
  "Business",
  "Science",
  "AI & Technology",
  "Psychology",
  "Communication",
  "Relationships",
  "Sports & Fitness",
  "Self-Defense",
  "Cooking & Food",
  "Travel & Adventure",
  "Arts & Culture",
  "General Knowledge",
  "Global",
];

const LANGUAGES = [
  { value: "all", label: "All Languages", labelUr: "تمام زبانیں" },
  { value: "urdu", label: "Urdu", labelUr: "اردو" },
  { value: "english", label: "English", labelUr: "انگریزی" },
  { value: "bilingual", label: "Bilingual", labelUr: "دوزبانہ" },
];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending", labelUr: "مقبول" },
  { value: "newest", label: "Newest", labelUr: "نئی" },
  { value: "rating", label: "Rating", labelUr: "درجہ" },
  { value: "price_low", label: "Price: Low-High", labelUr: "قیمت: کم-زیادہ" },
  { value: "price_high", label: "Price: High-Low", labelUr: "قیمت: زیادہ-کم" },
  { value: "az", label: "A-Z", labelUr: "ا-ز" },
];

const PRICE_RANGES = [
  { value: "all", label: "All Prices", labelUr: "تمام قیمتیں" },
  { value: "free", label: "Free", labelUr: "مفت" },
  { value: "under5", label: "Under ₨5", labelUr: "₨5 سے کم" },
  { value: "5to15", label: "₨5 – ₨15", labelUr: "₨5 – ₨15" },
  { value: "15plus", label: "₨15+", labelUr: "₨15+" },
];

const RATING_OPTIONS = [
  { value: "all", label: "Any Rating", labelUr: "کوئی بھی درجہ" },
  { value: "4", label: "4+ Stars", labelUr: "4+ ستارے" },
  { value: "4.5", label: "4.5+ Stars", labelUr: "4.5+ ستارے" },
  { value: "5", label: "5 Stars", labelUr: "5 ستارے" },
];

const ITEMS_PER_PAGE = 12;
const RECENTLY_VIEWED_KEY = "qf-recently-viewed";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRecentlyViewed(): number[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addToRecentlyViewed(bookId: number) {
  const list = getRecentlyViewed();
  const next = [bookId, ...list.filter((id) => id !== bookId)].slice(0, 12);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
}

function clearRecentlyViewed() {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
}

/* ------------------------------------------------------------------ */
/*  Small Book Card (for Recently Viewed)                              */
/* ------------------------------------------------------------------ */

function SmallBookCard({ book, onClick }: { book: Book; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative shrink-0 cursor-pointer"
      style={{ width: 140 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/book/${book.id}`} onClick={onClick} className="block">
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-lg overflow-hidden shadow-lg"
          style={{ aspectRatio: "2/3" }}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
          {book.isPremium && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded-full bg-gold text-midnight text-[9px] font-bold">
                PREMIUM
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h4 className="text-white font-playfair font-semibold text-xs leading-tight line-clamp-2">
              {book.title}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-gold fill-gold" />
                <span className="text-gold text-[10px] font-semibold">{book.rating}</span>
              </div>
              <span className="text-gold text-[10px] font-semibold">₨{book.price}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex gap-4 p-4 rounded-xl bg-midnight-100/60 border border-white/5 animate-pulse">
        <div className="w-[100px] h-[150px] md:w-[120px] md:h-[180px] rounded-lg bg-midnight-200 shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-5 w-1/2 rounded bg-midnight-200" />
          <div className="h-4 w-1/3 rounded bg-midnight-200" />
          <div className="h-3 w-2/3 rounded bg-midnight-200" />
          <div className="h-3 w-1/2 rounded bg-midnight-200" />
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg overflow-hidden border border-white/5 bg-midnight-100/60 animate-pulse">
      <div className="aspect-[2/3] bg-midnight-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-midnight-200" />
        <div className="h-3 w-1/2 rounded bg-midnight-200" />
        <div className="flex justify-between pt-1">
          <div className="h-3 w-8 rounded bg-midnight-200" />
          <div className="h-3 w-8 rounded bg-midnight-200" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Dropdown                                                    */
/* ------------------------------------------------------------------ */

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium transition-all duration-200 ${
          value !== options[0]?.value
            ? "border-gold/50 text-gold bg-gold/10"
            : "border-white/10 text-[#A0A0B0] bg-midnight-100 hover:border-white/20 hover:text-white"
        }`}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 w-52 bg-midnight-100 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-[320px] overflow-y-auto"
          >
            <div className="p-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    value === opt.value
                      ? "bg-gold/15 text-gold"
                      : "text-[#A0A0B0] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      value === opt.value
                        ? "border-gold bg-gold text-midnight"
                        : "border-white/20"
                    }`}
                  >
                    {value === opt.value && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List Book Card                                                     */
/* ------------------------------------------------------------------ */

function ListBookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const isInWatchlist = useAppStore((s) => s.isInWatchlist(book.id));

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) removeFromWatchlist(book.id);
    else addToWatchlist(book.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/book/${book.id}`}
        onClick={onClick}
        className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-midnight-100/40 border border-white/5 hover:border-gold/30 transition-all duration-300 group"
      >
        {/* Cover */}
        <motion.div
          animate={{ scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 rounded-lg overflow-hidden"
          style={{ width: 90, aspectRatio: "2/3" }}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-white font-playfair font-semibold text-sm md:text-lg leading-tight line-clamp-1 group-hover:text-gold transition-colors">
            {book.title}
          </h3>
          <p className="text-[#A0A0B0] text-xs md:text-sm mt-0.5 line-clamp-1">{book.subtitle}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gold/40 text-[9px] md:text-[10px] font-semibold text-gold">
              {book.category}
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#A0A0B0] border border-white/10 rounded-full px-2 py-0.5">
              {book.language}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="text-gold text-xs md:text-sm font-semibold">{book.rating}</span>
            </div>
            <span className="text-[#A0A0B0] text-xs">{book.pages} pages</span>
          </div>

          <p className="hidden md:block text-[#A0A0B0] text-xs mt-2 line-clamp-2">{book.description}</p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-1 md:gap-2 min-w-[80px] md:min-w-[120px]">
          <span className="text-gold font-playfair font-bold text-lg md:text-xl">₨{book.price}</span>
          <div className="flex items-center gap-1 md:gap-2 mt-1">
            <button
              onClick={toggleWatchlist}
              className="p-1.5 md:p-2 rounded-full border border-white/10 text-[#A0A0B0] hover:text-gold hover:border-gold/40 transition-colors"
            >
              {isInWatchlist ? (
                <BookmarkCheck className="w-4 h-4 text-gold" />
              ) : (
                <BookmarkPlus className="w-4 h-4" />
              )}
            </button>
            <Link
              to={`/book/${book.id}`}
              onClick={onClick}
              className="hidden md:flex items-center gap-1.5 bg-gold text-midnight font-semibold px-4 py-2 rounded-full text-xs hover:bg-gold-light transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Preview
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Category Pills                                              */
/* ------------------------------------------------------------------ */

function MobileCategoryPills({
  categories,
  active,
  onChange,
  t,
}: {
  categories: string[];
  active: string;
  onChange: (val: string) => void;
  t: (en: string, ur: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 -webkit-overflow-scrolling-touch"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all border min-h-[36px] ${
            active === cat
              ? "bg-gold text-midnight border-gold font-semibold"
              : "bg-midnight-100 text-[#A0A0B0] border-white/10 hover:border-white/30 hover:text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Sort Select                                                 */
/* ------------------------------------------------------------------ */

function MobileSortSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="lg:hidden relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-9 pl-3 pr-8 rounded-full border border-white/10 bg-midnight-100 text-[#A0A0B0] text-xs font-medium focus:outline-none focus:border-gold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A0A0B0] pointer-events-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Browse Page                                                   */
/* ------------------------------------------------------------------ */

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const language = useAppStore((s) => s.language);

  /* URL → State */
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [langFilter, setLangFilter] = useState(searchParams.get("lang") || "all");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");
  const [ratingFilter, setRatingFilter] = useState(searchParams.get("rating") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem("qf-view-mode") as "grid" | "list") || "grid"
  );

  /* UI State */
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(getRecentlyViewed());
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /* Debounced search */
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* Sync state → URL */
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category !== "All") params.set("category", category);
    if (langFilter !== "all") params.set("lang", langFilter);
    if (priceRange !== "all") params.set("price", priceRange);
    if (ratingFilter !== "all") params.set("rating", ratingFilter);
    if (sortBy !== "trending") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
    setDisplayCount(ITEMS_PER_PAGE);
  }, [debouncedQuery, category, langFilter, priceRange, ratingFilter, sortBy]);

  /* Simulate loading on filter change */
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [debouncedQuery, category, langFilter, priceRange, ratingFilter, sortBy]);

  /* Filter & Sort */
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.category.toLowerCase().includes(q) ||
          b.subcategory.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (b) => b.category === category || b.subcategory === category
      );
    }

    // Language
    if (langFilter !== "all") {
      result = result.filter((b) => b.language === langFilter);
    }

    // Price
    if (priceRange !== "all") {
      result = result.filter((b) => {
        if (priceRange === "free") return b.price === 0;
        if (priceRange === "under5") return b.price < 5;
        if (priceRange === "5to15") return b.price >= 5 && b.price <= 15;
        if (priceRange === "15plus") return b.price > 15;
        return true;
      });
    }

    // Rating
    if (ratingFilter !== "all") {
      const min = parseFloat(ratingFilter);
      result = result.filter((b) => b.rating >= min);
    }

    // Sort
    switch (sortBy) {
      case "trending":
        result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [debouncedQuery, category, langFilter, priceRange, ratingFilter, sortBy]);

  const visibleBooks = useMemo(
    () => filteredBooks.slice(0, displayCount),
    [filteredBooks, displayCount]
  );
  const hasMore = displayCount < filteredBooks.length;

  /* Infinite scroll */
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setDisplayCount((c) => Math.min(c + ITEMS_PER_PAGE, filteredBooks.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, filteredBooks.length]);

  /* View mode persistence */
  const toggleViewMode = useCallback(() => {
    const next = viewMode === "grid" ? "list" : "grid";
    setViewMode(next);
    localStorage.setItem("qf-view-mode", next);
  }, [viewMode]);

  /* Clear all */
  const clearAll = useCallback(() => {
    setSearchQuery("");
    setCategory("All");
    setLangFilter("all");
    setPriceRange("all");
    setRatingFilter("all");
    setSortBy("trending");
  }, []);

  const activeFilters = useMemo(() => {
    const f: { label: string; clear: () => void }[] = [];
    if (debouncedQuery)
      f.push({ label: `"${debouncedQuery}"`, clear: () => setSearchQuery("") });
    if (category !== "All")
      f.push({ label: category, clear: () => setCategory("All") });
    if (langFilter !== "all") {
      const l = LANGUAGES.find((x) => x.value === langFilter);
      f.push({ label: l?.label || langFilter, clear: () => setLangFilter("all") });
    }
    if (priceRange !== "all") {
      const p = PRICE_RANGES.find((x) => x.value === priceRange);
      f.push({ label: p?.label || priceRange, clear: () => setPriceRange("all") });
    }
    if (ratingFilter !== "all") {
      const r = RATING_OPTIONS.find((x) => x.value === ratingFilter);
      f.push({ label: r?.label || ratingFilter, clear: () => setRatingFilter("all") });
    }
    return f;
  }, [debouncedQuery, category, langFilter, priceRange, ratingFilter]);

  const handleBookClick = useCallback(
    (bookId: number) => {
      addToRecentlyViewed(bookId);
      setRecentlyViewed(getRecentlyViewed());
    },
    []
  );

  const handleClearHistory = useCallback(() => {
    clearRecentlyViewed();
    setRecentlyViewed([]);
  }, []);

  const t = (en: string, ur: string) => (language === "ur" ? ur : en);

  /* Recently viewed books data */
  const recentBooks = useMemo(
    () => recentlyViewed.map((id) => books.find((b) => b.id === id)).filter(Boolean) as Book[],
    [recentlyViewed]
  );

  /* Featured category pills for mobile */
  const pillCategories = [
    "All",
    "Hajj & Umrah",
    "Quran & Hadith",
    "Islamic Finance",
    "Islamic Health",
    "Islamic Kids",
    "AI & Technology",
    "Seerah",
    "Parenting & Family",
  ];

  return (
    <div className="min-h-screen bg-midnight">
      {/* ── Section 1: Browse Header ── */}
      <section className="pt-24 pb-6 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-2 md:mb-3"
          >
            <h1 className="font-playfair text-2xl md:text-3xl lg:text-5xl text-white mb-1 md:mb-2">
              {t("Browse Collection", "مجموعہ براؤز کریں")}
            </h1>
            <p className="text-[#A0A0B0] text-sm md:text-base lg:text-lg">
              {t(`${filteredBooks.length} of ${books.length} books`, `${books.length} میں سے ${filteredBooks.length} کتابیں`)}
            </p>
          </motion.div>

          {/* Search Bar - sticky on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[720px] mx-auto mt-4 md:mt-6 relative"
          >
            <div className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#A0A0B0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  "Search by title, author, topic...",
                  "عنوان، مصنف، موضوع سے تلاش کریں..."
                )}
                className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 bg-midnight-100 border border-white/10 rounded-xl text-white placeholder:text-[#A0A0B0] text-sm md:text-base focus:outline-none focus:border-gold transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Active Filters */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-4 md:mt-5"
              >
                {activeFilters.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-midnight-100 border border-gold/40 text-gold text-xs md:text-sm"
                  >
                    {f.label}
                    <button
                      onClick={f.clear}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  className="text-[#A0A0B0] text-xs md:text-sm hover:text-red-400 transition-colors ml-1"
                >
                  {t("Clear All", "تمام صاف کریں")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Section 2: Filter Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-[72px] z-[100] border-b border-white/5 overflow-visible"
        style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16 py-2 md:py-0">
          {/* Mobile: horizontal scrollable category pills + sort */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2 mb-2">
              {/* Filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-full border border-white/10 text-[#A0A0B0] text-xs font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeFilters.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-gold text-midnight text-[9px] font-bold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Category pills - scrollable */}
              <div
                className="flex-1 overflow-x-auto hide-scrollbar -webkit-overflow-scrolling-touch"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <MobileCategoryPills
                  categories={pillCategories}
                  active={category}
                  onChange={setCategory}
                  t={t}
                />
              </div>

              {/* Sort dropdown */}
              <MobileSortSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS.map((s) => ({
                  value: s.value,
                  label: language === "ur" ? s.labelUr : s.label,
                }))}
              />
            </div>
          </div>

          {/* Desktop: dropdown filters */}
          <div className="hidden lg:flex items-center justify-between gap-3 h-16 overflow-x-auto hide-scrollbar">
            {/* Left: Filters */}
            <div className="flex items-center gap-3 shrink-0">
              <FilterDropdown
                label={t("All Categories", "تمام زمرے")}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                value={category}
                onChange={setCategory}
              />
              <FilterDropdown
                label={t("All Languages", "تمام زبانیں")}
                options={LANGUAGES.map((l) => ({ value: l.value, label: language === "ur" ? l.labelUr : l.label }))}
                value={langFilter}
                onChange={setLangFilter}
              />
              <FilterDropdown
                label={t("All Prices", "تمام قیمتیں")}
                options={PRICE_RANGES.map((p) => ({ value: p.value, label: language === "ur" ? p.labelUr : p.label }))}
                value={priceRange}
                onChange={setPriceRange}
              />
              <FilterDropdown
                label={t("Any Rating", "کوئی بھی درجہ")}
                options={RATING_OPTIONS.map((r) => ({ value: r.value, label: language === "ur" ? r.labelUr : r.label }))}
                value={ratingFilter}
                onChange={setRatingFilter}
              />
            </div>

            {/* Right: Sort & View */}
            <div className="flex items-center gap-3 shrink-0">
              <FilterDropdown
                label={t("Sort: Popular", "ترتیب: مقبول")}
                options={SORT_OPTIONS.map((s) => ({ value: s.value, label: language === "ur" ? s.labelUr : s.label }))}
                value={sortBy}
                onChange={setSortBy}
              />
              <div className="flex items-center rounded-full border border-white/10 bg-midnight-100 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "grid" ? "text-gold bg-gold/10" : "text-[#A0A0B0] hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "list" ? "text-gold bg-gold/10" : "text-[#A0A0B0] hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Filter Sheet ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-midnight-100 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-lg md:text-xl text-white">
                  {t("Filters", "فلٹرز")}
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-full bg-white/5 text-[#A0A0B0] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <MobileFilterGroup
                  label={t("Category", "زمرہ")}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  value={category}
                  onChange={setCategory}
                />
                <MobileFilterGroup
                  label={t("Language", "زبان")}
                  options={LANGUAGES.map((l) => ({ value: l.value, label: language === "ur" ? l.labelUr : l.label }))}
                  value={langFilter}
                  onChange={setLangFilter}
                />
                <MobileFilterGroup
                  label={t("Price", "قیمت")}
                  options={PRICE_RANGES.map((p) => ({ value: p.value, label: language === "ur" ? p.labelUr : p.label }))}
                  value={priceRange}
                  onChange={setPriceRange}
                />
                <MobileFilterGroup
                  label={t("Rating", "درجہ")}
                  options={RATING_OPTIONS.map((r) => ({ value: r.value, label: language === "ur" ? r.labelUr : r.label }))}
                  value={ratingFilter}
                  onChange={setRatingFilter}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearAll}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-[#A0A0B0] text-sm font-medium hover:text-white transition-colors min-h-[48px]"
                >
                  {t("Reset", "ری سیٹ")}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 rounded-xl bg-gold text-midnight text-sm font-semibold hover:bg-gold-light transition-colors min-h-[48px]"
                >
                  {t("Apply", "لاگو کریں")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section 3: Book Grid / List ── */}
      <section className="py-6 md:py-8 lg:py-12 pb-20 md:pb-24">
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16">
          {/* Mobile: results count */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-[#A0A0B0] text-xs">
              {filteredBooks.length} {t("books", "کتابیں")}
            </p>
            <div className="flex items-center rounded-full border border-white/10 bg-midnight-100 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid" ? "text-gold bg-gold/10" : "text-[#A0A0B0]"
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list" ? "text-gold bg-gold/10" : "text-[#A0A0B0]"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div
              className={`grid gap-3 md:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} view={viewMode} />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <EmptyState onClear={clearAll} t={t} />
          ) : (
            <>
              <motion.div
                layout
                className={`grid gap-3 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    : "grid-cols-1 max-w-4xl mx-auto"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {visibleBooks.map((book, i) =>
                    viewMode === "grid" ? (
                      <motion.div
                        key={book.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(i * 0.04, 0.4),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div onClick={() => handleBookClick(book.id)}>
                          <BookCard book={book} index={i} />
                        </div>
                      </motion.div>
                    ) : (
                      <ListBookCard
                        key={book.id}
                        book={book}
                        onClick={() => handleBookClick(book.id)}
                      />
                    )
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Load more / End */}
              <div ref={loadMoreRef} className="mt-8 md:mt-12 flex items-center justify-center">
                {hasMore ? (
                  <div className="flex items-center gap-2 text-gold">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{t("Loading more...", "مزید لوڈ ہو رہا ہے...")}</span>
                  </div>
                ) : (
                  <p className="text-[#A0A0B0] text-xs md:text-sm">
                    {t("You've seen all books", "آپ نے تمام کتابیں دیکھ لیں")}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Section 4: Recently Viewed ── */}
      {recentBooks.length > 0 && (
        <section className="py-8 md:py-12 lg:py-16 bg-midnight-100/30 border-t border-white/5">
          <div className="max-w-container-2xl mx-auto px-4 lg:px-16">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-playfair text-lg md:text-xl lg:text-2xl text-white">
                  {t("Recently Viewed", "حالیہ دیکھی گئی")}
                </h2>
              </motion.div>
              <button
                onClick={handleClearHistory}
                className="text-[#A0A0B0] text-xs md:text-sm hover:text-red-400 transition-colors"
              >
                {t("Clear History", "تاریخ صاف کریں")}
              </button>
            </div>

            <div
              className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth -webkit-overflow-scrolling-touch"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {recentBooks.slice(0, 6).map((book) => (
                <SmallBookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Filter Group                                                */
/* ------------------------------------------------------------------ */

function MobileFilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
              value === opt.value
                ? "bg-gold/15 text-gold border-gold/40"
                : "text-[#A0A0B0] border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({
  onClear,
  t,
}: {
  onClear: () => void;
  t: (en: string, ur: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4"
    >
      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-midnight-100 flex items-center justify-center mb-4 md:mb-6 border border-white/5">
        <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-gold/40" />
      </div>
      <h2 className="font-playfair text-lg md:text-2xl text-white mb-2">
        {t("No books found", "کوئی کتاب نہیں ملی")}
      </h2>
      <p className="text-[#A0A0B0] text-xs md:text-sm max-w-md mb-4 md:mb-6">
        {t(
          "Try adjusting your filters or search term to find what you're looking for.",
          "اپنے فلٹرز یا تلاش کا لفظ ایڈجسٹ کریں۔"
        )}
      </p>
      <button
        onClick={onClear}
        className="flex items-center gap-2 bg-gold/15 text-gold border border-gold/30 rounded-full px-5 py-2 md:px-6 md:py-2.5 text-sm font-medium hover:bg-gold hover:text-midnight transition-all duration-300 min-h-[44px]"
      >
        <RotateCcw className="w-4 h-4" />
        {t("Clear All Filters", "تمام فلٹرز صاف کریں")}
      </button>

      {/* Suggested categories */}
      <div className="mt-8 md:mt-10">
        <p className="text-[#A0A0B0] text-[10px] md:text-xs uppercase tracking-wider mb-3">
          {t("Popular Categories", "مقبول زمرے")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Islamic", "Seerah", "Quran & Hadith", "Duas & Supplications", "Islamic Finance"].map(
            (cat) => (
              <Link
                key={cat}
                to={`/browse?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gold/20 text-gold text-xs hover:bg-gold/10 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {cat}
              </Link>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
