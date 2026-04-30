import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelect?: (id: any, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  cardTitleKey?: keyof T; // Key to use as title in card view
  cardSubtitleKey?: keyof T; // Key to use as subtitle in card view
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchKeys,
  pagination = true,
  pageSize = 20,
  selectable = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
  actions,
  emptyMessage = "No data found",
  className,
  cardTitleKey,
  cardSubtitleKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardView, setCardView] = useState(false);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchable && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) => {
        if (searchKeys) {
          return searchKeys.some((key) =>
            String(row[key] ?? "").toLowerCase().includes(q)
          );
        }
        return Object.values(row).some((v) =>
          String(v ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, search, sortKey, sortDir, searchable, searchKeys]);

  const totalPages = pagination ? Math.ceil(filteredData.length / pageSize) : 1;
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = pagination
    ? filteredData.slice(startIdx, startIdx + pageSize)
    : filteredData;

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allSelected =
    pageData.length > 0 && pageData.every((row) => selectedIds.includes(row.id));

  // Mobile card view rendering
  const renderCardView = () => {
    if (pageData.length === 0) {
      return (
        <div className="py-16 text-center text-sm text-white/40">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {pageData.map((row, idx) => (
          <div
            key={row.id ?? idx}
            className="bg-[#ffffff06] border border-white/5 rounded-xl p-4 space-y-3"
          >
            {/* Card header: checkbox + title column + actions */}
            <div className="flex items-start gap-3">
              {selectable && (
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={(e) => onSelect?.(row.id, e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {cardTitleKey ? (
                  <p className="text-sm text-white font-medium truncate">
                    {String(row[cardTitleKey] ?? "—")}
                  </p>
                ) : columns[0]?.render ? (
                  <div className="text-sm">{columns[0].render(row, idx)}</div>
                ) : (
                  <p className="text-sm text-white font-medium truncate">
                    {String(row[columns[0]?.key] ?? "—")}
                  </p>
                )}
                {cardSubtitleKey && (
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    {String(row[cardSubtitleKey] ?? "")}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-1 shrink-0">
                  {actions(row)}
                </div>
              )}
            </div>
            {/* Card body: remaining columns */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              {columns.slice(cardTitleKey ? 0 : 1).map((col) => (
                <div key={col.key} className="min-w-0">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                    {col.header}
                  </p>
                  <div className="text-xs text-white/70 truncate">
                    {col.render
                      ? col.render(row, idx)
                      : String(row[col.key] ?? "—")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Search + View Toggle */}
      <div className="flex items-center gap-3 mb-4">
        {searchable && (
          <div className="relative flex-1 max-w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        )}
        {/* Card/Table toggle — visible on mobile only */}
        <button
          onClick={() => setCardView((v) => !v)}
          className="lg:hidden shrink-0 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-colors bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
        >
          {cardView ? "Table" : "Cards"}
        </button>
        <span className="text-xs text-white/40 ml-auto shrink-0">
          {filteredData.length} results
        </span>
      </div>

      {/* Card View (mobile) */}
      {cardView && (
        <div className="lg:hidden">{renderCardView()}</div>
      )}

      {/* Table View — horizontal scroll on mobile */}
      <div
        className={cn(
          "overflow-x-auto rounded-xl border border-white/5 -mx-1 px-1",
          "lg:overflow-visible lg:mx-0 lg:px-0 lg:block",
          cardView ? "hidden lg:block" : "block"
        )}
      >
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-[#0f0f1e] border-b border-white/5">
              {selectable && (
                <th className="w-12 px-3 sm:px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, colIdx) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 sm:px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:text-white transition-colors select-none",
                    col.width,
                    // Sticky first data column on mobile
                    colIdx === 0 && "sticky left-0 bg-[#0f0f1e] z-10 sm:static sm:bg-transparent sm:z-auto"
                  )}
                  onClick={() => handleSort(col.key, col.sortable)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-gold">
                        {sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="w-16 px-3 sm:px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-16 text-center text-sm text-white/40"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className="border-b border-white/5 bg-[#ffffff04] hover:bg-[#ffffff08] transition-colors min-h-[56px]"
                >
                  {selectable && (
                    <td className="px-3 sm:px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => onSelect?.(row.id, e.target.checked)}
                        className="w-[18px] h-[18px] rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 sm:px-4 py-3.5 text-sm",
                        // Sticky first data column on mobile
                        colIdx === 0 && "sticky left-0 bg-[#ffffff04] z-10 sm:static sm:bg-transparent sm:z-auto"
                      )}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 sm:px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-white/40 hidden sm:inline">
            Showing {startIdx + 1}-{Math.min(startIdx + pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
          <span className="text-xs text-white/40 sm:hidden">
            {currentPage} / {totalPages}
          </span>

          {/* Desktop: full pagination */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) page = currentPage - 2 + i;
                if (page > totalPages) page = totalPages - (4 - i);
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md text-xs font-medium transition-colors",
                    currentPage === page
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile: simplified prev/next */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[40px] min-w-[64px]"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[40px] min-w-[64px]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
