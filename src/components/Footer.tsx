import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Send,
  MapPin,
  Mail,
  ChevronDown,
} from "lucide-react";

const browseLinks = [
  "Hajj & Umrah",
  "Quran & Hadith",
  "Seerah",
  "Islamic Finance",
  "AI & Technology",
  "Travel & Ziyarat",
  "Cooking & Food",
  "Parenting & Family",
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 md:border-none pb-4 md:pb-0">
      {/* Mobile: tap to toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 md:py-0 md:cursor-default md:pointer-events-none"
      >
        <h4 className="font-inter font-semibold text-white text-base md:text-sm">
          {title}
        </h4>
        <ChevronDown
          className={`w-4 h-4 text-[#A0A0B0] md:hidden transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mobile: animate open/close, Desktop: always visible */}
      <AnimatePresence initial={false}>
        {(open || typeof window !== "undefined" && window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:!h-auto md:!opacity-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-midnight-100 border-t border-gold/20">
      {/* Islamic geometric divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-container-2xl mx-auto px-4 lg:px-16 py-8 md:py-16 lg:pb-8">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-midnight-200 rounded-2xl p-4 md:p-6 lg:p-10 mb-10 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6"
        >
          <div className="text-center md:text-left">
            <h3 className="font-playfair text-xl md:text-2xl text-white mb-1 md:mb-2">
              Stay Updated
            </h3>
            <p className="text-[#A0A0B0] text-xs md:text-sm">
              Get notified about new books and special collections
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 bg-midnight border border-white/10 rounded-lg px-3 md:px-4 py-3 text-sm text-white placeholder:text-[#6B6B7B] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <button className="bg-gold text-midnight font-semibold px-4 md:px-6 py-3 rounded-lg text-sm hover:bg-gold-light transition-colors flex items-center gap-2 shrink-0 min-h-[48px]">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </div>
        </motion.div>

        {/* Footer Sections - Mobile: single column collapsible, Desktop: 4-col grid */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-10 mb-10 md:mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left pb-6 md:pb-0 border-b border-white/10 md:border-none"
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-gold" />
              <span className="font-outfit font-extrabold text-xl text-white">
                Quick<span className="text-gold">Fare</span>
              </span>
            </Link>
            <p className="text-[#A0A0B0] text-sm leading-relaxed mb-6 max-w-xs mx-auto md:mx-0">
              Premium Islamic & Global Educational Ebooks. Cinematic reading experience for Muslims worldwide.
            </p>
            {/* Social Icons - larger touch targets on mobile */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              {[Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gold hover:scale-110 hover:text-gold-light transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Browse - collapsible on mobile */}
          <CollapsibleSection title="Browse">
            <ul className="space-y-2.5 md:space-y-3 pt-1 pb-2 md:pt-0 md:pb-0">
              {browseLinks.map((link) => (
                <li key={link}>
                  <Link
                    to={`/browse?category=${encodeURIComponent(link)}`}
                    className="text-[#A0A0B0] text-sm hover:text-gold transition-colors block py-1 md:py-0"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Company - collapsible on mobile */}
          <CollapsibleSection title="Company">
            <ul className="space-y-2.5 md:space-y-3 pt-1 pb-2 md:pt-0 md:pb-0">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#A0A0B0] text-sm hover:text-gold transition-colors block py-1 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Support - collapsible on mobile */}
          <CollapsibleSection title="Support">
            <div className="pt-1 pb-2 md:pt-0 md:pb-0">
              <ul className="space-y-2.5 md:space-y-3 mb-5 md:mb-6">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[#A0A0B0] text-sm hover:text-gold transition-colors block py-1 md:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#6B6B7B] text-xs">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>support@quickfare.app</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#6B6B7B] text-xs">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-5 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-[#6B6B7B] text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} QuickFare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#6B6B7B] text-xs">English</span>
            <span className="text-[#6B6B7B] text-xs">اردو</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
