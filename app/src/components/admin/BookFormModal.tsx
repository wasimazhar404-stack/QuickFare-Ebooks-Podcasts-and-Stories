import { useState, useCallback, useRef } from "react";
import { X, Save, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Book } from "@/data/books";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
  onSave: (book: Book) => void;
  title: string;
}

interface FormState {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  pages: string;
  language: "english" | "urdu" | "bilingual";
  rating: string;
  tags: string;
  isPremium: boolean;
  isNew: boolean;
  isTrending: boolean;
  status: "Published" | "Draft";
  cover: string;
  author: string;
}

interface FormErrors {
  title?: string;
  subtitle?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  language?: string;
  price?: string;
  pages?: string;
  rating?: string;
  tags?: string;
  author?: string;
  cover?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "Islamic",
  "Global",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Technology",
  "Health",
  "Business",
  "Self-Help",
  "Urdu Literature",
  "Poetry",
  "Philosophy",
  "Art & Design",
  "Education",
];

const SUBCATEGORIES: Record<string, string[]> = {
  Islamic: ["Hajj & Umrah", "Fiqh", "Seerah", "Aqeedah", "Quran", "Hadith", "Dua & Dhikr", "Islamic History", "Women in Islam"],
  Global: ["Current Affairs", "Politics", "Economics", "Social Issues"],
  Fiction: ["Novel", "Short Stories", "Fantasy", "Romance", "Thriller"],
  "Non-Fiction": ["Biography", "Memoir", "Essays", "Journalism"],
  Science: ["Physics", "Biology", "Chemistry", "Astronomy", "Mathematics"],
  History: ["World History", "Pakistan History", "Islamic History", "Ancient History"],
  Technology: ["Programming", "AI & ML", "Cybersecurity", "Web Development"],
  Health: ["Fitness", "Nutrition", "Mental Health", "Medicine"],
  Business: ["Entrepreneurship", "Marketing", "Finance", "Leadership"],
  "Self-Help": ["Productivity", "Mindset", "Relationships", "Spirituality"],
  "Urdu Literature": ["Novel", "Afsanay", "Drama", "Mazmoon"],
  Poetry: ["Ghazal", "Nazm", "Free Verse", "Classical"],
  Philosophy: ["Eastern", "Western", "Modern", "Ethics"],
  "Art & Design": ["Painting", "Graphic Design", "Architecture", "Fashion"],
  Education: ["Teaching", "Curriculum", "Research", "Study Guides"],
};

