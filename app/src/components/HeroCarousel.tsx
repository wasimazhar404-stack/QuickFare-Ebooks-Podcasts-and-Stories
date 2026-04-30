import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "@/data/books";

interface HeroCarouselProps {
  featuredBooks: Book[];
}

/* Show max 6 books in hero for clean experience */
const MAX_HERO_BOOKS = 6;

/* Ambient floating particles */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * 10,
  opacity: Math.random() * 0.3 + 0.1,
}));

export default function HeroCarousel({ featuredBooks }: HeroCarouselProps) {
  const books = featuredBooks.slice(0, MAX_HERO_BOOKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const AUTO_ADVANCE = 5000;

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > currentIndex ? 1 : -1);
      setCurrentIndex((idx + books.length) % books.length);
    },
    [currentIndex, books.length]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  }, [books.length]);

  useEffect(() => {
    if (isPaused || books.length <= 1) return;
    const interval = setInterval(nextSlide, AUTO_ADVANCE);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, books.length]);

  const book = books[currentIndex];
  if (!book) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 3000);
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* === AMBIENT BACKGROUND === */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c18] via-[#121224] to-[#0a0a14]" />

      {/* Slow-moving gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gold/[0.03] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 15, -25, 0], scale: [1, 0.9, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-purple-500/[0.04] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 10 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.02] blur-[80px]"
        />
      </div>

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -30, -60, -30, 0],
              x: [0, 10, -5, 15, 0],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.5, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle noise/grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* === CONTENT === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">

          {/* Poster */}
          <div className="relative w-full md:w-[360px] lg:w-[400px] flex-shrink-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`poster-${book.id}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="relative mx-auto md:mx-0"
                style={{ maxWidth: 400, aspectRatio: "2/3" }}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl shadow-2xl shadow-black/70"
                  loading="eager"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/[0.08] pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Mobile arrows */}
            <div className="flex items-center justify-center gap-3 mt-3 md:hidden">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white/40 text-xs tabular-nums">
                {currentIndex + 1} / {books.length}
              </span>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${book.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <span className="inline-block px-3 py-1 rounded-full border border-gold/30 text-gold/80 text-xs font-semibold tracking-wider uppercase mb-3 bg-gold/5 backdrop-blur-sm">
                  {book.subcategory}
                </span>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  {book.title}
                </h2>

                <p className="text-white/50 text-sm md:text-base mb-5 line-clamp-2">
                  {book.subtitle}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-3 text-white/40 text-sm mb-6 flex-wrap">
                  <span className="text-gold font-semibold">{book.rating} ★</span>
                  <span className="text-white/20">•</span>
                  <span>{book.pages} pages</span>
                  <span className="text-white/20">•</span>
                  <span>{book.language === "urdu" ? "اردو" : book.language === "bilingual" ? "Bilingual" : "English"}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-gold font-semibold">
                    {book.price === 0 ? "FREE" : `₨${book.price}`}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Link
                    to={`/book/${book.id}`}
                    className="inline-flex items-center gap-2 bg-gold text-midnight font-bold px-6 py-3 rounded-full text-sm hover:bg-gold-light transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px] shadow-lg shadow-gold/20"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Reading
                  </Link>
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/5 transition-all min-h-[48px] backdrop-blur-sm"
                  >
                    Browse All
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop arrows */}
            <div className="hidden md:flex items-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white/30 text-sm tabular-nums">
                {currentIndex + 1} / {books.length}
              </span>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
