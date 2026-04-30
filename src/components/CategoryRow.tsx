import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import type { Book } from "@/data/books";

interface CategoryRowProps {
  title: string;
  subtitle?: string;
  books: Book[];
  seeAllHref?: string;
  showNewBadge?: boolean;
}

export default function CategoryRow({
  title,
  subtitle,
  books,
  seeAllHref = "/browse",
  showNewBadge = false,
}: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-6 md:py-10 lg:py-12">
      {/* Header */}
      <div className="max-w-container-2xl mx-auto px-4 lg:px-16 mb-4 md:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-white">
              {title}
            </h2>
            {showNewBadge && (
              <span className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full bg-emerald/20 border border-emerald/40 text-emerald-light text-[10px] md:text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-light animate-pulse" />
                This Week
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[#A0A0B0] text-xs md:text-sm mt-0.5 md:mt-1">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* See All - desktop: inline, mobile: stacked below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to={seeAllHref}
            className="inline-flex items-center gap-1 text-gold text-sm font-medium hover:underline transition-all mt-1 md:mt-0"
          >
            See All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Row */}
      <div className="relative group">
        {/* Left Arrow - hidden on mobile */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-midnight-300/90 border border-gold/30 text-gold items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-midnight"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow - hidden on mobile */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-midnight-300/90 border border-gold/30 text-gold items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-midnight"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cards Container - touch scroll on mobile */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto hide-scrollbar px-4 lg:px-16 pb-4 scroll-smooth snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {books.map((book, i) => (
            <div key={book.id} className="snap-start">
              <BookCard book={book} index={i} />
            </div>
          ))}

          {/* See All Card - peek effect */}
          <Link
            to={seeAllHref}
            className="shrink-0 flex flex-col items-center justify-center rounded-lg border border-gold/20 hover:border-gold/50 transition-colors snap-start"
            style={{ width: 120, aspectRatio: "2/3" }}
          >
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-gold mb-2" />
            <span className="text-gold text-xs md:text-sm font-medium">See All</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
