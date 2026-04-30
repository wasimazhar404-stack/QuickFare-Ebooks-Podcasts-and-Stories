import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  BookOpen,
  Globe,
  Compass,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const navLinks = [
  { label: "Home", labelUr: "ہوم", href: "/", icon: Compass },
  { label: "Browse", labelUr: "براؤز", href: "/browse", icon: Search },
  { label: "Categories", labelUr: "زمرے", href: "/categories", icon: BookOpen },
  { label: "My Library", labelUr: "میری لائبریری", href: "/library", icon: BookOpen },
  { label: "Pricing", labelUr: "قیمتیں", href: "/pricing", icon: Globe },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const language = useAppStore((s) => s.language);
  const toggleLanguage = useAppStore((s) => s.toggleLanguage);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => location.pathname === href;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-nav border-b border-gold-dark/15 shadow-nav"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Mobile: 64px height, Desktop: 72px */}
        <div className="h-16 lg:h-[72px] max-w-container-2xl mx-auto flex items-center justify-between px-4 lg:px-16">
          {/* Left: Hamburger (mobile only) */}
          <div className="flex items-center lg:hidden w-12">
            <button
              className="text-white p-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center: Logo (mobile centered, desktop left) */}
          <Link to="/" className="flex items-center justify-center gap-2 group lg:justify-start">
            <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-gold" />
            <span className="font-cinzel font-extrabold text-xl lg:text-2xl text-white tracking-tight">
              Quick<span className="text-gold">Fare</span>
              <span className="text-gold ml-0.5">.</span>
            </span>
          </Link>

          {/* Desktop Nav - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-inter font-medium text-sm transition-colors duration-200 group ${
                  isActive(link.href) ? "text-gold" : "text-[#A0A0B0] hover:text-white"
                }`}
              >
                {language === "ur" ? link.labelUr : link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-200 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-2 lg:gap-4 w-12 lg:w-auto">
            {/* Search */}
            <div className="relative hidden sm:block">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === "ur" ? "تلاش کریں..." : "Search..."}
                      className="w-full h-9 pl-3 pr-8 bg-midnight-100 border border-white/10 rounded-full text-white text-sm placeholder:text-[#A0A0B0] focus:outline-none focus:border-gold"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-[#A0A0B0] hover:text-gold transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white p-1"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden text-[#A0A0B0] hover:text-gold transition-colors p-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 border border-gold/40 rounded-full px-3 py-1 text-xs font-medium text-gold hover:bg-gold/10 transition-colors min-h-[32px]"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "ur" ? "EN" : "اردو"}
            </button>

            <Link
              to="/login"
              className="hidden lg:inline-flex items-center gap-2 border border-gold/60 text-gold rounded-full px-5 py-2 text-sm font-medium hover:bg-gold hover:text-midnight transition-all duration-200"
            >
              {language === "ur" ? "لاگ ان" : "Sign In"}
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ====== Mobile Full-Screen Overlay Menu ====== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-gradient-to-br from-gold-dark via-gold to-gold-light lg:hidden"
          >
            {/* Close Button - top right */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-midnight p-3 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full pt-20 pb-8 px-6">
              {/* Logo in menu */}
              <div className="mb-10 flex items-center justify-center">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-7 h-7 text-midnight" />
                  <span className="font-cinzel font-extrabold text-2xl text-midnight">
                    Quick<span className="text-midnight">Fare</span>
                    <span className="text-midnight ml-0.5">.</span>
                  </span>
                </Link>
              </div>

              {/* Nav Links - stacked vertically */}
              <nav className="flex-1 flex flex-col items-center gap-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 + 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full"
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-center gap-3 w-full py-4 min-h-[56px] text-lg font-inter font-semibold rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-midnight/20 text-midnight"
                            : "text-midnight/80 hover:bg-midnight/10"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {language === "ur" ? link.labelUr : link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.35 }}
                className="flex flex-col items-center gap-3 pt-6 border-t border-midnight/15"
              >
                <button
                  onClick={() => {
                    toggleLanguage();
                  }}
                  className="flex items-center gap-2 border border-midnight/30 rounded-full px-5 py-3 text-sm font-medium text-midnight min-h-[48px]"
                >
                  <Globe className="w-4 h-4" />
                  {language === "ur" ? "Switch to English" : "اردو میں تبدیل کریں"}
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-midnight text-gold rounded-full px-10 py-3.5 text-base font-semibold min-h-[52px] flex items-center justify-center w-full max-w-xs"
                >
                  {language === "ur" ? "لاگ ان" : "Sign In"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
