import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Users,
  Shield,
  ChevronDown,
  Sparkles,
  Zap,
  Crown,
  Star,
  CreditCard,
  Lock,
  Gift,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

/* ═══════════════════════ Pricing Page ═══════════════════════ */
export default function PricingPage() {
  const language = useAppStore((s) => s.language);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = (en: string, ur: string) => (language === "ur" ? ur : en);

  const plans = [
    {
      key: "starter",
      name: t("Starter", "اسٹارٹر"),
      price: t("Free", "مفت"),
      period: t("Forever", "ہمیشہ کے لیے"),
      features: [
        { text: t("3 free books", "3 مفت کتابیں"), included: true },
        { text: t("Basic reader", "بنیادی ریڈر"), included: true },
        { text: t("Community support", "کمیونٹی سپورٹ"), included: true },
        { text: t("No downloads", "ڈاؤن لوڈ نہیں"), included: false },
        { text: t("No notes/highlights", "نوٹس/ہائیلائٹس نہیں"), included: false },
        { text: t("Limited categories", "محدود زمرے"), included: false },
      ],
      cta: t("Get Started", "شروع کریں"),
      popular: false,
      bestValue: false,
      icon: Zap,
    },
    {
      key: "premium",
      name: t("Premium", "پریمیم"),
      price: billing === "monthly" ? "₨999" : "₨9,999",
      period: billing === "monthly" ? t("/month", "/ماہ") : t("/year", "/سال"),
      savings: billing === "yearly" ? t("Save ₨1,989/year", "سالانہ ₨1,989 بچت") : null,
      features: [
        { text: t("Unlimited books", "لا محدود کتابیں"), included: true },
        { text: t("All 400+ titles", "تمام 400+ کتابیں"), included: true },
        { text: t("Advanced reader", "ایڈوانس ریڈر"), included: true },
        { text: t("Notes & highlights", "نوٹس اور ہائیلائٹس"), included: true },
        { text: t("Offline downloads", "آف لائن ڈاؤن لوڈز"), included: true },
        { text: t("Family sharing (3 profiles)", "خاندان کے ساتھ شیئرنگ (3 پروفائلز)"), included: true },
        { text: t("Priority support", "ترجیحی سپورٹ"), included: true },
      ],
      cta: t("Start Premium", "پریمیم شروع کریں"),
      popular: true,
      bestValue: false,
      icon: Crown,
    },
    {
      key: "lifetime",
      name: t("Lifetime", "زندگی بھر"),
      price: "₨4,999",
      period: t("One-time payment", "ایک بار ادائیگی"),
      value: t("Worth ₨35,964+ over 3 years", "3 سالوں میں ₨35,964+ قدر"),
      features: [
        { text: t("Everything in Premium", "پریمیم میں سب کچھ"), included: true },
        { text: t("Lifetime access", "زندگی بھر کی رسائی"), included: true },
        { text: t("All future books", "تمام آنے والی کتابیں"), included: true },
        { text: t("Family sharing (5 profiles)", "خاندان کے ساتھ شیئرنگ (5 پروفائلز)"), included: true },
        { text: t("VIP support", "VIP سپورٹ"), included: true },
        { text: t("Exclusive early access", "خصوصی ابتدائی رسائی"), included: true },
      ],
      cta: t("Get Lifetime", "زندگی بھر حاصل کریں"),
      popular: false,
      bestValue: true,
      icon: Sparkles,
    },
  ];

  const bundles = [
    { name: t("Ramadan Collection", "رمضان مجموعہ"), books: 8, price: 1499, was: 3999, tag: t("Popular", "مقبول") },
    { name: t("Future Skills Bundle", "مستقبل کے ہنر بنڈل"), books: 10, price: 1999, was: 4999, tag: null },
    { name: t("Family Essentials", "خاندانی ضروریات"), books: 6, price: 999, was: 2999, tag: null },
    { name: t("Quran & Hadith Essentials", "قرآن و حدیث ضروریات"), books: 8, price: 999, was: 2499, tag: null },
    { name: t("Travel & Ziyarat Pack", "سفر و زیارت پیک"), books: 6, price: 899, was: 2199, tag: null },
    { name: t("Kids Learning Bundle", "بچوں کا سیکھنے والا بنڈل"), books: 5, price: 699, was: 1799, tag: null },
  ];

  const faqs = [
    {
      q: t("Can I switch plans anytime?", "کیا میں کسی بھی وقت پلان تبدیل کر سکتا ہوں؟"),
      a: t("Yes, you can upgrade or downgrade at any time. Changes take effect immediately.", "ہاں، آپ کسی بھی وقت اپ گریڈ یا ڈاؤن گریڈ کر سکتے ہیں۔ تبدیلیاں فوری طور پر نافذ ہو جاتی ہیں۔"),
    },
    {
      q: t("What payment methods do you accept?", "آپ کن ادائیگی کے طریقوں کو قبول کرتے ہیں؟"),
      a: t("Credit/debit cards, PayPal, JazzCash, Easypaisa, and bank transfer for Pakistan.", "کریڈٹ/ڈیبٹ کارڈز، PayPal، جاز کیش، ایزی پیسہ، اور بینک ٹرانسفر۔"),
    },
    {
      q: t("Can I get a refund?", "کیا میں رقم واپس لے سکتا ہوں؟"),
      a: t("Yes, we offer a 30-day money-back guarantee on all purchases.", "ہاں، ہم تمام خریداریوں پر 30 دن کی رقم واپسی کی ضمانت دیتے ہیں۔"),
    },
    {
      q: t("How many devices can I use?", "میں کتنے ڈیوائسز استعمال کر سکتا ہوں؟"),
      a: t("Up to 5 devices per account.", "ایک اکاؤنٹ پر 5 ڈیوائسز تک۔"),
    },
    {
      q: t("Is content available offline?", "کیا مواد آف لائن دستیاب ہے؟"),
      a: t("Premium and Lifetime plans allow downloads for offline reading.", "پریمیم اور لائف ٹائم پلانز آف لائن پڑھنے کے لیے ڈاؤن لوڈز کی اجازت دیتے ہیں۔"),
    },
    {
      q: t("Can I share with family?", "کیا میں خاندان کے ساتھ شیئر کر سکتا ہوں؟"),
      a: t("Premium includes 3 profiles, Lifetime includes 5. Each profile has its own library and progress.", "پریمیم میں 3 پروفائلز، لائف ٹائم میں 5 پروفائلز۔ ہر پروفائل کی اپنی لائبریری اور پیش رفت ہوتی ہے۔"),
    },
  ];

  return (
    <div className="min-h-screen bg-midnight text-white pt-16 lg:pt-20 pb-24 lg:pb-16">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[40vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/80 to-midnight" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-container-lg mx-auto px-4 lg:px-16 text-center pt-10 lg:pt-16 pb-8 lg:pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-3xl lg:text-4xl md:text-6xl text-white mb-4 lg:mb-6"
          >
            {t("Choose Your Plan", "اپنا پلان منتخب کریں")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#A0A0B0] text-base lg:text-lg md:text-xl max-w-2xl mx-auto mb-6 lg:mb-8 px-2"
          >
            {t("Flexible options for every reader. Start free, upgrade anytime.", "ہر قاری کے لیے لچکدار اختیارات۔ مفت شروع کریں، کسی بھی وقت اپ گریڈ کریں۔")}
          </motion.p>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-2 lg:gap-3"
          >
            {[
              { icon: Users, text: t("50,000+ readers trust QuickFare", "50,000+ قارئین QuickFare پر اعتماد کرتے ہیں") },
              { icon: Shield, text: t("30-day money back guarantee", "30 دن کی رقم واپسی کی ضمانت") },
              { icon: Check, text: t("Cancel anytime", "کسی بھی وقت منسوخ کریں") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 bg-midnight-100 border border-white/5 rounded-full px-3 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-[11px] text-[#A0A0B0]">
                <item.icon className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-gold" />
                <span className="whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRICING TIERS ═══════ */}
      <section className="max-w-container-xl mx-auto px-4 lg:px-16 py-10 lg:py-16">
        {/* Billing Toggle — larger touch target */}
        <div className="flex items-center justify-center gap-3 mb-8 lg:mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 lg:px-6 py-3 lg:py-2.5 rounded-full text-sm font-medium transition-all min-h-[48px] lg:min-h-0 ${billing === "monthly" ? "bg-gold text-midnight" : "bg-midnight-100 text-[#A0A0B0] hover:text-white border border-white/10"}`}
          >
            {t("Monthly", "ماہانہ")}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`relative px-5 lg:px-6 py-3 lg:py-2.5 rounded-full text-sm font-medium transition-all min-h-[48px] lg:min-h-0 ${billing === "yearly" ? "bg-gold text-midnight" : "bg-midnight-100 text-[#A0A0B0] hover:text-white border border-white/10"}`}
          >
            {t("Yearly", "سالانہ")}
            <span className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {t("Save 25%", "25% بچت")}
            </span>
          </button>
        </div>

        {/* Cards: Single column mobile, 3-across desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl p-6 lg:p-8 md:p-6 xl:p-10 border transition-all ${
                plan.popular
                  ? "bg-midnight-100 border-2 border-gold shadow-[0_20px_60px_rgba(201,168,76,0.15)] z-10 order-first md:order-none scale-[1.02]"
                  : plan.bestValue
                  ? "bg-midnight-100 border border-gold/30"
                  : "bg-midnight-100 border border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-midnight text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  {t("Most Popular", "سب سے مقبول")}
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute -top-3 right-4 bg-midnight border border-gold text-gold text-[10px] font-bold px-3 py-1 rounded-full">
                  {t("Best Value", "بہترین قدر")}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-gold/15" : "bg-white/5"}`}>
                  <plan.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${plan.popular ? "text-gold" : "text-[#A0A0B0]"}`} />
                </div>
                <h3 className={`font-outfit text-lg lg:text-xl font-bold ${plan.popular ? "text-gold" : "text-white"}`}>{plan.name}</h3>
              </div>

              <div className="mb-1">
                <span className="font-outfit text-3xl lg:text-4xl font-bold text-white">{plan.price}</span>
              </div>
              <p className="text-xs lg:text-sm text-[#A0A0B0] mb-1">{plan.period}</p>
              {plan.savings && (
                <span className="inline-block bg-green-500/15 text-green-400 text-[11px] font-semibold px-2 py-0.5 rounded-full mb-3 lg:mb-4">
                  {plan.savings}
                </span>
              )}
              {plan.value && (
                <p className="text-gold text-xs lg:text-sm font-medium mb-3 lg:mb-4">{plan.value}</p>
              )}

              <div className="h-px bg-white/10 my-5 lg:my-6" />

              <ul className="space-y-2.5 lg:space-y-3 mb-6 lg:mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 lg:gap-3 text-xs lg:text-sm">
                    {f.included ? (
                      <Check className={`w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 shrink-0 ${plan.popular ? "text-gold" : "text-green-400"}`} />
                    ) : (
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 shrink-0 text-[#3A3A4A]" />
                    )}
                    <span className={f.included ? (plan.popular ? "text-white" : "text-[#A0A0B0]") : "text-[#3A3A4A]"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 lg:py-3 rounded-full font-semibold text-xs lg:text-sm transition-all hover:scale-[1.02] min-h-[48px] ${
                  plan.popular
                    ? "bg-gold text-midnight hover:bg-gold-light"
                    : plan.bestValue
                    ? "border border-gold text-gold hover:bg-gold/10"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ PAY-PER-BOOK ALTERNATIVE ═══════ */}
      <section className="bg-midnight-100 py-10 lg:py-16">
        <div className="max-w-container-lg mx-auto px-4 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl lg:text-3xl text-white mb-3"
          >
            {t("Or Buy Individual Books", "یا انفرادی کتابیں خریدیں")}
          </motion.h2>
          <p className="text-[#A0A0B0] text-sm lg:text-base mb-4 lg:mb-6">
            {t("Own forever. No subscription needed.", "ہمیشہ کے لیے ملکیت۔ سبسکرپشن کی ضرورت نہیں۔")}
          </p>
          <p className="font-outfit text-xl lg:text-2xl text-gold font-bold mb-4">
            {t("Books from ₨250 to ₨1,500", "کتابیں ₨250 سے ₨1,500 تک")}
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 border border-gold/40 text-gold rounded-full px-5 lg:px-6 py-2.5 text-xs lg:text-sm font-medium hover:bg-gold/10 transition-colors"
          >
            {t("Browse 400+ titles", "400+ کتابیں براؤز کریں")} →
          </Link>
        </div>
      </section>

      {/* ═══════ BUNDLE DEALS ═══════ */}
      <section className="max-w-container-xl mx-auto px-4 lg:px-16 py-10 lg:py-16">
        <div className="text-center mb-6 lg:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl lg:text-3xl text-white mb-3"
          >
            {t("Bundle & Save More", "بنڈل کریں اور مزید بچت کریں")}
          </motion.h2>
          <p className="text-[#A0A0B0] text-sm lg:text-base">
            {t("Themed collections at unbeatable prices", "بے مثال قیمتوں پر تھیم والے مجموعے")}
          </p>
        </div>

        {/* Horizontal scroll carousel on mobile, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative bg-midnight-100 rounded-xl p-5 lg:p-6 border border-white/5 hover:border-gold/20 transition-all group shrink-0 w-[280px] lg:w-auto snap-start"
            >
              {bundle.tag && (
                <div className="absolute -top-2 right-4 bg-gold text-midnight text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {bundle.tag}
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm lg:text-base">{bundle.name}</h3>
                <span className="text-gold text-xs font-semibold bg-gold/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {bundle.books} {t("books", "کتابیں")}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="font-outfit text-xl lg:text-2xl font-bold text-white">${bundle.price}</span>
                <span className="text-[#A0A0B0] text-xs lg:text-sm line-through">${bundle.was}</span>
                <span className="text-green-400 text-[11px] lg:text-xs font-semibold">
                  {Math.round((1 - bundle.price / bundle.was) * 100)}% {t("off", "رعایت")}
                </span>
              </div>
              <button className="w-full py-2.5 rounded-full border border-gold/40 text-gold text-xs lg:text-sm font-medium hover:bg-gold/10 transition-colors min-h-[44px]">
                {t("Add to Cart", "کارٹ میں شامل کریں")}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURE COMPARISON ═══════ */}
      <section className="bg-midnight-100 py-10 lg:py-16">
        <div className="max-w-container-lg mx-auto px-4 lg:px-16">
          <h2 className="font-playfair text-2xl lg:text-3xl text-white text-center mb-6 lg:mb-10">
            {t("Feature Comparison", "خصوصیات کا موازنہ")}
          </h2>
          {/* Horizontal scroll table on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
            <table className="w-full text-xs lg:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 lg:py-4 pr-4 text-[#A0A0B0] font-medium sticky left-0 bg-midnight-100 z-10">{t("Feature", "خصوصیت")}</th>
                  <th className="text-center py-3 lg:py-4 px-2 lg:px-4 text-[#A0A0B0] font-medium">{t("Starter", "اسٹارٹر")}</th>
                  <th className="text-center py-3 lg:py-4 px-2 lg:px-4 text-gold font-medium">{t("Premium", "پریمیم")}</th>
                  <th className="text-center py-3 lg:py-4 px-2 lg:px-4 text-[#A0A0B0] font-medium">{t("Lifetime", "زندگی بھر")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  t("All 400+ books", "تمام 400+ کتابیں"),
                  t("Offline downloads", "آف لائن ڈاؤن لوڈز"),
                  t("Notes & highlights", "نوٹس اور ہائیلائٹس"),
                  t("Family profiles", "خاندانی پروفائلز"),
                  t("Priority support", "ترجیحی سپورٹ"),
                  t("New releases", "نئی ریلیزز"),
                  t("Ad-free experience", "ایڈ فری تجربہ"),
                ].map((feature, i) => (
                  <tr key={feature} className={`border-b ${i % 2 === 0 ? "bg-white/[0.02]" : ""} border-white/5`}>
                    <td className="py-3 lg:py-3.5 pr-4 text-white sticky left-0 bg-midnight-100 z-10 font-medium">{feature}</td>
                    <td className="text-center py-3 lg:py-3.5 px-2 lg:px-4">
                      {i < 1 ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-[#3A3A4A] mx-auto" />}
                    </td>
                    <td className="text-center py-3 lg:py-3.5 px-2 lg:px-4">
                      <Check className="w-4 h-4 text-gold mx-auto" />
                    </td>
                    <td className="text-center py-3 lg:py-3.5 px-2 lg:px-4">
                      <Check className="w-4 h-4 text-gold mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="max-w-container-lg mx-auto px-4 lg:px-16 py-10 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-2xl lg:text-3xl text-white mb-6 lg:mb-8"
        >
          {t("Frequently Asked Questions", "اکثر پوچھے گئے سوالات")}
        </motion.h2>
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="border-b border-white/5"
            >
              {/* 48px tap height */}
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-4 lg:py-5 text-left group min-h-[48px]"
              >
                <span className="font-inter font-medium text-sm lg:text-base text-white group-hover:text-gold transition-colors pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#A0A0B0] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-gold" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#A0A0B0] text-xs lg:text-sm pb-4 lg:pb-5 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ TRUST BADGES ═══════ */}
      <section className="bg-midnight-100 py-8 lg:py-10">
        <div className="max-w-container-lg mx-auto px-4 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-5 lg:gap-8">
            {[
              { icon: Lock, text: t("256-bit SSL Encryption", "256-bit SSL انکرپشن") },
              { icon: CreditCard, text: t("Secure Payment", "محفوظ ادائیگی") },
              { icon: Shield, text: t("30-Day Refund", "30 دن کی واپسی") },
              { icon: Star, text: t("No Hidden Fees", "کوئی پوشیدہ فیس نہیں") },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-xs lg:text-sm text-[#A0A0B0]">
                <badge.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gold" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="py-10 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 border-t border-b border-gold/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="relative z-10 max-w-container-md mx-auto px-4 lg:px-16 text-center">
          <h2 className="font-playfair text-2xl lg:text-3xl text-white mb-3">
            {t("Still have questions?", "ابھی بھی سوالات ہیں؟")}
          </h2>
          <p className="text-[#A0A0B0] text-sm lg:text-base mb-6 lg:mb-8">
            {t("Our team is happy to help", "ہماری ٹیم مدد کے لیے تیار ہے")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
            <button className="w-full sm:w-auto bg-gold text-midnight font-semibold px-6 lg:px-8 py-3 rounded-full text-xs lg:text-sm hover:bg-gold-light transition-colors animate-pulse min-h-[48px]">
              {t("Start Free Trial", "مفت ٹرائل شروع کریں")}
            </button>
            <a href="mailto:support@quickfare.com" className="text-[#A0A0B0] hover:text-gold text-xs lg:text-sm transition-colors min-h-[48px] flex items-center">
              support@quickfare.com
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ STICKY MOBILE CTA ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-midnight via-midnight to-transparent lg:hidden">
        <button className="w-full bg-gold text-midnight font-semibold py-3.5 rounded-full text-sm hover:bg-gold-light transition-all active:scale-[0.98] shadow-lg min-h-[52px]">
          {t("Start Free Trial", "مفت ٹرائل شروع کریں")}
        </button>
      </div>
    </div>
  );
}
