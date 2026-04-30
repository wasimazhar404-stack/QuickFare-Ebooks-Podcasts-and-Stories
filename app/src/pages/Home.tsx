import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Film,
  Moon,
  Languages,
  Target,
  Users,
  CreditCard,
  Star,
  Quote,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import IslamicWidgetBar from "@/components/IslamicWidgetBar";
import CategoryRow from "@/components/CategoryRow";
import { books } from "@/data/books";

// Uploaded books ONLY — show only the 53 premium uploaded covers
const uploadedBookIds = new Set([3,6,8,9,10,11,13,14,15,25,28,31,33,36,37,38,39,40,41,44,45,46,47,48,49,50,53,54,55,56,57,70,71,82,93,104,148,154,156,158,160,184,187,189,195,197,203,209,210,211,212,213,214,215,216,219,222,224,225,409,410]);
const uploadedBooks = books.filter((b) => uploadedBookIds.has(b.id));

// Home page shows ONLY uploaded books
const featuredBooks = uploadedBooks.slice(0, 6);
const trendingBooks = uploadedBooks.slice(0, 12);
const newBooks = uploadedBooks.slice(12, 24);
const moreBooks = uploadedBooks.slice(24);

const categoryTiles = [
  { name: "Hajj & Umrah", icon: BookOpen, cover: "/covers/cover_001.jpg", count: 24 },
  { name: "Quran & Hadith", icon: BookOpen, cover: "/covers/cover_050.jpg", count: 32 },
  { name: "Islamic Finance", icon: BookOpen, cover: "/covers/cover_200.jpg", count: 18 },
  { name: "AI & Technology", icon: BookOpen, cover: "/covers/cover_120.jpg", count: 20 },
  { name: "Travel & Ziyarat", icon: BookOpen, cover: "/covers/cover_004.jpg", count: 15 },
  { name: "Cooking & Food", icon: BookOpen, cover: "/covers/cover_100.jpg", count: 22 },
  { name: "Parenting & Family", icon: BookOpen, cover: "/covers/cover_080.jpg", count: 19 },
  { name: "Self-Defense", icon: BookOpen, cover: "/covers/cover_250.jpg", count: 12 },
];

const features = [
  {
    icon: Film,
    title: "Hollywood-Quality Covers",
    titleUr: "ہالی ووڈ کوالٹی کے کورز",
    description:
      "Every book features a stunning cinematic cover that makes reading feel like an experience, not a chore.",
    color: "gold",
  },
  {
    icon: Moon,
    title: "Islamic-First Design",
    titleUr: "اسلامی ڈیزائن",
    description:
      "Prayer times, Qibla direction, Hijri calendar, and family-friendly content built into every page.",
    color: "emerald",
  },
  {
    icon: Languages,
    title: "Urdu + English",
    titleUr: "اردو + انگریزی",
    description:
      "Seamlessly switch between languages. All UI, categories, and descriptions available in both.",
    color: "gold",
  },
  {
    icon: Target,
    title: "Smart Progress",
    titleUr: "سمارٹ پیش رفت",
    description:
      "Track reading time, completion percentage, streaks, and earn achievements as you learn.",
    color: "gold",
  },
  {
    icon: Users,
    title: "For the Whole Family",
    titleUr: "پورے خاندان کے لیے",
    description:
      "Kids profiles with filtered content, parental controls, reading time limits, and safe discovery.",
    color: "emerald",
  },
  {
    icon: CreditCard,
    title: "Flexible Pricing",
    titleUr: "لچکدار قیمتیں",
    description:
      "Buy individual books, get themed bundles, or subscribe for unlimited access. You choose.",
    color: "gold",
  },
];

const stats = [
  { number: "400+", label: "Books", labelUr: "کتابیں" },
  { number: "20+", label: "Categories", labelUr: "زمرے" },
  { number: "50K+", label: "Readers", labelUr: "قارئین" },
  { number: "4.9", label: "App Rating", labelUr: "ایپ کی درجہ بندی" },
];

