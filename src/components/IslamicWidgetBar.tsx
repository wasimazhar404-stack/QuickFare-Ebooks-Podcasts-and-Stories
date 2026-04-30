import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, MapPin, Moon, Clock, ChevronDown, ChevronUp } from "lucide-react";

export default function IslamicWidgetBar() {
  const [collapsed, setCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [countdown, setCountdown] = useState("2h 15m");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 55, 0);
      if (target < now) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${h}h ${m}m`);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isFriday = new Date().getDay() === 5;

  // On mobile, collapsed = single line with prayer countdown
  // On desktop, not collapsed initially (full bar shown)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const showCollapsed = isMobile ? !scrolled : scrolled;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="sticky top-[72px] z-40 islamic-bar border-b border-white/5 transition-all duration-300"
      style={{ height: showCollapsed ? 44 : isMobile ? 56 : 56 }}
    >
      <div className="max-w-container-2xl mx-auto h-full flex items-center justify-between px-4 lg:px-16">
        {/* Hijri Date - always visible */}
        <div className="flex items-center gap-2 shrink-0">
          <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold" />
          <span className="text-white text-[11px] md:text-sm font-medium">
            15 Ramadan 1446 AH
          </span>
        </div>

        {/* Mobile: show next prayer + countdown, tap to expand */}
        {isMobile ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/10 active:bg-gold/20 transition-colors"
          >
            <Clock className="w-3 h-3 text-emerald-light" />
            <span className="text-gold-light text-[11px] font-semibold">
              Maghrib {countdown}
            </span>
            {collapsed ? (
              <ChevronDown className="w-3 h-3 text-gold/60" />
            ) : (
              <ChevronUp className="w-3 h-3 text-gold/60" />
            )}
          </button>
        ) : (
          /* Desktop: full expanded view */
          !showCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-light" />
                <span className="text-white/70 text-xs">Next Prayer</span>
              </div>
              <span className="text-gold-light text-sm font-semibold">
                Maghrib in {countdown}
              </span>
              <div className="w-20 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
          )
        )}

        {/* Desktop expanded extras */}
        {!showCollapsed && !isMobile && (
          <>
            <div className="hidden lg:flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 267 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <Compass className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-white/80 text-xs">
                Qibla 267&deg; SW
              </span>
            </div>

            {isFriday && (
              <div className="hidden sm:flex items-center">
                <span className="bg-copper text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                  Jummah Mubarak!
                </span>
              </div>
            )}
          </>
        )}

        {/* Location - always visible */}
        <div className="flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3 h-3 text-[#6B6B7B]" />
          <span className="text-[#6B6B7B] text-[11px] md:text-xs">Karachi, Pakistan</span>
        </div>
      </div>

      {/* Mobile expanded: show extra details */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-midnight-100/50 border-b border-white/5"
          >
            <div className="max-w-container-2xl mx-auto px-4 py-3 flex items-center justify-around">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-light" />
                <span className="text-white/70 text-xs">Next Prayer</span>
              </div>
              <span className="text-gold-light text-xs font-semibold">
                Maghrib in {countdown}
              </span>
              <div className="w-16 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: "65%" }} />
              </div>
              <div className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-gold" />
                <span className="text-white/80 text-xs">267&deg; SW</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