const LANGUAGES: { value: FormState["language"]; label: string }[] = [
  { value: "english", label: "English" },
  { value: "urdu", label: "Urdu" },
  { value: "bilingual", label: "Bilingual" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function emptyForm(): FormState {
  return {
    id: 0,
    title: "",
    subtitle: "",
    category: "Islamic",
    subcategory: "",
    description: "",
    price: "",
    pages: "",
    language: "english",
    rating: "0",
    tags: "",
    isPremium: false,
    isNew: true,
    isTrending: false,
    status: "Published",
    cover: "",
    author: "",
  };
}

function bookToForm(book: Book): FormState {
  return {
    id: book.id,
    title: book.title,
    subtitle: book.subtitle ?? "",
    category: book.category,
    subcategory: book.subcategory ?? "",
    description: book.description ?? "",
    price: String(book.price ?? ""),
    pages: String(book.pages ?? ""),
    language: book.language || "english",
    rating: String(book.rating ?? 0),
    tags: Array.isArray(book.tags) ? book.tags.join(", ") : String(book.tags ?? ""),
    isPremium: book.isPremium ?? false,
    isNew: book.isNew ?? false,
    isTrending: book.isTrending ?? false,
    status: ((book as unknown as Book & { status?: string }).status ?? "Published") as "Published" | "Draft",
    cover: book.cover ?? "",
    author: (book as Book & { author?: string }).author ?? "",
  };
}

function formToBook(form: FormState): Book {
  return {
    id: form.id,
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    category: form.category,
    subcategory: form.subcategory.trim(),
    description: form.description.trim(),
    price: parseFloat(form.price) || 0,
    pages: parseInt(form.pages) || 0,
    language: form.language,
    rating: parseFloat(form.rating) || 0,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    isPremium: form.isPremium,
    isNew: form.isNew,
    isTrending: form.isTrending,
    cover: form.cover.trim(),
    author: form.author.trim(),
  } as Book & { status?: string };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BookFormModal({
  book,
  onClose,
  onSave,
  title,
}: BookFormModalProps) {
  const [form, setForm] = useState<FormState>(
    book ? bookToForm(book) : emptyForm()
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    book?.cover || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subcategories = SUBCATEGORIES[form.category] || [];

  /* ---- cover upload handlers ---- */
  const validateFile = (file: File): boolean => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/i)) {
      toast.error("Only JPG and PNG images are allowed.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB allowed.");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && validateFile(file)) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
    setForm((f) => ({ ...f, cover: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---- validation ---- */
  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category.trim()) errs.category = "Category is required";
    const priceVal = parseFloat(form.price);
    if (isNaN(priceVal) || priceVal < 0) errs.price = "Price must be >= 0";
    const pagesVal = parseInt(form.pages);
    if (isNaN(pagesVal) || pagesVal <= 0) errs.pages = "Pages must be > 0";
    const ratingVal = parseFloat(form.rating);
    if (isNaN(ratingVal) || ratingVal < 0 || ratingVal > 5)
      errs.rating = "Rating must be between 0 and 5";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---- save ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    let coverUrl = form.cover;

    try {
      /* 1. Upload cover if new file selected */
      if (coverFile) {
        setIsUploading(true);
        const ext = coverFile.name.split(".").pop() || "jpg";
        const filename = `cover_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Offline admin: mock upload — create object URL
        coverUrl = URL.createObjectURL(coverFile);
        setIsUploading(false);
      }

      /* 2. Build final book object */
      const finalBook = formToBook({ ...form, cover: coverUrl });
      onSave(finalBook);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save book";
      toast.error(message);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  /* ---- input class helper ---- */
  const inputClass = (field: keyof FormErrors) =>
    cn(
      "w-full px-3 py-3 sm:py-2.5 bg-white/5 border rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/30",
      errors[field] ? "border-red-500/50" : "border-white/10"
    );

  /* ---- render ---- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0B0C15] border border-white/10 rounded-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0B0C15] z-10">
          <h2 className="text-base sm:text-lg font-outfit font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
          {/* Row 1: Title + Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className={inputClass("title")}
                placeholder="Book title"
              />
              {errors.title && (
                <p className="text-xs text-red-400">{errors.title}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Subtitle
              </label>
              <input
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
                className={inputClass("subtitle")}
                placeholder="Subtitle"
              />
            </div>
          </div>

          {/* Row 2: Category + Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value,
                    subcategory: "",
                  }))
                }
                className={inputClass("category")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1A1A24]">
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-400">{errors.category}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Subcategory
              </label>
              <select
                value={form.subcategory}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subcategory: e.target.value }))
                }
                className={inputClass("subcategory")}
              >
                <option value="" className="bg-[#1A1A24]">
                  — Select —
                </option>
                {subcategories.map((s) => (
                  <option key={s} value={s} className="bg-[#1A1A24]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Price + Pages + Rating + Language */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Price (₨)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className={inputClass("price")}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-xs text-red-400">{errors.price}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Pages
              </label>
              <input
                type="number"
                min="1"
                value={form.pages}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pages: e.target.value }))
                }
                className={inputClass("pages")}
                placeholder="0"
              />
              {errors.pages && (
                <p className="text-xs text-red-400">{errors.pages}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Rating (0–5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
                className={inputClass("rating")}
                placeholder="0.0"
              />
              {errors.rating && (
                <p className="text-xs text-red-400">{errors.rating}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    language: e.target.value as FormState["language"],
                  }))
                }
                className={inputClass("language")}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-[#1A1A24]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-white/60">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={inputClass("description")}
              placeholder="Book description..."
            />
          </div>

          {/* Row 5: Tags + Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Tags (comma-separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                className={inputClass("tags")}
                placeholder="islamic, urdu, hajj"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/60">
                Author / Publisher
              </label>
              <input
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                className={inputClass("author")}
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Row 6: Toggles */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            {(
              [
                ["isPremium", "Premium"] as const,
                ["isNew", "New Arrival"] as const,
                ["isTrending", "Trending"] as const,
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-white/70 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                  }
                  className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Row 7: Status */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-white/60">
              Publication Status
            </label>
            <div className="flex items-center gap-4">
              {(["Published", "Draft"] as const).map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 text-sm text-white/70 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((f) => ({ ...f, status: s }))}
                    className="w-[18px] h-[18px] rounded-full border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Row 8: Cover Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/60">
              Cover Image
            </label>
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 group max-w-[200px] aspect-[2/3]">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
                  Preview
                </div>
              </div>
            ) : (
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 w-full max-w-[300px] aspect-[2/3]",
                  isDragOver
                    ? "border-gold bg-gold/10"
                    : "border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">
                      Drag cover here
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-[10px] text-white/30">JPG, PNG · Max 5MB</p>
                </div>
              </label>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30 hover:text-gold"
            >
              {isSaving || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
