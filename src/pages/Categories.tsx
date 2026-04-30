import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
  Star,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { books } from "@/data/books";
import BookCard from "@/components/BookCard";

/* ------------------------------------------------------------------ */
/*  Category config                                                     */
/* ------------------------------------------------------------------ */

interface CategoryConfig {
  label: string;
  subcategory: string;
  category: "Islamic" | "Global";
  coverId: number;
  gradient: string;
  icon: string;
}

const ISLAMIC_CATEGORIES: CategoryConfig[] = [
  {
    label: "Hajj & Umrah",
    subcategory: "Hajj & Umrah",
    category: "Islamic",
    coverId: 1,
    gradient: "from-emerald-900/80 to-teal-800/60",
    icon: "🕋",
  },
  {
    label: "Ziyarat & Heritage",
    subcategory: "Hajj & Umrah",
    category: "Islamic",
    coverId: 4,
    gradient: "from-amber-900/80 to-yellow-800/60",
    icon: "🕌",
  },
  {
    label: "Islamic Finance",
    subcategory: "Islamic Finance",
    category: "Islamic",
    coverId: 51,
    gradient: "from-emerald-900/80 to-green-800/60",
    icon: "💰",
  },
  {
    label: "Islamic Lifestyle",
    subcategory: "Islamic Lifestyle",
    category: "Islamic",
    coverId: 61,
    gradient: "from-teal-900/80 to-cyan-800/60",
    icon: "☪️",
  },
  {
    label: "Muslim Parenting",
    subcategory: "Parenting & Family",
    category: "Islamic",
    coverId: 71,
    gradient: "from-rose-900/80 to-pink-800/60",
    icon: "👨‍👩‍👧",
  },
  {
    label: "Health & Wellness",
    subcategory: "Islamic Health",
    category: "Islamic",
    coverId: 81,
    gradient: "from-green-900/80 to-lime-800/60",
    icon: "🌿",
  },
  {
    label: "Quran Studies",
    subcategory: "Quran & Hadith",
    category: "Islamic",
    coverId: 11,
    gradient: "from-indigo-900/80 to-violet-800/60",
    icon: "📖",
  },
  {
    label: "Hadith & Sunnah",
    subcategory: "Quran & Hadith",
    category: "Islamic",
    coverId: 14,
    gradient: "from-slate-900/80 to-zinc-800/60",
    icon: "📜",
  },
  {
    label: "Seerah & History",
    subcategory: "Seerah",
    category: "Islamic",
    coverId: 21,
    gradient: "from-orange-900/80 to-amber-800/60",
    icon: "⚔️",
  },
  {
    label: "Aqeedah & Beliefs",
    subcategory: "Aqeedah",
    category: "Islamic",
    coverId: 31,
    gradient: "from-blue-900/80 to-indigo-800/60",
    icon: "🤲",
  },
  {
    label: "Duas & Dhikr",
    subcategory: "Duas & Supplications",
    category: "Islamic",
    coverId: 41,
    gradient: "from-purple-900/80 to-fuchsia-800/60",
    icon: "🌙",
  },
  {
    label: "Islamic Kids",
    subcategory: "Islamic Kids",
    category: "Islamic",
    coverId: 111,
    gradient: "from-sky-900/80 to-blue-800/60",
    icon: "🧸",
  },
];

