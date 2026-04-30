import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Settings,
  X,
  Type,
  Sun,
  Moon,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
  StickyNote,
  Copy,
  Trash2,
  BookOpen,
  ArrowLeft,
  Minimize2,
  Lock,
  List,
} from "lucide-react";
import { books } from "@/data/books";
import { useAppStore } from "@/store/useAppStore";

/* ───────── Helpers ───────── */
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const formatPrice = (price: number) => `₨${Math.round(price).toLocaleString("en-IN")}`;

/* ───────── Types ───────── */
type ThemeKey = "light" | "sepia" | "dark" | "night";
type FontFamily = "inter" | "nastaliq" | "playfair" | "system";
type Alignment = "left" | "center" | "justify" | "right";
type LineSpacing = "compact" | "normal" | "relaxed" | "wide";
type HighlightColor = "yellow" | "green" | "blue" | "pink" | "purple";

interface ReaderSettings {
  fontSize: number;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  theme: ThemeKey;
  alignment: Alignment;
}

interface Highlight {
  id: string;
  color: HighlightColor;
  text: string;
  chapterIndex: number;
  paragraphIndex: number;
  createdAt: number;
}

interface Note {
  id: string;
  text: string;
  chapterIndex: number;
  paragraphIndex: number;
  highlightId?: string;
  createdAt: number;
}

interface BookmarkItem {
  id: string;
  chapterIndex: number;
  paragraphIndex: number;
  createdAt: number;
}

/* ───────── Themes (mobile-optimized) ───────── */
const THEMES: Record<ThemeKey, { bg: string; text: string; muted: string; toolbar: string; border: string; selection: string }> = {
  light: { bg: "#FFFFFF", text: "#1a1a2e", muted: "#6b6b7b", toolbar: "rgba(255,255,255,0.98)", border: "rgba(0,0,0,0.08)", selection: "rgba(201,168,76,0.25)" },
  sepia: { bg: "#F4ECD8", text: "#5B4636", muted: "#8c7b65", toolbar: "rgba(244,236,216,0.98)", border: "rgba(0,0,0,0.08)", selection: "rgba(201,168,76,0.3)" },
  dark: { bg: "#121212", text: "#E0E0E0", muted: "#909090", toolbar: "rgba(18,18,18,0.98)", border: "rgba(255,255,255,0.06)", selection: "rgba(201,168,76,0.25)" },
  night: { bg: "#0a0a1a", text: "#B0B0B0", muted: "#808080", toolbar: "rgba(10,10,26,0.98)", border: "rgba(255,255,255,0.05)", selection: "rgba(201,168,76,0.2)" },
};

const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  yellow: "rgba(255, 215, 0, 0.35)",
  green: "rgba(39, 174, 96, 0.3)",
  blue: "rgba(52, 152, 219, 0.3)",
  pink: "rgba(233, 30, 99, 0.25)",
  purple: "rgba(156, 39, 176, 0.25)",
};

const HIGHLIGHT_BORDERS: Record<HighlightColor, string> = {
  yellow: "#FFD700",
  green: "#27AE60",
  blue: "#3498DB",
  pink: "#E91E63",
  purple: "#9C27B0",
};

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 18,
  fontFamily: "inter",
  lineSpacing: "normal",
  theme: "night",
  alignment: "justify",
};

/* ───────── Content generation ───────── */
function generateChapterContent(bookTitle: string, chapterTitle: string, index: number) {
  const paragraphs = [
    `Welcome to Chapter ${index + 1}: ${chapterTitle}. In this chapter, we explore the foundational concepts that underpin ${bookTitle}. The journey ahead is both enlightening and practical, designed to serve readers at every level of familiarity with the subject.`,
    `The importance of understanding ${chapterTitle.toLowerCase()} cannot be overstated. Throughout history, scholars and practitioners have emphasized its role in achieving success and spiritual fulfillment. This chapter distills their wisdom into actionable insights.`,
    `Let us begin by examining the core principles. First, intention matters above all else. Every action we take should be rooted in sincerity and directed toward a noble purpose. Second, preparation is essential. Without adequate planning, even the most well-meaning efforts can fall short.`,
    `Consider the following example: a traveler embarking on a sacred journey must prepare both physically and spiritually. The right supplies, the right mindset, and the right companions all contribute to a successful experience. Similarly, the principles in this book require holistic preparation.`,
    `Another critical aspect is consistency. Small, regular efforts compound over time to produce remarkable results. The daily practices outlined in this chapter are designed to be sustainable, fitting naturally into even the busiest of schedules.`,
    `We must also address common misconceptions. Many people believe that mastery requires extraordinary talent or circumstances. In reality, sustained effort and the right guidance are far more important than innate ability. This chapter provides that guidance.`,
    `Furthermore, community plays a vital role. Learning in isolation is possible, but learning alongside others accelerates growth and provides essential support during challenging times. We encourage readers to seek out like-minded individuals and study groups.`,
    `The practical exercises at the end of this chapter are not optional add-ons—they are integral to the learning process. Working through them will cement your understanding and reveal areas where further study may be needed.`,
    `As you read, keep a notebook nearby. Jot down questions, reflections, and connections to your own experiences. This active engagement transforms passive reading into a dynamic conversation with the text.`,
    `Finally, remember that knowledge without action is incomplete. Each chapter in this book is a stepping stone toward meaningful change. We invite you to walk this path with an open heart and a committed spirit.`,
  ];
  return paragraphs;
}