const testimonials = [
  {
    quote:
      "QuickFare transformed how my family learns. My children now look forward to reading about the Seerah every evening. The quality of these books is unlike anything I've seen.",
    name: "Ahmad R.",
    location: "Karachi, Pakistan",
    role: "Father of 3, QuickFare Subscriber",
  },
  {
    quote:
      "As a working professional, I love having access to Islamic knowledge on the go. The bilingual feature is a game-changer for my parents who prefer Urdu.",
    name: "Fatima K.",
    location: "London, UK",
    role: "Software Engineer",
  },
  {
    quote:
      "The book covers are absolutely stunning. My kids think they're browsing a movie streaming app! They've never been more excited about Islamic education.",
    name: "Omar S.",
    location: "Dubai, UAE",
    role: "Parent & Educator",
  },
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () =>
    setTestimonialIndex((prev: number) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setTestimonialIndex(
      (prev: number) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <div className="bg-midnight">
      {/* Hero - full mobile viewport */}
      <HeroCarousel featuredBooks={featuredBooks} />

      {/* Islamic Widget Bar - collapsible on mobile */}
      <IslamicWidgetBar />

      {/* Trending Now */}
      <CategoryRow
        title="Trending Now"
        subtitle="Most-read books this week"
        books={trendingBooks}
        seeAllHref="/browse?trending=true"
      />

      {/* Category Explorer */}
      <section className="py-8 md:py-12 lg:py-16 bg-midnight-100">
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-10"
          >
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-white mb-2">
              Explore by Category
            </h2>
            <p className="text-[#A0A0B0] text-sm md:text-base">
              From Quran & Hadith to AI & Business — find your path
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {categoryTiles.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/browse?category=${encodeURIComponent(cat.name)}`}>
                  <div
                    className="relative rounded-xl overflow-hidden group cursor-pointer border border-gold/20 hover:border-gold/60 transition-all duration-500"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={cat.cover}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2 group-hover:scale-115 transition-transform duration-300" />
                      <h3 className="text-white font-playfair font-semibold text-sm md:text-base lg:text-lg text-center leading-tight">
                        {cat.name}
                      </h3>
                      <span className="text-gold text-[10px] md:text-xs mt-0.5 md:mt-1">
                        {cat.count} books
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 md:mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 border border-gold text-gold font-medium px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-gold hover:text-midnight transition-all text-sm md:text-base min-h-[48px]"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection - Editor's Picks */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-container-2xl mx-auto px-4 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-gold/30"
            style={{ minHeight: 400 }}
          >
            <img
              src="/covers/cover_001.jpg"
              alt="Featured"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/40" />

            <div className="relative z-10 p-5 md:p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
              <div className="max-w-lg">
                <span className="inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-gold/20 text-gold text-[10px] font-semibold tracking-wider uppercase mb-3 md:mb-4 border border-gold/30">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Editor's Pick
                </span>
                <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4">
                  Ramadan Reading Collection
                </h2>
                <p className="text-[#A0A0B0] text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
                  Curated essential reads for the blessed month — from Quran
                  reflections to fasting guides, charity principles to night
                  prayers.
                </p>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold" />
                    <span className="text-white text-sm">12 Books</span>
                  </div>
                  <div className="text-gold font-playfair font-bold text-xl md:text-2xl">
                    ₨19.99
                    <span className="text-[#6B6B7B] text-sm md:text-base line-through ml-2 font-normal">
                      ₨49.99
                    </span>
                  </div>
                </div>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 gold-shimmer text-midnight font-bold px-6 py-3 md:px-8 rounded-full hover:opacity-90 transition-opacity min-h-[48px] text-sm md:text-base"
                >
                  Get Collection
                </Link>
              </div>

              {/* Mini Book Stack - hidden on mobile */}
              <div className="hidden lg:flex items-center gap-[-30px]">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ rotate: 0, x: -20 }}
                    whileInView={{
                      rotate: [-5, -2, 2, 5][i],
                      x: i * 30,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-24 xl:w-28 rounded-lg overflow-hidden shadow-book"
                    style={{ aspectRatio: "2/3", zIndex: 4 - i }}
                  >
                    <img
                      src={`/covers/cover_${String(1 + i * 10).padStart(3, "0")}.jpg`}
                      alt="Collection book"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <CategoryRow
        title="New Arrivals"
        subtitle="Fresh books added this week"
        books={newBooks}
        seeAllHref="/browse?new=true"
        showNewBadge
      />

      {/* Islamic Essentials */}
      <CategoryRow
        title="Islamic Essentials"
        subtitle="Foundational knowledge for every Muslim"
        books={moreBooks}
        seeAllHref="/browse?category=Islamic"
      />

      {/* Global Knowledge */}
      <CategoryRow
        title="Global Knowledge"
        subtitle="Expand your horizons with world-class content"
        books={moreBooks}
        seeAllHref="/browse?category=Global"
      />

      {/* Why QuickFare */}
      <section className="py-12 md:py-16 lg:py-20 bg-midnight relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="max-w-container-xl mx-auto px-4 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4">
              Why QuickFare?
            </h2>
            <p className="text-[#A0A0B0] text-sm md:text-base lg:text-lg max-w-xl mx-auto">
              The premium reading experience built for Muslims worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-midnight-100 border border-white/5 rounded-xl p-6 md:p-8 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <feature.icon
                    className={`w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-5 ${
                      feature.color === "gold"
                        ? "text-gold"
                        : "text-emerald-light"
                    } group-hover:scale-110 transition-transform duration-300`}
                  />
                </motion.div>
                <h3 className="font-playfair text-lg md:text-xl text-white mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#A0A0B0] text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-midnight-100 relative">
        <div className="absolute top-0 left-0 right-0 h-2 islamic-bar" />
        <div className="max-w-container-xl mx-auto px-4 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center px-3 md:px-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="font-playfair font-bold text-3xl md:text-4xl lg:text-5xl text-gold mb-1 md:mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-[#A0A0B0] text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <div className="text-center mt-8 md:mt-10">
            <p className="text-[#6B6B7B] text-xs mb-3 md:mb-4">
              Trusted by readers in
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {["Pakistan", "India", "UAE", "Saudi Arabia", "UK", "USA"].map(
                (country) => (
                  <span
                    key={country}
                    className="text-[#6B6B7B] text-[10px] md:text-xs hover:text-gold transition-colors cursor-default"
                  >
                    {country}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight to-midnight-100 opacity-85" />
        <div className="max-w-container-lg mx-auto px-4 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="relative max-w-3xl mx-auto">
              <Quote className="absolute -top-6 md:-top-8 left-0 md:left-4 w-12 h-12 md:w-20 md:h-20 text-gold/10" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-playfair text-lg md:text-xl lg:text-2xl xl:text-3xl text-white italic leading-relaxed mb-6 md:mb-8 px-2">
                    "{testimonials[testimonialIndex].quote}"
                  </p>

                  <div className="flex items-center justify-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-midnight-300 flex items-center justify-center">
                      <span className="text-gold font-playfair font-bold text-base md:text-lg">
                        {testimonials[testimonialIndex].name[0]}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-inter font-semibold text-sm md:text-base">
                        {testimonials[testimonialIndex].name}
                      </p>
                      <p className="text-[#A0A0B0] text-xs md:text-sm">
                        {testimonials[testimonialIndex].location}
                      </p>
                      <p className="text-emerald-light text-[10px] md:text-xs">
                        {testimonials[testimonialIndex].role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-3 md:mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold fill-gold"
                      />
                    ))}
                    <span className="ml-2 text-emerald text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full bg-emerald/20">
                      Verified Reader
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-3 mt-6 md:mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors min-h-[48px] min-w-[48px]"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === testimonialIndex
                        ? "bg-gold w-4 md:w-6"
                        : "bg-white/30 w-2 hover:bg-white/50"
                    }`}
                  />
                ))}
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors min-h-[48px] min-w-[48px]"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 md:py-16 bg-midnight-100 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 gold-shimmer" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-container-lg mx-auto px-4 lg:px-16 text-center"
        >
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4">
            Start Your Reading Journey Today
          </h2>
          <p className="text-[#A0A0B0] text-sm md:text-base lg:text-lg max-w-xl mx-auto mb-6 md:mb-8">
            Join 50,000+ readers discovering knowledge that matters. First book
            free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-midnight font-bold px-8 md:px-10 py-3.5 md:py-4 rounded-full text-base md:text-lg hover:bg-gold-light transition-all duration-200 hover:scale-[1.02] animate-pulse-glow min-h-[52px]"
            >
              Get Started Free
            </Link>
            <Link
              to="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gold/40 text-gold rounded-full px-8 py-3.5 text-sm font-medium hover:bg-gold/10 transition-colors min-h-[48px]"
            >
              Browse Collection
            </Link>
          </div>
          <p className="text-[#6B6B7B] text-[10px] md:text-xs mt-3 md:mt-4">
            No credit card required &bull; Cancel anytime
          </p>
        </motion.div>
      </section>
    </div>
  );
}
