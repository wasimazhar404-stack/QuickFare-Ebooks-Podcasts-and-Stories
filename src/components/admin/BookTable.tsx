import { useState, useMemo } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  ImageIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Book } from "@/data/books";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BookTableProps {
  books: Book[];
  loading?: boolean;
  selectedIds: number[];
  onSelect: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean, visibleIds: number[]) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onPreview?: (book: Book) => void;
}

type SortKey =
  | "title"
  | "category"
  | "price"
  | "rating"
  | "pages"
  | "language"
  | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 25;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const getStatusColor = (status?: string) => {
  switch (status) {
    case "Published":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Draft":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Archived":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-white/10 text-white/60 border-white/10";
  }
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i} className="py-3.5">
          <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BookTable({
  books,
  loading = false,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onPreview,
}: BookTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [cardView, setCardView] = useState(false);

  /* ---- categories ---- */
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [books]);

  /* ---- filtered + sorted ---- */
  const filtered = useMemo(() => {
    let data = [...books];
    const q = search.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "All") {
      data = data.filter((b) => b.category === categoryFilter);
    }
    if (sortKey) {
      data.sort((a, b) => {
        const aRaw = (a as unknown as Record<string, unknown>)[sortKey];
        const bRaw = (b as unknown as Record<string, unknown>)[sortKey];
        let aVal: unknown = aRaw;
        let bVal: unknown = bRaw;
        if (sortKey === "status") {
          aVal = (a as unknown as Record<string, unknown>).status ?? (a.isPremium ? "Published" : "Draft");
          bVal = (b as unknown as Record<string, unknown>).status ?? (b.isPremium ? "Published" : "Draft");
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
          : String(bVal ?? "").localeCompare(String(aVal ?? ""));
      });
    }
    return data;
  }, [books, search, categoryFilter, sortKey, sortDir]);

  /* ---- pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageBooks = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const allPageSelected =
    pageBooks.length > 0 && pageBooks.every((b) => selectedIds.includes(b.id));

  /* ---- handlers ---- */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteTarget(null);
    onDelete(id);
  };

  const handleSelectAllChange = (checked: boolean) => {
    onSelectAll(checked, pageBooks.map((b) => b.id));
  };

  const renderSortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ChevronUp className="w-3 h-3 text-white/20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-gold" />
    ) : (
      <ChevronDown className="w-3 h-3 text-gold" />
    );
  };

  /* ---- card view (mobile) ---- */
  const renderCardView = () => {
    if (pageBooks.length === 0) {
      return (
        <div className="py-16 text-center text-sm text-white/40">
          No books found.
        </div>
      );
    }
    return (
      <div className="space-y-3 lg:hidden">
        {pageBooks.map((book) => {
          const status = (book as Book & { status?: string }).status ?? "Published";
          return (
            <div
              key={book.id}
              className="bg-[#ffffff06] border border-white/5 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(book.id)}
                  onChange={(e) => onSelect(book.id, e.target.checked)}
                  className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-8 h-11 object-cover rounded border border-white/10 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-11 bg-white/5 rounded border border-white/10 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {book.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(book)}
                    className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white/60" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(book.id)}
                    className="w-8 h-8 rounded-md bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                    Category
                  </p>
                  <span className="text-xs text-white/70">{book.category}</span>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                    Price
                  </p>
                  <span className="text-xs text-gold font-medium">
                    ₨{Math.round(book.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                    Rating
                  </p>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    {book.rating}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                    Status
                  </p>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-medium border",
                      getStatusColor(status)
                    )}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ---- render ---- */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 sm:flex-initial min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-64"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors shrink-0"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#1A1A24]">
              {c}
            </option>
          ))}
        </select>

        <span className="text-xs text-white/40 ml-auto hidden sm:inline">
          {filtered.length} books
        </span>

        {/* Mobile card/table toggle */}
        <button
          onClick={() => setCardView((v) => !v)}
          className="lg:hidden shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
        >
          {cardView ? "Table" : "Cards"}
        </button>
      </div>

      {/* Mobile card view */}
      {cardView && renderCardView()}

      {/* Table (desktop + when cards off on mobile) */}
      <div
        className={cn(
          "rounded-xl border border-white/5 overflow-hidden",
          cardView ? "hidden lg:block" : "block"
        )}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="border-b border-white/5 bg-[#0f0f1e] hover:bg-[#0f0f1e]">
                <TableHead className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-16 px-3 py-3">Cover</TableHead>
                <TableHead
                  className="px-3 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title {renderSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead
                  className="px-3 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-1">
                    Category {renderSortIcon("category")}
                  </div>
                </TableHead>
                <TableHead
                  className="px-3 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Price {renderSortIcon("price")}
                  </div>
                </TableHead>
                <TableHead
                  className="px-3 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center gap-1">
                    Rating {renderSortIcon("rating")}
                  </div>
                </TableHead>
                <TableHead
                  className="px-3 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status {renderSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="w-24 px-3 py-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} cols={8} />
                ))
              ) : pageBooks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-sm text-white/40"
                  >
                    No books found.
                  </TableCell>
                </TableRow>
              ) : (
                pageBooks.map((book) => {
                  const status =
                    (book as any).status ??
                    (book.isPremium ? "Published" : "Published");
                  return (
                    <TableRow
                      key={book.id}
                      className="border-b border-white/5 bg-[#ffffff04] hover:bg-[#ffffff08] transition-colors"
                    >
                      <TableCell className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(book.id)}
                          onChange={(e) =>
                            onSelect(book.id, e.target.checked)
                          }
                          className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        {book.cover ? (
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-md border border-white/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/quickfare/covers/cover_default.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-14 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-white/20" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <div>
                          <p className="text-sm text-white font-medium truncate max-w-[180px]">
                            {book.title}
                          </p>
                          <p className="text-xs text-white/40 truncate max-w-[180px]">
                            {book.subtitle}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <span className="px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10">
                          {book.category}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <span className="text-sm text-gold font-medium">
                          ₨{Math.round(book.price).toLocaleString("en-IN")}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          <span className="text-sm text-white">
                            {book.rating}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium border",
                            getStatusColor(status)
                          )}
                        >
                          {status}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(book)}
                            className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5 text-white/60" />
                          </button>
                          {onPreview && (
                            <button
                              onClick={() => onPreview(book)}
                              className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5 text-white/60" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(book.id)}
                            className="w-8 h-8 rounded-md bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 hidden sm:inline">
            Showing {startIdx + 1}-
            {Math.min(startIdx + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <span className="text-xs text-white/40 sm:hidden">
            {page} / {totalPages}
          </span>

          {/* Desktop pagination */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                if (page > 3) p = page - 2 + i;
                if (p > totalPages) p = totalPages - (4 - i);
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md text-xs font-medium transition-colors",
                    page === p
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile pagination */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-[#0f0f1e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This action cannot be undone. The book will be permanently removed
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteTarget !== null && confirmDelete(deleteTarget)
              }
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