const GLOBAL_CATEGORIES: CategoryConfig[] = [
  {
    label: "AI & Future Tech",
    subcategory: "AI & Technology",
    category: "Global",
    coverId: 151,
    gradient: "from-cyan-900/80 to-blue-800/60",
    icon: "🤖",
  },
  {
    label: "Global Travel",
    subcategory: "Travel & Adventure",
    category: "Global",
    coverId: 161,
    gradient: "from-teal-900/80 to-emerald-800/60",
    icon: "✈️",
  },
  {
    label: "Mind Power",
    subcategory: "Psychology",
    category: "Global",
    coverId: 171,
    gradient: "from-violet-900/80 to-purple-800/60",
    icon: "🧠",
  },
  {
    label: "Relationships",
    subcategory: "Relationships",
    category: "Global",
    coverId: 181,
    gradient: "from-rose-900/80 to-red-800/60",
    icon: "❤️",
  },
  {
    label: "Business",
    subcategory: "Business",
    category: "Global",
    coverId: 191,
    gradient: "from-amber-900/80 to-orange-800/60",
    icon: "💼",
  },
  {
    label: "Science",
    subcategory: "Science",
    category: "Global",
    coverId: 201,
    gradient: "from-sky-900/80 to-cyan-800/60",
    icon: "🔬",
  },
  {
    label: "Self-Defense",
    subcategory: "Self-Defense",
    category: "Global",
    coverId: 211,
    gradient: "from-red-900/80 to-orange-800/60",
    icon: "🥋",
  },
  {
    label: "Communication",
    subcategory: "Communication",
    category: "Global",
    coverId: 221,
    gradient: "from-indigo-900/80 to-blue-800/60",
    icon: "💬",
  },
  {
    label: "Personal Finance",
    subcategory: "Business",
    category: "Global",
    coverId: 195,
    gradient: "from-green-900/80 to-emerald-800/60",
    icon: "💳",
  },
  {
    label: "Creativity & Arts",
    subcategory: "Arts & Culture",
    category: "Global",
    coverId: 231,
    gradient: "from-fuchsia-900/80 to-pink-800/60",
    icon: "🎨",
  },
  {
    label: "Food",
    subcategory: "Cooking & Food",
    category: "Global",
    coverId: 141,
    gradient: "from-orange-900/80 to-yellow-800/60",
    icon: "🍲",
  },
  {
    label: "Sports",
    subcategory: "Sports & Fitness",
    category: "Global",
    coverId: 241,
    gradient: "from-lime-900/80 to-green-800/60",
    icon: "⚽",
  },
  {
    label: "Spirituality",
    subcategory: "Spirituality",
    category: "Global",
    coverId: 251,
    gradient: "from-purple-900/80 to-indigo-800/60",
    icon: "🧘",
  },
  {
    label: "General Knowledge",
    subcategory: "General Knowledge",
    category: "Global",
    coverId: 261,
    gradient: "from-slate-900/80 to-gray-800/60",
    icon: "🌍",
  },
];

/* ------------------------------------------------------------------ */
/*  Bundles                                                            */
/* ------------------------------------------------------------------ */

