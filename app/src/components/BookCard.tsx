import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Book } from "@/data/books";
import { useAppStore } from "@/store/useAppStore";

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const isInWatchlist = useAppStore((s) => s.isInWatchlist(book.id));

  const toggleWatchlist = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) removeFromWatchlist(book.id);
    else addToWatchlist(book.id);
  };

  const handleTouchStart = useCallback(() => setPressed(true), []);
  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setPressed(false), 150);
  }, []);

  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative shrink-0 cursor-pointer w-[140px] md:w-[160px] lg:w-[200px]"
      onMouseEnter={() => !isTouchDevice && setHovered(true)}
      onMouseLeave={() => !isTouchDevice && setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link to={`/book/${book.id}`} className="block">
        {/* Clean Cover — NO badges, NO text, NO overlays */}
        <motion.div
          animate={{
            scale: hovered ? 1.04 : pressed ? 0.97 : 1,
            y: hovered ? -6 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 ${
            hovered && !isTouchDevice
              ? "shadow-2xl shadow-gold/20 ring-2 ring-gold/30"
              : "ring-1 ring-white/5"
          }`}
          style={{ aspectRatio: "2/3" }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-midnight-200 animate-pulse z-0" />
          )}
          
          <img
            src={book.cover}
            alt={book.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Overlay — desktop only */}
          {!isTouchDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2, delay: hovered ? 0.08 : 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] gap-2 z-20"
            >
              <button
                onClick={toggleWatchlist}
                className="absolute top-2 right-2 text-white hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center z-30"
                aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {isInWatchlist ? (
                  <BookmarkCheck className="w-5 h-5 text-gold" />
                ) : (
                  <BookmarkPlus className="w-5 h-5" />
                )}
              </button>
              <Link
                to={`/book/${book.id}`}
                className="flex items-center gap-2 bg-gold text-midnight font-semibold px-5 py-2 rounded-full text-sm hover:bg-gold-light transition-colors min-h-[44px]"
              >
                <Play className="w-4 h-4" />
                Preview
              </Link>
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