function getBookChapters(bookId: number) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return [];
  const count = Math.max(5, Math.min(12, Math.floor(book.pages / 30)));
  const titles = [
    "Introduction & Overview",
    "Preparing for the Journey",
    "Understanding the Basics",
    "Step-by-Step Guide",
    "Essential Tips & Tricks",
    "Common Mistakes to Avoid",
    "Advanced Techniques",
    "Practical Applications",
    "Real-World Examples",
    "Resources & References",
    "Frequently Asked Questions",
    "Conclusion & Next Steps",
  ];
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    title: titles[i] || `Chapter ${i + 1}`,
    content: generateChapterContent(book.title, titles[i] || `Chapter ${i + 1}`, i),
  }));
}

/* ───────── LocalStorage helpers ───────── */
function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem("qf-reader-settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}
function saveSettings(s: ReaderSettings) {
  localStorage.setItem("qf-reader-settings", JSON.stringify(s));
}
function loadHighlights(bookId: number): Highlight[] {
  try {
    const raw = localStorage.getItem(`qf-highlights-${bookId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveHighlights(bookId: number, h: Highlight[]) {
  localStorage.setItem(`qf-highlights-${bookId}`, JSON.stringify(h));
}
function loadNotes(bookId: number): Note[] {
  try {
    const raw = localStorage.getItem(`qf-notes-${bookId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveNotes(bookId: number, n: Note[]) {
  localStorage.setItem(`qf-notes-${bookId}`, JSON.stringify(n));
}
function loadBookmarks(bookId: number): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(`qf-bookmarks-${bookId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveBookmarks(bookId: number, b: BookmarkItem[]) {
  localStorage.setItem(`qf-bookmarks-${bookId}`, JSON.stringify(b));
}

/* ───────── Inactivity timer ───────── */
function useInactivityTimer(timeout: number, onInactive: () => void, onActive: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!activeRef.current) {
      activeRef.current = true;
      onActive();
    }
    timerRef.current = setTimeout(() => {
      activeRef.current = false;
      onInactive();
    }, timeout);
  }, [timeout, onInactive, onActive]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reset]);

  return { reset };
}

/* ════════════════════════════════
   Reader Page — Mobile First
   ════════════════════════════════ */
export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookId = Number(id || "1");
  const book = books.find((b) => b.id === bookId);
  const updateProgress = useAppStore((s) => s.updateProgress);

  const chapters = useMemo(() => getBookChapters(bookId), [bookId]);
  const initialChapter = Number(searchParams.get("chapter")) || 1;
  const [currentChapter, setCurrentChapter] = useState(clamp(initialChapter - 1, 0, chapters.length - 1));
  const [settings, setSettings] = useState<ReaderSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesTab, setNotesTab] = useState<"notes" | "bookmarks" | "highlights">("notes");
  const [highlights, setHighlights] = useState<Highlight[]>(() => loadHighlights(bookId));
  const [notes, setNotes] = useState<Note[]>(() => loadNotes(bookId));
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => loadBookmarks(bookId));
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarsVisible, setToolbarsVisible] = useState(true);
  const [selectionToolbar, setSelectionToolbar] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [lastSelection, setLastSelection] = useState<{ text: string; chapter: number; paragraph: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const theme = THEMES[settings.theme];

  /* Inactivity timer */
  useInactivityTimer(
    3000,
    () => setToolbarsVisible(false),
    () => setToolbarsVisible(true)
  );

  /* Load saved progress */
  useEffect(() => {
    const saved = localStorage.getItem(`qf-progress-${bookId}`);
    if (saved) {
      const { chapter, percent } = JSON.parse(saved);
      if (percent > 5 && percent < 95) {
        setShowResumePrompt(true);
      }
    }
  }, [bookId]);

  /* Fullscreen */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* Keyboard shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (settingsOpen || tocOpen || notesOpen || addNoteOpen) {
        if (e.key === "Escape") {
          setSettingsOpen(false);
          setTocOpen(false);
          setNotesOpen(false);
          setAddNoteOpen(false);
        }
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevChapter();
      } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextChapter();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        prevChapter();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nextChapter();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "t" || e.key === "T") {
        cycleTheme();
      } else if (e.key === "+" || e.key === "=") {
        changeFontSize(1);
      } else if (e.key === "-" || e.key === "_") {
        changeFontSize(-1);
      } else if (e.key === "b" || e.key === "B") {
        toggleBookmarkCurrent();
      } else if (e.key === "n" || e.key === "N") {
        setNotesOpen((v) => !v);
      } else if (e.key === "Escape") {
        navigate(`/book/${bookId}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen, tocOpen, notesOpen, addNoteOpen, currentChapter, chapters.length, bookId, navigate, toggleFullscreen]);

  /* Scroll progress */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setReadingProgress(pct);
      updateProgress(bookId, pct);
      localStorage.setItem(`qf-progress-${bookId}`, JSON.stringify({ chapter: currentChapter, percent: pct }));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [bookId, currentChapter, updateProgress]);

  /* Selection toolbar */
  useEffect(() => {
    const onSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setSelectionToolbar((t) => ({ ...t, visible: false }));
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionToolbar({
        x: rect.left + rect.width / 2,
        y: rect.top - 56,
        visible: true,
      });
    };
    document.addEventListener("selectionchange", onSelection);
    return () => document.removeEventListener("selectionchange", onSelection);
  }, []);

  const changeFontSize = (delta: number) => {
    setSettings((s) => {
      const next = { ...s, fontSize: clamp(s.fontSize + delta, 14, 26) };
      saveSettings(next);
      return next;
    });
  };

  const cycleTheme = () => {
    const order: ThemeKey[] = ["night", "dark", "sepia", "light"];
    setSettings((s) => {
      const idx = order.indexOf(s.theme);
      const next = { ...s, theme: order[(idx + 1) % order.length] };
      saveSettings(next);
      return next;
    });
  };

  const prevChapter = () => setCurrentChapter((c) => Math.max(0, c - 1));
  const nextChapter = () => {
    if (book?.isPremium && currentChapter >= 2 && !useAppStore.getState().isPremiumUser) {
      setShowPurchasePrompt(true);
      return;
    }
    setCurrentChapter((c) => Math.min(chapters.length - 1, c + 1));
  };

  const goToChapter = (idx: number) => {
    setCurrentChapter(idx);
    setTocOpen(false);
    setNotesOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createHighlight = (color: HighlightColor) => {
    const sel = window.getSelection();
    if (!sel || !sel.toString().trim() || !lastSelection) return;
    const h: Highlight = {
      id: Date.now().toString(),
      color,
      text: sel.toString().slice(0, 200),
      chapterIndex: lastSelection.chapter,
      paragraphIndex: lastSelection.paragraph,
      createdAt: Date.now(),
    };
    setHighlights((prev) => {
      const next = [...prev, h];
      saveHighlights(bookId, next);
      return next;
    });
    setSelectionToolbar((t) => ({ ...t, visible: false }));
    sel.removeAllRanges();
  };

  const addNote = () => {
    if (!lastSelection || !noteText.trim()) return;
    const n: Note = {
      id: Date.now().toString(),
      text: noteText,
      chapterIndex: lastSelection.chapter,
      paragraphIndex: lastSelection.paragraph,
      createdAt: Date.now(),
    };
    setNotes((prev) => {
      const next = [...prev, n];
      saveNotes(bookId, next);
      return next;
    });
    setNoteText("");
    setAddNoteOpen(false);
    setSelectionToolbar((t) => ({ ...t, visible: false }));
    window.getSelection()?.removeAllRanges();
  };

  const toggleBookmarkCurrent = () => {
    const exists = bookmarks.find((b) => b.chapterIndex === currentChapter);
    if (exists) {
      setBookmarks((prev) => {
        const next = prev.filter((b) => b.id !== exists.id);
        saveBookmarks(bookId, next);
        return next;
      });
    } else {
      const b: BookmarkItem = {
        id: Date.now().toString(),
        chapterIndex: currentChapter,
        paragraphIndex: 0,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => {
        const next = [...prev, b];
        saveBookmarks(bookId, next);
        return next;
      });
    }
  };

  const isBookmarked = (chapterIdx: number) => bookmarks.some((b) => b.chapterIndex === chapterIdx);

  const handleTextSelection = (chapterIndex: number, paragraphIndex: number) => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      setLastSelection({ text: sel.toString(), chapter: chapterIndex, paragraph: paragraphIndex });
    }
  };

  const handleParagraphClick = (chapterIndex: number, paragraphIndex: number) => {
    handleTextSelection(chapterIndex, paragraphIndex);
  };

  const deleteHighlight = (id: string) => {
    setHighlights((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveHighlights(bookId, next);
      return next;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(bookId, next);
      return next;
    });
  };

  const deleteBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(bookId, next);
      return next;
    });
  };

  /* Touch gestures */
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const start = touchStartRef.current;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Horizontal swipe (primary for page nav)
    if (absDx > absDy && absDx > 50) {
      if (dx > 0) prevChapter();
      else nextChapter();
    }
    // Vertical swipe: pinch-like font size
    else if (absDy > absDx && absDy > 80) {
      if (dy < 0) changeFontSize(1);  // swipe up = bigger
      else changeFontSize(-1);         // swipe down = smaller
    }

    touchStartRef.current = null;
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) return;
    const rect = (e.target as HTMLElement).closest("[data-reader-content]")?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const w = rect.width;
    if (x < w * 0.15) prevChapter();
    else if (x > w * 0.85) nextChapter();
    else setToolbarsVisible((v) => !v);
  };

  const currentPage = Math.max(1, Math.floor((readingProgress / 100) * (book?.pages || 100)));

  if (!book) {
    return (
      <div className="fixed inset-0 bg-midnight flex items-center justify-center z-50">
        <div className="text-center px-4">
          <h1 className="text-white text-xl sm:text-2xl mb-4">Book Not Found</h1>
          <button onClick={() => navigate("/browse")} className="text-gold hover:underline">Browse Books</button>
        </div>
      </div>
    );
  }

  const fontFamilyClass =
    settings.fontFamily === "inter"
      ? "font-inter"
      : settings.fontFamily === "nastaliq"
      ? "font-nastaliq"
      : settings.fontFamily === "playfair"
      ? "font-playfair"
      : "";

  const lineHeight =
    settings.lineSpacing === "compact" ? 1.5 : settings.lineSpacing === "normal" ? 1.8 : settings.lineSpacing === "relaxed" ? 2.0 : 2.4;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* ═══════ TOP TOOLBAR — Mobile: 48px, icons only ═══════ */}
      <motion.header
        initial={{ opacity: 1 }}
        animate={{ opacity: toolbarsVisible ? 1 : 0, y: toolbarsVisible ? 0 : -20 }}
        transition={{ duration: 0.25 }}
        className="shrink-0 h-12 sm:h-14 flex items-center justify-between px-3 sm:px-4 border-b select-none z-20"
        style={{ backgroundColor: theme.toolbar, borderColor: theme.border, backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => navigate(`/book/${bookId}`)}
            className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity p-1.5 min-h-[40px] min-w-[40px] justify-center"
            style={{ color: theme.text }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-px h-5 opacity-20 hidden sm:block" style={{ backgroundColor: theme.text }} />
          <h2
            className="text-xs sm:text-sm font-medium truncate flex-1"
            style={{ maxWidth: "clamp(120px, 50vw, 400px)" }}
            title={book.title}
          >
            {book.title}
          </h2>
        </div>

        {/* Chapter info - desktop only */}
        <div className="text-[10px] sm:text-xs opacity-50 hidden lg:block truncate max-w-[200px] mr-3">
          Ch. {currentChapter + 1}: {chapters[currentChapter]?.title}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            onClick={toggleBookmarkCurrent}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: isBookmarked(currentChapter) ? "#C9A84C" : theme.muted }}
            aria-label="Bookmark"
          >
            <Bookmark size={18} fill={isBookmarked(currentChapter) ? "#C9A84C" : "none"} />
          </button>
          <button
            onClick={() => setNotesOpen(true)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Notes"
          >
            <StickyNote size={18} />
            {notes.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
          <button
            onClick={() => setTocOpen(true)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center lg:hidden"
            style={{ color: theme.muted }}
            aria-label="Table of Contents"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate(`/book/${bookId}`)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </motion.header>

      {/* ═══════ Resume Prompt ═══════ */}
      <AnimatePresence>
        {showResumePrompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="shrink-0 px-4 py-2 flex items-center justify-between text-xs z-10"
            style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
          >
            <span>Continue where you left off?</span>
            <button
              onClick={() => {
                const saved = localStorage.getItem(`qf-progress-${bookId}`);
                if (saved) {
                  const { chapter } = JSON.parse(saved);
                  setCurrentChapter(chapter);
                }
                setShowResumePrompt(false);
              }}
              className="underline hover:no-underline font-semibold"
            >
              Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ MAIN CONTENT — Mobile: 18px, LH 1.8, full-width, px-4 ═══════ */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto relative select-text"
        style={{ scrollBehavior: "smooth" }}
        onClick={handleContentClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          data-reader-content
          className="w-full max-w-none sm:max-w-3xl sm:mx-auto px-4 sm:px-10 py-8 sm:py-12"
          style={{ minHeight: "100%" }}
        >
          {chapters.map((ch, chIdx) => (
            <div
              key={chIdx}
              className={chIdx === currentChapter ? "" : "hidden"}
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2
                  className={`text-center mb-1 sm:mb-2 ${fontFamilyClass}`}
                  style={{ fontSize: `${settings.fontSize * 1.4}px`, lineHeight: 1.3, fontWeight: 700 }}
                >
                  Chapter {chIdx + 1}
                </h2>
                <h3
                  className={`text-center mb-6 sm:mb-10 opacity-60 ${fontFamilyClass}`}
                  style={{ fontSize: `${settings.fontSize * 1.1}px`, lineHeight: 1.3 }}
                >
                  {ch.title}
                </h3>
              </motion.div>

              <div
                className={fontFamilyClass}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight,
                  textAlign: settings.alignment,
                }}
              >
                {ch.content.map((para, pIdx) => {
                  const paraHighlights = highlights.filter(
                    (h) => h.chapterIndex === chIdx && h.paragraphIndex === pIdx
                  );
                  return (
                    <div
                      key={pIdx}
                      className="relative mb-5 sm:mb-6 group"
                      onMouseUp={() => handleParagraphClick(chIdx, pIdx)}
                      onTouchEnd={() => handleParagraphClick(chIdx, pIdx)}
                    >
                      {paraHighlights.map((h) => (
                        <div
                          key={h.id}
                          className="absolute inset-0 rounded pointer-events-none"
                          style={{ backgroundColor: HIGHLIGHT_COLORS[h.color] }}
                        />
                      ))}
                      <p className="relative z-10" style={{ textAlign: settings.alignment }}>
                        {para}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Chapter nav at bottom */}
              <div className="flex items-center justify-between mt-8 sm:mt-12 pt-5 sm:pt-6 border-t" style={{ borderColor: theme.border }}>
                <button
                  onClick={(e) => { e.stopPropagation(); prevChapter(); }}
                  disabled={chIdx === 0}
                  className="flex items-center gap-1 text-xs sm:text-sm opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity min-h-[44px] px-2"
                  style={{ color: theme.text }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextChapter(); }}
                  disabled={chIdx === chapters.length - 1}
                  className="flex items-center gap-1 text-xs sm:text-sm opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity min-h-[44px] px-2"
                  style={{ color: theme.text }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ SELECTION TOOLBAR ═══════ */}
      <AnimatePresence>
        {selectionToolbar.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-40 px-2 sm:px-3 py-2 rounded-xl shadow-xl border flex items-center gap-1"
            style={{
              left: "50%",
              top: Math.max(60, selectionToolbar.y),
              transform: "translateX(-50%)",
              backgroundColor: settings.theme === "light" || settings.theme === "sepia" ? "#fff" : "#1a1a24",
              borderColor: theme.border,
            }}
          >
            {(["yellow", "green", "blue", "pink", "purple"] as HighlightColor[]).map((c) => (
              <button
                key={c}
                onClick={() => createHighlight(c)}
                className="w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform flex-shrink-0"
                style={{ backgroundColor: HIGHLIGHT_COLORS[c], borderColor: HIGHLIGHT_BORDERS[c] }}
                title={`Highlight ${c}`}
              />
            ))}
            <div className="w-px h-5 mx-1 opacity-20 hidden sm:block" style={{ backgroundColor: theme.text }} />
            <button
              onClick={() => setAddNoteOpen(true)}
              className="p-1.5 rounded hover:bg-black/5 transition-colors"
              style={{ color: theme.muted }}
              title="Add note"
            >
              <StickyNote size={16} />
            </button>
            <button
              onClick={() => {
                const text = window.getSelection()?.toString() || "";
                navigator.clipboard.writeText(text);
                setSelectionToolbar((t) => ({ ...t, visible: false }));
                window.getSelection()?.removeAllRanges();
              }}
              className="p-1.5 rounded hover:bg-black/5 transition-colors"
              style={{ color: theme.muted }}
              title="Copy"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => {
                setSelectionToolbar((t) => ({ ...t, visible: false }));
                window.getSelection()?.removeAllRanges();
              }}
              className="p-1.5 rounded hover:bg-black/5 transition-colors"
              style={{ color: theme.muted }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ ADD NOTE MODAL — Mobile: bottom sheet ═══════ */}
      <AnimatePresence>
        {addNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => setAddNoteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 border shadow-2xl"
              style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
            >
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Add Note</h3>
              <p className="text-[10px] sm:text-xs opacity-60 mb-3 italic line-clamp-2">{lastSelection?.text}</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Your note..."
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm mb-4 resize-none focus:outline-none"
                style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddNoteOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gold text-midnight font-semibold hover:bg-gold-light transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ BOTTOM TOOLBAR — Mobile: 56px min, easy thumb reach ═══════ */}
      <motion.footer
        initial={{ opacity: 1 }}
        animate={{ opacity: toolbarsVisible ? 1 : 0, y: toolbarsVisible ? 0 : 20 }}
        transition={{ duration: 0.25 }}
        className="shrink-0 h-14 sm:h-14 flex items-center justify-between px-3 sm:px-4 border-t select-none z-20"
        style={{ backgroundColor: theme.toolbar, borderColor: theme.border, backdropFilter: "blur(12px)" }}
      >
        {/* Progress */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-[10px] sm:text-xs font-semibold flex-shrink-0" style={{ color: "#C9A84C" }}>{readingProgress}%</span>
          <div
            className="flex-1 h-1.5 sm:h-1 rounded-full overflow-hidden cursor-pointer min-w-[60px]"
            style={{ backgroundColor: theme.border }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              if (contentRef.current) {
                const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
                contentRef.current.scrollTop = (pct / 100) * scrollHeight;
              }
            }}
          >
            <div className="h-full rounded-full bg-gold transition-all duration-200" style={{ width: `${readingProgress}%` }} />
          </div>
          <span className="text-[10px] opacity-50 hidden sm:inline flex-shrink-0">
            Page {currentPage}
          </span>
        </div>

        {/* Chapter nav */}
        <div className="flex items-center gap-1 sm:gap-2 mx-2 sm:mx-4 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); prevChapter(); }}
            disabled={currentChapter === 0}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 disabled:opacity-20 transition-opacity min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Previous chapter"
          >
            <ChevronUp size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setTocOpen(true); }}
            className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[48px]"
            style={{ color: theme.text }}
            aria-label="Open table of contents"
          >
            Ch. {currentChapter + 1}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextChapter(); }}
            disabled={currentChapter === chapters.length - 1}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-black/5 disabled:opacity-20 transition-opacity min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Next chapter"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Right actions - hidden on smallest screens */}
        <div className="hidden sm:flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); cycleTheme(); }}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Toggle theme"
          >
            {settings.theme === "light" || settings.theme === "sepia" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            style={{ color: theme.muted }}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <BookOpen size={18} />}
          </button>
        </div>
      </motion.footer>

      {/* ═══════ SETTINGS — Mobile: Bottom Sheet ═══════ */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSettingsOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t max-h-[80vh] overflow-y-auto"
              style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full opacity-30" style={{ backgroundColor: theme.muted }} />
              </div>

              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h3 className="font-playfair text-lg sm:text-xl font-semibold">Reading Settings</h3>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-2 rounded-lg hover:bg-black/5 min-h-[40px] min-w-[40px] flex items-center justify-center"
                    style={{ color: theme.muted }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Font size — Large +/- buttons */}
                <div className="mb-5 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Font Size</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeFontSize(-1)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
                      style={{ borderColor: theme.border }}
                      aria-label="Decrease font size"
                    >
                      <span className="text-lg sm:text-xl font-bold" style={{ color: theme.muted }}>A&#8722;</span>
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-lg sm:text-xl font-semibold">{settings.fontSize}px</span>
                    </div>
                    <button
                      onClick={() => changeFontSize(1)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
                      style={{ borderColor: theme.border }}
                      aria-label="Increase font size"
                    >
                      <span className="text-xl sm:text-2xl font-bold" style={{ color: theme.muted }}>A+</span>
                    </button>
                  </div>
                </div>

                {/* Font family — Dropdown select */}
                <div className="mb-5 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => {
                      const v = e.target.value as FontFamily;
                      setSettings((s) => { const n = { ...s, fontFamily: v }; saveSettings(n); return n; });
                    }}
                    className="w-full rounded-xl border px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="inter">Inter (Modern)</option>
                    <option value="nastaliq">Noto Nastaliq (Urdu)</option>
                    <option value="playfair">Playfair Display (Serif)</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                {/* Line spacing */}
                <div className="mb-5 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Line Spacing</label>
                  <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: theme.border }}>
                    {(["compact", "normal", "relaxed", "wide"] as LineSpacing[]).map((ls, i, arr) => (
                      <button
                        key={ls}
                        onClick={() => setSettings((s) => { const n = { ...s, lineSpacing: ls }; saveSettings(n); return n; })}
                        className={`flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs capitalize transition-colors min-h-[44px] ${
                          settings.lineSpacing === ls ? "bg-gold/15 text-gold font-semibold" : "hover:bg-black/5"
                        } ${i < arr.length - 1 ? "border-r" : ""}`}
                        style={{ borderColor: theme.border }}
                      >
                        {ls}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme — 4 color swatches in a row */}
                <div className="mb-5 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Theme</label>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {([
                      { key: "light", label: "Light", bg: "#FFFFFF", fg: "#1a1a2e" },
                      { key: "sepia", label: "Sepia", bg: "#F4ECD8", fg: "#5B4636" },
                      { key: "dark", label: "Dark", bg: "#121212", fg: "#E0E0E0" },
                      { key: "night", label: "Night", bg: "#0a0a1a", fg: "#B0B0B0" },
                    ] as { key: ThemeKey; label: string; bg: string; fg: string }[]).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setSettings((s) => { const n = { ...s, theme: t.key }; saveSettings(n); return n; })}
                        className={`flex flex-col items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-xl border-2 transition-all min-h-[60px] ${
                          settings.theme === t.key ? "border-gold" : "border-transparent hover:border-white/10"
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-md border" style={{ backgroundColor: t.bg, borderColor: "rgba(0,0,0,0.1)" }}>
                          <div className="w-full h-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold" style={{ color: t.fg }}>
                            Aa
                          </div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] capitalize">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alignment */}
                <div className="mb-5 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Text Alignment</label>
                  <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: theme.border }}>
                    {([
                      { key: "left", icon: <AlignLeft size={16} /> },
                      { key: "center", icon: <AlignCenter size={16} /> },
                      { key: "justify", icon: <AlignJustify size={16} /> },
                      { key: "right", icon: <AlignRight size={16} /> },
                    ] as { key: Alignment; icon: React.ReactNode }[]).map((a, i, arr) => (
                      <button
                        key={a.key}
                        onClick={() => setSettings((s) => { const n = { ...s, alignment: a.key }; saveSettings(n); return n; })}
                        className={`flex-1 py-2.5 sm:py-3 flex justify-center transition-colors min-h-[44px] ${
                          settings.alignment === a.key ? "bg-gold/15 text-gold" : "hover:bg-black/5"
                        } ${i < arr.length - 1 ? "border-r" : ""}`}
                        style={{ borderColor: theme.border }}
                      >
                        {a.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSettings(DEFAULT_SETTINGS); saveSettings(DEFAULT_SETTINGS); }}
                  className="w-full py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm opacity-60 hover:opacity-100 transition-opacity min-h-[44px]"
                  style={{ borderColor: theme.border }}
                >
                  Reset to Default
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ TOC PANEL — Mobile: Full-screen overlay from left ═══════ */}
      <AnimatePresence>
        {tocOpen && (
          <>
            {/* Backdrop with tap-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setTocOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 z-40 w-full sm:w-[360px] border-r overflow-y-auto"
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h3 className="font-playfair text-lg sm:text-xl" style={{ color: theme.text }}>Contents</h3>
                  <button
                    onClick={() => setTocOpen(false)}
                    className="p-2 rounded-lg hover:bg-black/5 min-h-[40px] min-w-[40px] flex items-center justify-center"
                    style={{ color: theme.muted }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-0.5">
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => goToChapter(i)}
                      className={`w-full text-left px-3 sm:px-4 py-3 rounded-lg transition-colors flex items-center gap-3 min-h-[48px] ${
                        i === currentChapter
                          ? "bg-gold/10 text-gold border-l-2 border-gold"
                          : "hover:bg-black/5"
                      }`}
                      style={{ color: i === currentChapter ? "#C9A84C" : theme.text }}
                    >
                      <span className="font-mono text-xs sm:text-sm opacity-50 w-6 sm:w-8 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs sm:text-sm truncate">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ NOTES PANEL — Mobile: Full-screen overlay from right ═══════ */}
      <AnimatePresence>
        {notesOpen && (
          <>
            {/* Backdrop with tap-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setNotesOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[400px] border-l overflow-y-auto flex flex-col"
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            >
              <div className="p-4 sm:p-6 border-b shrink-0" style={{ borderColor: theme.border }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-playfair text-lg sm:text-xl" style={{ color: theme.text }}>Notes &amp; Bookmarks</h3>
                  <button
                    onClick={() => setNotesOpen(false)}
                    className="p-2 rounded-lg hover:bg-black/5 min-h-[40px] min-w-[40px] flex items-center justify-center"
                    style={{ color: theme.muted }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: theme.border }}>
                  {([
                    { key: "notes", label: `Notes (${notes.length})` },
                    { key: "bookmarks", label: `Bookmarks (${bookmarks.length})` },
                    { key: "highlights", label: `Highlights (${highlights.length})` },
                  ] as { key: "notes" | "bookmarks" | "highlights"; label: string }[]).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setNotesTab(t.key)}
                      className={`flex-1 py-2.5 text-[10px] sm:text-xs font-medium transition-colors min-h-[40px] ${
                        notesTab === t.key ? "bg-gold/15 text-gold" : "hover:bg-black/5"
                      }`}
                      style={{ color: notesTab === t.key ? "#C9A84C" : theme.muted }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {notesTab === "notes" && (
                  <div className="space-y-2 sm:space-y-3">
                    {notes.length === 0 && (
                      <p className="text-xs sm:text-sm opacity-50 text-center py-8">No notes yet. Select text and add a note.</p>
                    )}
                    {notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl border" style={{ borderColor: theme.border, backgroundColor: theme.bg === "#FFFFFF" ? "#f8f8f8" : "rgba(255,255,255,0.03)" }}>
                        <p className="text-[10px] sm:text-xs opacity-50 mb-1">Ch. {n.chapterIndex + 1}, Para. {n.paragraphIndex + 1}</p>
                        <p className="text-xs sm:text-sm" style={{ color: theme.text }}>{n.text}</p>
                        <button onClick={() => deleteNote(n.id)} className="mt-2 text-[10px] sm:text-xs opacity-40 hover:opacity-100 flex items-center gap-1 min-h-[32px]">
                          <Trash2 size={12} className="sm:w-4 sm:h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {notesTab === "bookmarks" && (
                  <div className="space-y-1.5 sm:space-y-2">
                    {bookmarks.length === 0 && (
                      <p className="text-xs sm:text-sm opacity-50 text-center py-8">No bookmarks yet. Press B to bookmark.</p>
                    )}
                    {bookmarks.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-3 rounded-xl border hover:bg-black/5 cursor-pointer transition-colors"
                        style={{ borderColor: theme.border }}
                        onClick={() => { goToChapter(b.chapterIndex); setNotesOpen(false); }}
                      >
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-xs sm:text-sm font-medium truncate" style={{ color: theme.text }}>{chapters[b.chapterIndex]?.title || `Chapter ${b.chapterIndex + 1}`}</p>
                          <p className="text-[10px] sm:text-xs opacity-50">Bookmarked</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteBookmark(b.id); }} className="p-1.5 opacity-40 hover:opacity-100 flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {notesTab === "highlights" && (
                  <div className="space-y-2 sm:space-y-3">
                    {highlights.length === 0 && (
                      <p className="text-xs sm:text-sm opacity-50 text-center py-8">No highlights yet. Select text to highlight.</p>
                    )}
                    {highlights.map((h) => (
                      <div
                        key={h.id}
                        className="p-3 rounded-xl border cursor-pointer transition-colors hover:bg-black/5"
                        style={{ borderColor: theme.border, borderLeft: `3px solid ${HIGHLIGHT_BORDERS[h.color]}` }}
                        onClick={() => { goToChapter(h.chapterIndex); setNotesOpen(false); }}
                      >
                        <p className="text-[10px] sm:text-xs opacity-50 mb-1">Ch. {h.chapterIndex + 1}</p>
                        <p className="text-xs sm:text-sm italic line-clamp-3" style={{ color: theme.text }}>&ldquo;{h.text}&rdquo;</p>
                        <button onClick={(e) => { e.stopPropagation(); deleteHighlight(h.id); }} className="mt-2 text-[10px] sm:text-xs opacity-40 hover:opacity-100 flex items-center gap-1 min-h-[32px]">
                          <Trash2 size={12} className="sm:w-4 sm:h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ PURCHASE PROMPT — Mobile: Bottom sheet ═══════ */}
      <AnimatePresence>
        {showPurchasePrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowPurchasePrompt(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 border-t rounded-t-2xl"
              style={{ backgroundColor: theme.bg, borderColor: "#C9A84C" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full opacity-30" style={{ backgroundColor: theme.muted }} />
              </div>

              <div className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-5">
                  <p className="text-[10px] sm:text-xs opacity-50 mb-1">Preview: First 3 chapters free</p>
                  <p className="text-sm sm:text-base mb-3" style={{ color: theme.text }}>
                    Unlock the full book to continue reading
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gold">{formatPrice(book.price)}</span>
                    <span className="text-sm sm:text-base line-through opacity-40">{formatPrice(book.price * 1.5)}</span>
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">
                      Save 33%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/book/${bookId}`)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gold text-midnight font-bold text-sm sm:text-base hover:bg-gold-light transition-colors min-h-[52px] mb-3"
                >
                  <Lock size={18} />
                  Buy Now
                </button>
                <button
                  onClick={() => setShowPurchasePrompt(false)}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm opacity-60 hover:opacity-100 transition-opacity min-h-[44px]"
                >
                  Continue with Preview
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