const BUNDLES = [
  {
    title: "Ramadan Collection",
    books: 8,
    price: 29.99,
    original: 64.99,
    coverIds: [111, 115, 61, 11, 41, 42, 1, 2],
    accent: "from-amber-900/60 to-orange-800/40",
  },
  {
    title: "Hajj Complete Guide",
    books: 5,
    price: 19.99,
    original: 44.99,
    coverIds: [1, 2, 3, 4, 5],
    accent: "from-emerald-900/60 to-teal-800/40",
  },
  {
    title: "New Muslim Starter",
    books: 6,
    price: 24.99,
    original: 54.99,
    coverIds: [31, 21, 61, 41, 51, 71],
    accent: "from-sky-900/60 to-blue-800/40",
  },
  {
    title: "Kids Islamic Library",
    books: 10,
    price: 34.99,
    original: 89.99,
    coverIds: [111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
    accent: "from-rose-900/60 to-pink-800/40",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function padId(id: number) {
  return String(id).padStart(3, "0");
}

function getBookCount(subcategory: string, category: "Islamic" | "Global") {
  return books.filter(
    (b) => b.subcategory === subcategory && b.category === category
  ).length;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CategoryCard({
  config,
  index,
  onClick,
}: {
  config: CategoryConfig;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const count = getBookCount(config.subcategory, config.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer rounded-xl overflow-hidden group"
      style={{ aspectRatio: "3/3.5" }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} transition-transform duration-500 ${
          hovered ? "scale-110" : "scale-100"
        }`}
      />

      {/* Cover image */}
      <motion.img
        src={`/covers/cover_${padId(config.coverId)}.jpg`}
        alt={config.label}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ opacity: 0.35 }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-3 md:p-4 lg:p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-lg md:text-2xl">{config.icon}</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[9px] md:text-[10px] font-semibold tracking-wider uppercase text-white/80 border border-white/10">
            {count} books
          </span>
        </div>

        <div>
          <h3 className="font-playfair text-sm md:text-base lg:text-lg font-semibold text-white leading-tight mb-1">
            {config.label}
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 text-gold text-xs md:text-sm font-medium"
          >
            Explore <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>
        </div>
      </div>

      {/* Gold border on hover */}
      <div
        className={`absolute inset-0 rounded-xl border-2 transition-colors duration-300 pointer-events-none ${
          hovered ? "border-gold/40" : "border-transparent"
        }`}
      />
    </motion.div>
  );
}

function BundleCard({
  bundle,
  index,
}: {
  bundle: (typeof BUNDLES)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const savings = Math.round(
    ((bundle.original - bundle.price) / bundle.original) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 w-[240px] md:w-[280px] rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bundle.accent}`} />
      <div className="absolute inset-0 bg-midnight/60" />

      {/* Content */}
      <div className="relative p-4 md:p-5 flex flex-col h-full min-h-[280px] md:min-h-[320px]">
        {/* Savings badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-[9px] md:text-[10px] font-bold">
            SAVE {savings}%
          </span>
        </div>

        {/* Stacked covers */}
        <div className="relative h-[120px] md:h-[140px] mb-4 flex items-center justify-center">
          {bundle.coverIds.slice(0, 4).map((id, i) => (
            <motion.img
              key={id}
              src={`/covers/cover_${padId(id)}.jpg`}
              alt=""
              className="absolute rounded-md shadow-lg"
              style={{
                width: 60,
                height: 90,
                zIndex: 4 - i,
                left: `calc(50% + ${(i - 1.5) * 20}px)`,
                transform: `rotate(${(i - 1.5) * 6}deg)`,
              }}
              animate={{
                y: hovered ? -4 : 0,
                scale: hovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-playfair text-base md:text-lg font-semibold text-white mb-1">
            {bundle.title}
          </h3>
          <p className="text-[#A0A0B0] text-xs md:text-sm mb-3">
            {bundle.books} books curated bundle
          </p>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-gold font-playfair text-xl md:text-2xl font-bold">
              ${bundle.price}
            </span>
            <span className="text-[#A0A0B0] text-xs md:text-sm line-through ml-2">
              ${bundle.original}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-gold text-midnight px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-gold-light transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Border */}
      <div
        className={`absolute inset-0 rounded-xl border-2 transition-colors duration-300 pointer-events-none ${
          hovered ? "border-gold/30" : "border-white/5"
        }`}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Categories() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.subcategory.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const featuredSubcategory = "Hajj & Umrah";
  const featuredBooks = useMemo(
    () =>
      books
        .filter((b) => b.subcategory === featuredSubcategory)
        .slice(0, 6),
    []
  );

  const handleCategoryClick = (subcategory: string) => {
    navigate(`/browse?category=${encodeURIComponent(subcategory)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* ================== HERO BANNER ================== */}
      <section className="relative pt-24 pb-10 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: "40vh" }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-20 w-56 h-56 md:w-72 md:h-72 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
              Browse Our Library
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight"
          >
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Islamic
            </span>{" "}
            &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-light to-emerald">
              Global Knowledge
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#A0A0B0] text-sm md:text-lg max-w-2xl mx-auto mb-6 md:mb-8"
          >
            Dive into curated collections spanning faith, learning, and modern
            disciplines — all in one place.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#A0A0B0]" />
              <input
                type="text"
                placeholder="Search books, topics, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-12 md:pr-16 py-3 md:py-3.5 rounded-xl bg-midnight-100/80 border border-white/10 text-white placeholder:text-[#A0A0B0] text-sm md:text-base focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white text-xs md:text-sm"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {filteredBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-50 top-full left-0 right-0 mt-2 bg-midnight-100 border border-white/10 rounded-xl overflow-hidden shadow-book max-h-[300px] md:max-h-[400px] overflow-y-auto"
              >
                <div className="p-2">
                  {filteredBooks.slice(0, 6).map((book) => (
                    <Link
                      key={book.id}
                      to={`/book/${book.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-8 h-12 md:w-10 md:h-14 object-cover rounded"
                      />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-medium text-white truncate">
                          {book.title}
                        </p>
                        <p className="text-[10px] md:text-xs text-[#A0A0B0]">
                          {book.subcategory}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {filteredBooks.length > 6 && (
                    <p className="text-[10px] md:text-xs text-[#A0A0B0] text-center py-2">
                      +{filteredBooks.length - 6} more results
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================== ISLAMIC CATEGORIES ================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Islamic Categories
            </h2>
            <span className="ml-auto text-[#A0A0B0] text-xs md:text-sm hidden sm:block">
              {ISLAMIC_CATEGORIES.length} collections
            </span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {ISLAMIC_CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.label}
                config={cat}
                index={i}
                onClick={() => handleCategoryClick(cat.subcategory)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================== GLOBAL CATEGORIES ================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-emerald-light to-emerald rounded-full" />
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Global Categories
            </h2>
            <span className="ml-auto text-[#A0A0B0] text-xs md:text-sm hidden sm:block">
              {GLOBAL_CATEGORIES.length} collections
            </span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {GLOBAL_CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.label}
                config={cat}
                index={i}
                onClick={() => handleCategoryClick(cat.subcategory)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================== CURATED BUNDLES ================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-gold to-emerald rounded-full" />
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Curated Bundles
            </h2>
            <Star className="w-4 h-4 md:w-5 md:h-5 text-gold ml-2" />
          </motion.div>

          {/* Mobile: horizontal scroll with snap, Desktop: grid */}
          <div
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto hide-scrollbar pb-4 md:pb-0 snap-x snap-mandatory -webkit-overflow-scrolling-touch"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {BUNDLES.map((bundle, i) => (
              <div key={bundle.title} className="snap-start">
                <BundleCard bundle={bundle} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== FEATURED SPOTLIGHT ================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-midnight-100 to-midnight" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(/covers/cover_${padId(1)}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent" />

            {/* Content - stacked on mobile, side by side on desktop */}
            <div className="relative p-5 md:p-10 lg:p-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-12 items-start">
                {/* Text - full width on mobile */}
                <div className="flex-1 max-w-full lg:max-w-xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10 text-emerald-light text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-3 md:mb-4">
                    <BookOpen className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    Featured Category
                  </span>
                  <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                    Hajj & Umrah Collection
                  </h2>
                  <p className="text-[#A0A0B0] text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed">
                    Everything you need for the sacred journey — from practical
                    guides to spiritual preparation, rites, and ziyarat. Trusted
                    by thousands of pilgrims worldwide.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5 md:mb-8">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-gold fill-gold" />
                      <span className="text-white font-semibold text-sm">4.5</span>
                      <span className="text-[#A0A0B0] text-xs md:text-sm">
                        avg. rating
                      </span>
                    </div>
                    <div className="w-px h-4 md:h-5 bg-white/10" />
                    <span className="text-[#A0A0B0] text-xs md:text-sm">
                      20 books available
                    </span>
                  </div>
                  <Link
                    to={`/browse?category=${encodeURIComponent("Hajj & Umrah")}`}
                    className="inline-flex items-center gap-2 bg-gold text-midnight px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-gold-light transition-colors text-sm md:text-base min-h-[44px]"
                  >
                    View All Books
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Preview books - horizontal scroll on mobile */}
                <div className="w-full lg:w-auto lg:flex-shrink-0">
                  <div
                    className="flex gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory -webkit-overflow-scrolling-touch"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {featuredBooks.map((book, i) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="shrink-0"
                        style={{ width: "clamp(130px, 40vw, 200px)" }}
                      >
                        <BookCard book={book} index={i} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
