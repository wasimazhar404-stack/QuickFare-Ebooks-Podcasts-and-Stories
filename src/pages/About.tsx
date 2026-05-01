import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Grid3x3,
  Globe,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  GraduationCap,
  Eye,
  Sparkles,
  HandHeart,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

/* ═══════════════════════ About Page ═══════════════════════ */
export default function AboutPage() {
  const language = useAppStore((s) => s.language);
  const t = (en: string, ur: string) => (language === "ur" ? ur : en);

  const [testimonialIdx, setTestimonialIdx] = useState(0);

  /* Hijri date (simplified approximation) */
  const hijriDate = "Ramadan 1445 AH";

  const stats = [
    { icon: BookOpen, value: 400, suffix: "+", label: t("Books Published", "کتابیں شائع"), labelUr: "کتابیں شائع" },
    { icon: Grid3x3, value: 20, suffix: "+", label: t("Categories", "زمرے"), labelUr: "زمرے" },
    { icon: Users, value: 50000, suffix: "+", label: t("Active Readers", "فعال قارئین"), labelUr: "فعال قارئین" },
    { icon: Globe, value: 15, suffix: "", label: t("Countries Reached", "ممالک"), labelUr: "ممالک" },
    { icon: Star, value: 4, suffix: ".9", label: t("App Rating", "ایپ کی درجہ بندی"), labelUr: "ایپ کی درجہ بندی" },
  ];

  const team = [
    { name: "Ahmad R.", role: t("Founder & CEO", "بانی اور سی ای او"), bio: t("Visionary behind QuickFare's mission", "QuickFare کے مشن کے پیچھے دور اندیش"), color: "bg-gold/15" },
    { name: "Fatima K.", role: t("Head of Content", "مواد کی سربراہ"), bio: t("Curates every book with care", "ہر کتاب کو احتیاط سے چنتی ہیں"), color: "bg-emerald/15" },
    { name: "Yusuf A.", role: t("Lead Designer", "لیڈ ڈیزائنر"), bio: t("Creates the cinematic experience", "سنیما جیسا تجربہ بناتے ہیں"), color: "bg-copper/15" },
    { name: "Zainab M.", role: t("Tech Lead", "ٹیک لیڈ"), bio: t("Builds the platform infrastructure", "پلیٹ فارم کی انفراسٹرکچر بناتی ہیں"), color: "bg-gold/15" },
    { name: "Omar H.", role: t("Head of Marketing", "مارکیٹنگ کے سربراہ"), bio: t("Spreads the word across 15 countries", "15 ممالک میں پیغام پھیلاتے ہیں"), color: "bg-emerald/15" },
    { name: "Aisha S.", role: t("Community Manager", "کمیونٹی مینیجر"), bio: t("Connects readers with authors", "قارئین کو مصنفین سے جوڑتی ہیں"), color: "bg-copper/15" },
  ];

  const principles = [
    { icon: Heart, title: t("Islamic Integrity", "اسلامی دیانت"), desc: t("Every book is vetted for Islamic authenticity and accuracy.", "ہر کتاب اسلامی صداقت اور درستگی کے لیے جانچی جاتی ہے۔") },
    { icon: Sparkles, title: t("Cinematic Quality", "سنیما جیسی کوالٹی"), desc: t("Hollywood-standard covers and production for every title.", "ہر عنوان کے لیے ہالی ووڈ معیار کے کورز اور پروڈکشن۔") },
    { icon: GraduationCap, title: t("Bilingual Excellence", "دو زبانی تعالی"), desc: t("Native-quality translations and original content in Urdu and English.", "اردو اور انگریزی میں مقامی معیار کے تراجم اور اصل مواد۔") },
    { icon: HandHeart, title: t("Family First", "خاندان پہلے"), desc: t("Parental controls, kids profiles, and age-appropriate content filtering.", "والدین کے کنٹرولز، بچوں کے پروفائلز، اور عمر کے مطابق مواد۔") },
    { icon: Eye, title: t("Affordable Access", "سستی رسائی"), desc: t("Pricing plans that work for every budget, from free to lifetime.", "ہر بجٹ کے لیے قیمتوں کا تعین، مفت سے لے کر زندگی بھر تک۔") },
    { icon: Lightbulb, title: t("Continuous Growth", "مسلسل نمو"), desc: t("New books added monthly across all categories.", "تمام زمرے میں ہر مہینے نئی کتابیں شامل کی جاتی ہیں۔") },
  ];

  const testimonials = [
    { quote: t("QuickFare changed how my family learns. My children now look forward to reading Seerah every evening.", "QuickFare نے میری فیملی کے سیکھنے کا طریقہ بدل دیا۔ میرے بچے اب ہر شام سیرت پڑھنے کے منتظر رہتے ہیں۔"), name: "Ahmad R.", location: "Karachi", role: t("Premium Member", "پریمیم ممبر") },
    { quote: t("The quality of these books is unlike anything I've seen. The covers alone make me want to read.", "ان کتابوں کی کوالٹی میں نے کبھی نہیں دیکھی۔ کورز مجھے پڑھنے پر مجبور کر دیتے ہیں۔"), name: "Fatima K.", location: "Dubai", role: t("Lifetime Member", "لائف ٹائم ممبر") },
    { quote: t("Finally, a platform that respects our values while delivering modern knowledge.", "آخرکار ایک ایسا پلیٹ فارم جو ہمارے اقدار کا احترام کرتے ہوئے جدید علم فراہم کرتا ہے۔"), name: "Yusuf A.", location: "London", role: t("Free Member", "مفت ممبر") },
    { quote: t("I bought the Ramadan collection for my parents. They haven't stopped reading since.", "میں نے اپنے والدین کے لیے رمضان مجموعہ خریدا۔ وہ تب سے پڑھنا نہیں چھوڑے۔"), name: "Zainab M.", location: "Toronto", role: t("Premium Member", "پریمیم ممبر") },
  ];

  /* Auto-advance testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-midnight text-white pt-16 md:pt-20 pb-12 md:pb-16">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/quickfare/covers/cover_050.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/80 to-midnight" />
        <div className="relative z-10 max-w-container-lg mx-auto px-4 lg:px-16 text-center pt-12 md:pt-16 pb-8 md:pb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-gold text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-3 md:mb-4"
          >
            {t("Our Story", "ہاری کہانی")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-playfair text-3xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight"
          >
            {t("Knowledge That Transforms", "علم جو تبدیل کرتا ہے")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[#A0A0B0] text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "QuickFare was born from a simple belief: every Muslim deserves access to world-class educational content. From the Quran to Artificial Intelligence, we curate knowledge that enriches lives.",
              "QuickFare ایک سادہ عقیدے سے پیدا ہوا: ہر مسلمان اعلیٰ معیار کی تعلیمی مواد کا حق دار ہے۔ قرآن سے لے کر مصنوعی ذہانت تک، ہم علم کو چن کر پیش کرتے ہیں جو زندگیوں کو enrich کرتا ہے۔"
            )}
          </motion.p>
        </div>
      </section>

      {/* ═══════ MISSION & VISION ═══════ */}
      <section className="max-w-container-xl mx-auto px-4 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left - Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-gold" />
              </div>
              <span className="text-gold text-[10px] md:text-xs font-semibold tracking-wider uppercase">
                {hijriDate}
              </span>
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4">
              {t("Illuminating Minds, One Book at a Time", "ذہنوں کو روشن کرنا، ایک کتاب ایک وقت")}
            </h2>
            <p className="text-[#A0A0B0] text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
              {t(
                "To make premium Islamic and global educational content accessible to every Urdu and English-speaking Muslim worldwide. We believe knowledge is the foundation of faith, progress, and personal growth.",
                "دنیا بھر میں اردو اور انگریزی بولنے والے ہر مسلمان کو پریمیم اسلامی اور عالمی تعلیمی مواد تک رسائی فراہم کرنا۔ ہمارا عقیدہ ہے کہ علم ایمان، ترقی، اور ذاتی نمو کی بنیاد ہے۔"
              )}
            </p>

            <div className="space-y-2 md:space-y-3">
              {[
                { title: t("Faith-First", "ایمان پہلے"), desc: t("Every book aligns with Islamic principles", "ہر کتاب اسلامی اصولوں کے مطابق ہے") },
                { title: t("Excellence", "تعالی"), desc: t("Hollywood-quality production standards", "ہالی ووڈ معیار کی پروڈکشن") },
                { title: t("Accessibility", "رسائی"), desc: t("Affordable pricing for all", "سب کے لیے سستی قیمتیں") },
                { title: t("Community", "کمیونٹی"), desc: t("Built by Muslims, for Muslims", "مسلمانوں نے بنایا، مسلمانوں کے لیے") },
              ].map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">{v.title}</p>
                    <p className="text-[#A0A0B0] text-xs">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            <div className="col-span-2 rounded-xl overflow-hidden aspect-video">
              <img src="/quickfare/covers/cover_001.jpg" alt="Hajj" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square">
              <img src="/quickfare/covers/cover_050.jpg" alt="Quran" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square">
              <img src="/quickfare/covers/cover_400.jpg" alt="Wisdom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="relative bg-midnight-100 py-12 md:py-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald via-emerald-light to-transparent opacity-50" />
        <div className="max-w-container-xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-gold mb-2 md:mb-3" />
                <CountUpNumber target={stat.value} suffix={stat.suffix} />
                <p className="text-[#A0A0B0] text-xs md:text-sm mt-1">{language === "ur" ? stat.labelUr : stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 md:mt-12 text-center"
          >
            <p className="font-playfair text-base md:text-xl lg:text-2xl text-white italic max-w-2xl mx-auto">
              {t(
                "In 2 years, QuickFare has become the largest digital Islamic library in Urdu.",
                "2 سالوں میں QuickFare اردو میں سب سے بڑی ڈیجیٹل اسلامی لائبریری بن چکی ہے۔"
              )}
            </p>
            <p className="text-[#A0A0B0] text-xs md:text-sm mt-2 md:mt-3">— {t("QuickFare Founding Team", "QuickFare کی بانی ٹیم")}</p>
          </motion.blockquote>
        </div>
      </section>

      {/* ═══════ TEAM ═══════ */}
      <section className="max-w-container-xl mx-auto px-4 lg:px-16 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-2 md:mb-3"
          >
            {t("The People Behind QuickFare", "QuickFare کے پیچھے کے لوگ")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#A0A0B0] text-sm md:text-base max-w-xl mx-auto"
          >
            {t("Passionate Muslims building the future of Islamic education", "مسلمان مستقبل اسلامی تعلیم کی تعمیر کر رہے ہیں")}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-midnight-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/5 hover:border-gold/30 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full mx-auto mb-3 md:mb-4 border-[3px] border-gold/30 group-hover:border-gold transition-colors overflow-hidden ${member.color} flex items-center justify-center`}>
                <span className="font-outfit text-xl md:text-2xl font-bold text-white/80">{member.name.charAt(0)}</span>
              </div>
              <h3 className="font-outfit text-base md:text-lg font-semibold text-white mb-0.5 md:mb-1">{member.name}</h3>
              <p className="text-gold text-xs md:text-sm font-medium mb-1 md:mb-2">{member.role}</p>
              <p className="text-[#A0A0B0] text-[11px] md:text-xs leading-relaxed">{member.bio}</p>
              <div className="flex items-center justify-center gap-3 mt-3 md:mt-4">
                <button className="text-[#6B6B7B] hover:text-white transition-colors p-1 min-h-[32px] min-w-[32px]">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
                <button className="text-[#6B6B7B] hover:text-white transition-colors p-1 min-h-[32px] min-w-[32px]">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative bg-midnight-100 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/quickfare/covers/cover_100.jpg')] bg-cover bg-center opacity-[0.04]" />
        <div className="relative z-10 max-w-container-lg mx-auto px-4 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-8 md:mb-12"
          >
            {t("What Readers Say", "قارئین کیا کہتے ہیں")}
          </motion.h2>

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-1 mb-4 md:mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 md:w-5 md:h-5 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="font-playfair text-base md:text-xl lg:text-2xl text-white italic leading-relaxed mb-6 md:mb-8 px-2 md:px-0">
                    "{testimonials[testimonialIdx].quote}"
                  </p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/15 flex items-center justify-center">
                      <span className="font-outfit font-bold text-gold text-sm md:text-base">{testimonials[testimonialIdx].name.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">{testimonials[testimonialIdx].name}</p>
                      <p className="text-[#A0A0B0] text-xs">{testimonials[testimonialIdx].location}</p>
                      <p className="text-gold text-[10px] md:text-[11px]">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors min-h-[48px] min-w-[48px]"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`h-2 md:h-2.5 rounded-full transition-all ${i === testimonialIdx ? "bg-gold w-4 md:w-6" : "bg-white/20 w-2 md:w-2.5 hover:bg-white/40"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors min-h-[48px] min-w-[48px]"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PRINCIPLES ═══════ */}
      <section className="max-w-container-xl mx-auto px-4 lg:px-16 py-12 md:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-8 md:mb-10 text-center"
        >
          {t("Our Principles", "ہارے اصول")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-midnight-100 rounded-xl p-6 md:p-8 border border-white/5 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-3 md:mb-4">
                <p.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
              </div>
              <h3 className="font-outfit text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{p.title}</h3>
              <p className="text-[#A0A0B0] text-xs md:text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="relative py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 border-t border-b border-gold/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="relative z-10 max-w-container-md mx-auto px-4 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4"
          >
            {t("Join the QuickFare Community", "QuickFare کمیونٹی سے جڑیں")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#A0A0B0] text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto"
          >
            {t(
              "50,000+ readers are already growing with us. Start your journey today.",
              "50,000+ قارئین پہلے ہی ہمارے ساتھ بڑھ رہے ہیں۔ آج ہی اپنا سفر شروع کریں۔"
            )}
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto bg-gold text-midnight font-semibold px-6 md:px-8 py-3 md:py-3.5 rounded-full text-sm md:text-base hover:bg-gold-light transition-colors flex items-center justify-center gap-2 min-h-[48px]"
            >
              {t("Get Started Free", "مفت شروع کریں")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/browse"
              className="w-full sm:w-auto border border-gold/40 text-gold rounded-full px-6 md:px-8 py-3 md:py-3.5 text-sm font-medium hover:bg-gold/10 transition-colors flex items-center justify-center min-h-[48px]"
            >
              {t("Browse Collection", "مجموعہ دیکھیں")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Animated counter ─── */
function CountUpNumber({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const dur = 2000;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * ease));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-outfit text-2xl md:text-3xl lg:text-4xl font-bold text-white">
      {val.toLocaleString()}{suffix}
    </div>
  );
}

/* Lucide Check icon for mission list */
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
  );
}
