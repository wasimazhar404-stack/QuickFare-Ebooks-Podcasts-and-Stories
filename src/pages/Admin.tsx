import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  BookOpen,
  Users,
  DollarSign,
  ShoppingCart,
  Pencil,
  Eye,
  Trash2,
  Plus,
  Check,
  X,
  Upload,
  GripVertical,
  Save,
  Ban,
  UserCheck,
  Grid3X3,
  Download,
  Star,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Globe,
  Cpu,
  Heart,
  Shield,
  Sparkles,
  Lightbulb,
  Briefcase,
  Atom,
  Dumbbell,
  Palette,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import { useAppStore } from "@/store/useAppStore";

import { cn } from "@/lib/utils";

import Sidebar, { type AdminView } from "@/components/admin/Sidebar";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import ChartCard from "@/components/admin/ChartCard";
import UploadZone from "@/components/admin/UploadZone";
import BookTable from "@/components/admin/BookTable";
import BookFormModal from "@/components/admin/BookFormModal";

import { books as staticBooks, type Book } from "@/data/books";
import {
  mockUsers,
  mockReviews,
  activityLog,
  revenueData,
  dailyRevenueData,
  userGrowthData,
  categoryDistribution,
  trafficSources,
  topSellingBooks,
  conversionFunnel,
  recentPurchases,
  topReaders,
  adminCategories,
  type AdminUser,
  type AdminReview,
} from "@/data/adminMockData";

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Draft": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Archived": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "Active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Suspended": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Banned": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Approved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Flagged": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    default: return "bg-white/10 text-white/60 border-white/10";
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "Free": return "bg-gray-500/20 text-gray-400";
    case "Premium": return "bg-gold/20 text-gold";
    case "Lifetime": return "bg-emerald/20 text-emerald-400";
    default: return "bg-white/10 text-white/60";
  }
};

const getCategoryIcon = (iconName: string) => {
  const iconMap: Record<string, React.ElementType> = {
    BookOpen, Users, DollarSign, Heart, MessageSquare, Cpu, Globe,
    Brain: Heart, Briefcase, Atom, Shield, Lightbulb, Sparkles, Dumbbell, Palette,
  };
  return iconMap[iconName] || BookOpen;
};

/* ================================================================== */
/*  TopBar                                                            */
/* ================================================================== */

function TopBar({
  onMobileMenuToggle,
  title,
  onSearch,
}: {
  onMobileMenuToggle: () => void;
  title: string;
  onSearch?: (q: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="h-14 sm:h-16 bg-[#0a0a1a] border-b border-white/5 flex items-center px-3 sm:px-6 sticky top-0 z-30 shrink-0">
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors mr-2 sm:mr-4"
      >
        <Menu className="w-5 h-5 text-white/60" />
      </button>
      <h1 className="text-sm sm:text-lg font-outfit font-bold text-white truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {searchOpen && onSearch && (
          <div className="absolute inset-0 bg-[#0a0a1a] flex items-center px-3 z-50">
            <Search className="w-4 h-4 text-white/40 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              autoFocus
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e.target.value);
              }}
              className="flex-1 ml-2 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button onClick={() => { setSearchOpen(false); setSearch(""); onSearch(""); }} className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg bg-white/5 flex items-center justify-center">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        )}

        {onSearch && !searchOpen && (
          <>
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5 text-white/60" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </>
        )}
        <button className="relative w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
          alt="Admin"
          className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 shrink-0"
        />
      </div>
    </header>
  );
}

/* ================================================================== */
/*  Dashboard View — Supabase-powered                                 */
/* ================================================================== */

function DashboardView() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRevenue: 48392,
    booksSold: 3847,
    loading: true,
  });
  const activity = activityLog.slice(0, 8);
  const activityChartData = useMemo(
    () =>
      dailyRevenueData.slice(-14).map((d) => ({
        ...d,
        uploads: Math.max(2, Math.floor(Math.random() * 8)),
      })),
    []
  );
  const pendingReviews = mockReviews.filter((r) => r.status === "Pending" || r.status === "Flagged");

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      const [{ count: bookCount }, { count: userCount }] = await Promise.all([
        Promise.resolve({ count: 410, error: null }),
        Promise.resolve({ count: 0, error: null }),
      ]);
      if (!cancelled) {
        setStats((s) => ({
          ...s,
          totalBooks: bookCount ?? staticBooks.length,
          totalUsers: userCount ?? 12547,
          loading: false,
        }));
      }
    }
    loadStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Books"
          value={stats.loading ? "—" : stats.totalBooks}
          change={12}
          changeLabel="this month"
          icon={BookOpen}
          color="gold"
        />
        <StatCard
          title="Active Users"
          value={stats.loading ? "—" : stats.totalUsers}
          change={8}
          changeLabel="vs last month"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Total Revenue"
          value={`₨${stats.totalRevenue.toLocaleString()}`}
          change={15}
          changeLabel="vs last month"
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Books Sold"
          value={stats.booksSold}
          change={22}
          changeLabel="vs last month"
          icon={ShoppingCart}
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => {
            /* Navigate handled by parent */
            const evt = new CustomEvent("admin:setView", { detail: "books" });
            window.dispatchEvent(evt);
          }}
          className="px-4 py-2.5 bg-gold/20 border border-gold/30 rounded-lg text-sm text-gold font-medium hover:bg-gold/30 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
        <button
          onClick={() => {
            const evt = new CustomEvent("admin:setView", { detail: "categories" });
            window.dispatchEvent(evt);
          }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
        >
          <Grid3X3 className="w-4 h-4" /> Manage Categories
        </button>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard title="Monthly Revenue" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }}
                formatter={(v: number) => [`₨${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activity" subtitle="Book uploads per day">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }}
              />
              <Bar dataKey="uploads" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <ChartCard title="Category Distribution" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryDistribution.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {categoryDistribution.slice(0, 6).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Books" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSellingBooks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="title" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} width={140} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }}
              />
              <Bar dataKey="sales" fill="#C9A84C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity + Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  activity.type === "upload" && "bg-gold/15",
                  activity.type === "purchase" && "bg-emerald/15",
                  activity.type === "review" && "bg-amber/15",
                  activity.type === "update" && "bg-blue-500/15",
                  activity.type === "user" && "bg-purple-500/15",
                  activity.type === "system" && "bg-white/10"
                )}>
                  {activity.type === "upload" && <Upload className="w-4 h-4 text-gold" />}
                  {activity.type === "purchase" && <ShoppingCart className="w-4 h-4 text-emerald-400" />}
                  {activity.type === "review" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {activity.type === "update" && <Pencil className="w-4 h-4 text-blue-400" />}
                  {activity.type === "user" && <Users className="w-4 h-4 text-purple-400" />}
                  {activity.type === "system" && <TrendingUp className="w-4 h-4 text-white/60" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80">{activity.action}: <span className="text-white/60">{activity.target}</span></p>
                  <p className="text-xs text-white/40 mt-0.5">{activity.timestamp} by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Pending Reviews</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">
              {pendingReviews.length} pending
            </span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {pendingReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                <img src={review.userAvatar} alt="" className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">{review.userName}</p>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-gold fill-gold" : "text-white/20")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">on <span className="text-white/70">{review.bookTitle}</span></p>
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">{review.text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-md bg-emerald/15 hover:bg-emerald/25 flex items-center justify-center transition-colors" title="Approve">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-md bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors" title="Reject">
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Books View — Full Supabase CRUD                                   */
/* ================================================================== */

function BooksView() {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [isAddModal, setIsAddModal] = useState(false);

  /* ---- Fetch from Supabase ---- */
  useEffect(() => {
    let cancelled = false;
    async function loadBooks() {
      setLoading(true);
      const data = staticBooks;
      if (!cancelled) {
        setBookList(data);
        setLoading(false);
      }
    }
    loadBooks();
    return () => { cancelled = true; };
  }, []);

  /* ---- Handlers ---- */
  const handleSelect = (id: number, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (selected: boolean, visibleIds: number[]) => {
    setSelectedIds((prev) => {
      const rest = prev.filter((id) => !visibleIds.includes(id));
      return selected ? [...rest, ...visibleIds] : rest;
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    // Offline admin: remove from local state only
    const count = selectedIds.length;
    setBookList((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
    setSelectedIds([]);
    toast.success(`${count} books deleted`);
  };

  const handleDelete = async (id: number) => {
    // Offline admin: local state only
    setBookList((prev) => prev.filter((b) => b.id !== id));
    toast.success("Book deleted");
  };

  const handleSaveEdit = async (updated: Book) => {
    // Offline admin: local state only
    setBookList((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    setEditBook(null);
    toast.success("Book updated");
  };

  const handleAddBook = async (book: Book) => {
    const data = { ...book, id: book.id || Date.now() };
    // Offline admin: local state only
    setBookList((prev) => [data as Book, ...prev]);
    setIsAddModal(false);
    toast.success("Book added successfully");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 sm:flex-initial min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search books..."
            disabled={loading}
            className="pl-9 pr-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-64 disabled:opacity-40"
          />
        </div>
        <span className="text-xs text-white/40 ml-auto hidden sm:block">
          {bookList.length} total books
        </span>
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button className="hidden sm:flex px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setIsAddModal(true)}
            className="hidden sm:flex px-4 py-2 bg-gold/20 border border-gold/30 rounded-lg text-sm text-gold font-medium hover:bg-gold/30 transition-colors items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-gold/10 border border-gold/20 rounded-lg overflow-x-auto">
          <span className="text-sm text-gold font-medium whitespace-nowrap">
            {selectedIds.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-500/15 text-red-400 rounded-md text-xs font-medium hover:bg-red-500/25 transition-colors whitespace-nowrap"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="px-3 py-1.5 bg-white/10 text-white/70 rounded-md text-xs font-medium hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      )}

      {/* Book Table */}
      <BookTable
        books={bookList}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onEdit={setEditBook}
        onDelete={handleDelete}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setIsAddModal(true)}
        className="sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-gold/90 text-white shadow-lg shadow-black/40 flex items-center justify-center hover:bg-gold transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Edit Modal */}
      {editBook && (
        <BookFormModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSave={handleSaveEdit}
          title="Edit Book"
        />
      )}

      {/* Add Modal */}
      {isAddModal && (
        <BookFormModal
          book={null}
          onClose={() => setIsAddModal(false)}
          onSave={handleAddBook}
          title="Add New Book"
        />
      )}
    </div>
  );
}

/* ================================================================== */
/*  Upload View — preserved                                           */
/* ================================================================== */

function UploadView() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    author: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    language: "english",
    pages: "",
    tags: "",
    ageRating: "All Ages",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCoverSelect = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleRemoveCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category.trim()) errs.category = "Category is required";
    if (!form.price.trim() || isNaN(Number(form.price))) errs.price = "Valid price is required";
    if (!form.pages.trim() || isNaN(Number(form.pages))) errs.pages = "Valid page count is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async () => {
    if (validate()) {
      const bookPayload: Partial<Book> = {
        title: form.title,
        subtitle: form.subtitle,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description,
        price: parseFloat(form.price) || 0,
        pages: parseInt(form.pages) || 0,
        language: form.language as Book["language"],
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        rating: 0,
        isPremium: false,
        isNew: true,
        isTrending: false,
      };

      let coverUrl = "";
      if (coverFile) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const filename = `cover_${Date.now()}.${ext}`;
        // Mock upload: generate local path
        coverUrl = "/covers/" + filename;
      }

      // Offline admin: local state only
      toast.success("Book published successfully!");
      setForm({ title: "", subtitle: "", author: "", description: "", category: "", subcategory: "", price: "", language: "english", pages: "", tags: "", ageRating: "All Ages" });
      handleRemoveCover();
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const inputClass = (field: string) =>
    cn(
      "w-full px-3 py-3.5 sm:py-2.5 bg-white/5 border rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors",
      errors[field] ? "border-red-500/50" : "border-white/10"
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-outfit font-bold text-white mb-6">Upload New Book</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60">Book Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass("title")} placeholder="Enter book title" />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass("subtitle")} placeholder="Subtitle" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Author / Publisher</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputClass("author")} placeholder="Author name" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Category <span className="text-red-400">*</span></label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass("category")} placeholder="e.g. Islamic" />
                {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Subcategory</label>
                <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className={inputClass("subcategory")} placeholder="Subcategory" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Price (₨) <span className="text-red-400">*</span></label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass("price")} placeholder="0.00" />
                {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Pages <span className="text-red-400">*</span></label>
                <input value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} className={inputClass("pages")} placeholder="Number of pages" />
                {errors.pages && <p className="text-xs text-red-400">{errors.pages}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={inputClass("language")}>
                  <option className="bg-[#1A1A24]" value="english">English</option>
                  <option className="bg-[#1A1A24]" value="urdu">Urdu</option>
                  <option className="bg-[#1A1A24]" value="bilingual">Bilingual</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Age Rating</label>
                <select value={form.ageRating} onChange={(e) => setForm({ ...form, ageRating: e.target.value })} className={inputClass("ageRating")}>
                  <option className="bg-[#1A1A24]" value="All Ages">All Ages</option>
                  <option className="bg-[#1A1A24]" value="7+">7+</option>
                  <option className="bg-[#1A1A24]" value="13+">13+</option>
                  <option className="bg-[#1A1A24]" value="18+">18+</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass("description")} placeholder="Full book description..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass("tags")} placeholder="islamic, urdu, hajj" />
            </div>
          </div>

          {/* Cover Upload + Preview */}
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60">Cover Image</label>
              <UploadZone
                onFileSelect={handleCoverSelect}
                preview={coverPreview}
                onRemove={handleRemoveCover}
                label="Drag cover here"
                sublabel="JPG, PNG up to 10MB"
                aspectRatio="aspect-[2/3]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Card Preview</label>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0F] max-w-[300px] mx-auto">
                <div className={cn("relative bg-white/5", coverPreview ? "" : "aspect-[2/3] flex items-center justify-center")}>
                  {coverPreview ? (
                    <img src={coverPreview} alt="Preview" className="w-full aspect-[2/3] object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-white/20" />
                  )}
                  {coverPreview && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                      <p className="text-sm font-bold text-white truncate">{form.title || "Book Title"}</p>
                      <p className="text-xs text-white/60 truncate">{form.subtitle || "Subtitle"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gold font-medium">₨{form.price || "0.00"}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">{form.category || "Category"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 mt-6 border-t border-white/5">
          <button onClick={handleSaveDraft} className="px-5 py-3.5 sm:py-2.5 rounded-lg border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-colors">
            Save as Draft
          </button>
          <button onClick={handlePublish} className="px-5 py-3.5 sm:py-2.5 rounded-lg bg-gold/20 border border-gold/30 text-sm text-gold font-medium hover:bg-gold/30 transition-colors flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Categories View — preserved                                       */
/* ================================================================== */

function CategoriesView() {
  const [cats, setCats] = useState(adminCategories);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [isAdd, setIsAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", description: "" });

  const handleReorder = (dragIdx: number, dropIdx: number) => {
    const newCats = [...cats];
    const [removed] = newCats.splice(dragIdx, 1);
    newCats.splice(dropIdx, 0, removed);
    setCats(newCats);
  };

  const handleSaveEdit = () => {
    setCats((prev) => prev.map((c) => (c.id === editId ? { ...c, ...editForm } : c)));
    setEditId(null);
    toast.success("Category updated");
  };

  const handleAdd = () => {
    if (!newForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setCats((prev) => [...prev, { id: Date.now(), name: newForm.name, description: newForm.description, icon: "BookOpen", count: 0 }]);
    setIsAdd(false);
    setNewForm({ name: "", description: "" });
    toast.success("Category added");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-9 pr-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-64"
          />
        </div>
        <button
          onClick={() => setIsAdd(true)}
          className="px-3 sm:px-4 py-2.5 sm:py-2 bg-gold/20 border border-gold/30 rounded-lg text-xs sm:text-sm text-gold font-medium hover:bg-gold/30 transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Category</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="bg-[#0f0f1e] border-b border-white/5">
              <th className="px-4 py-3 text-xs font-semibold text-white/60 uppercase w-12"></th>
              <th className="px-4 py-3 text-xs font-semibold text-white/60 uppercase">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/60 uppercase">Description</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/60 uppercase text-right">Books</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/60 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((cat, idx) => {
              const Icon = getCategoryIcon(cat.icon);
              const isEditing = editId === cat.id;
              return (
                <tr key={cat.id} className="border-b border-white/5 bg-[#ffffff04] hover:bg-[#ffffff08] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      {idx > 0 && (
                        <button onClick={() => handleReorder(idx, idx - 1)} className="text-white/20 hover:text-white/50 transition-colors">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}
                      <GripVertical className="w-3.5 h-3.5 text-white/20" />
                      {idx < cats.length - 1 && (
                        <button onClick={() => handleReorder(idx, idx + 1)} className="text-white/20 hover:text-white/50 transition-colors">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-gold/50 w-48"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-gold" />
                        </div>
                        <span className="text-sm text-white font-medium">{cat.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-gold/50 w-full max-w-md"
                      />
                    ) : (
                      <span className="text-sm text-white/60">{cat.description}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-white/70 font-medium">{cat.count}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={handleSaveEdit} className="w-8 h-8 rounded-md bg-emerald/15 flex items-center justify-center hover:bg-emerald/25 transition-colors">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button onClick={() => setEditId(null)} className="w-8 h-8 rounded-md bg-red-500/15 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(cat.id);
                          setEditForm({ name: cat.name, description: cat.description });
                        }}
                        className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-white/60" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {isAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdd(false)} />
          <div className="relative bg-[#0f0f1e] border border-white/10 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-outfit font-bold text-white mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/60">Name *</label>
                <input value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50" placeholder="Category name" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/60">Description</label>
                <input value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50" placeholder="Short description" />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button onClick={() => setIsAdd(false)} className="px-4 py-3 sm:py-2 rounded-lg border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-3 sm:py-2 rounded-lg bg-gold/20 border border-gold/30 text-sm text-gold font-medium hover:bg-gold/30 transition-colors">Add Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Users View — preserved                                            */
/* ================================================================== */

function UsersView() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesPlan = planFilter === "All" || u.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [users, search, planFilter]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next: AdminUser["status"] = u.status === "Active" ? "Suspended" : "Active";
        return { ...u, status: next };
      })
    );
    toast.success("User status updated");
  };

  const userColumns = [
    {
      key: "avatar",
      header: "",
      width: "w-14",
      render: (u: AdminUser) => <img src={u.avatar} alt="" className="w-9 h-9 rounded-full bg-white/5" />,
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (u: AdminUser) => (
        <div>
          <p className="text-sm text-white font-medium">{u.name}</p>
          <p className="text-xs text-white/40">{u.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      sortable: true,
      render: (u: AdminUser) => (
        <span className={cn("px-2.5 py-1 rounded-md text-xs font-medium", getPlanColor(u.plan))}>{u.plan}</span>
      ),
    },
    {
      key: "booksRead",
      header: "Books",
      sortable: true,
      render: (u: AdminUser) => <span className="text-sm text-white/70">{u.booksRead}</span>,
    },
    {
      key: "joinedDate",
      header: "Joined",
      sortable: true,
      render: (u: AdminUser) => <span className="text-sm text-white/50">{u.joinedDate}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u: AdminUser) => (
        <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", getStatusColor(u.status))}>{u.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 sm:flex-initial min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-64"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-3 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option className="bg-[#1A1A24]" value="All">All Plans</option>
          <option className="bg-[#1A1A24]" value="Free">Free</option>
          <option className="bg-[#1A1A24]" value="Premium">Premium</option>
          <option className="bg-[#1A1A24]" value="Lifetime">Lifetime</option>
        </select>
        <span className="text-xs text-white/40 ml-auto">{filtered.length} users</span>
      </div>

      <DataTable
        data={filtered}
        columns={userColumns}
        pagination
        pageSize={15}
        cardTitleKey="name"
        actions={(u) => (
          <>
            <button onClick={() => setSelectedUser(u)} className="w-9 h-9 sm:w-7 sm:h-7 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" title="View">
              <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white/60" />
            </button>
            <button
              onClick={() => toggleStatus(u.id)}
              className={cn(
                "w-9 h-9 sm:w-7 sm:h-7 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded-md flex items-center justify-center transition-colors",
                u.status === "Active"
                  ? "bg-amber-500/15 hover:bg-amber-500/25"
                  : "bg-emerald/15 hover:bg-emerald/25"
              )}
              title={u.status === "Active" ? "Suspend" : "Activate"}
            >
              {u.status === "Active" ? <Ban className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400" /> : <UserCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" />}
            </button>
          </>
        )}
      />

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-[#0f0f1e] border border-white/10 rounded-xl w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <img src={selectedUser.avatar} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border-2 border-gold/30 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-outfit font-bold text-white truncate">{selectedUser.name}</h3>
                <p className="text-sm text-white/50 truncate">{selectedUser.email}</p>
                <span className={cn("inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-medium", getPlanColor(selectedUser.plan))}>{selectedUser.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-lg sm:text-xl font-outfit font-bold text-white">{selectedUser.booksRead}</p>
                <p className="text-xs text-white/40 mt-1">Books Read</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-lg sm:text-xl font-outfit font-bold text-white">{selectedUser.totalPages.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">Pages Read</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-lg sm:text-xl font-outfit font-bold text-white">{selectedUser.readingTime}</p>
                <p className="text-xs text-white/40 mt-1">Reading Time</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-lg sm:text-xl font-outfit font-bold text-gold">{selectedUser.streak}</p>
                <p className="text-xs text-white/40 mt-1">Day Streak</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-white/50">Joined</span>
                <span className="text-sm text-white">{selectedUser.joinedDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-white/50">Country</span>
                <span className="text-sm text-white">{selectedUser.country}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-white/50">Status</span>
                <span className={cn("text-sm", selectedUser.status === "Active" ? "text-emerald-400" : "text-red-400")}>{selectedUser.status}</span>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="w-full mt-6 py-3 sm:py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/70 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Reviews View — preserved                                          */
/* ================================================================== */

function ReviewsView() {
  const [reviews, setReviews] = useState<AdminReview[]>(mockReviews);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return reviews;
    return reviews.filter((r) => r.status === statusFilter);
  }, [reviews, statusFilter]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => (selected ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? filtered.map((r) => r.id) : []);
  };

  const approve = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" as const } : r)));
    toast.success("Review approved");
  };

  const reject = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as const } : r)));
    toast.success("Review rejected");
  };

  const bulkApprove = () => {
    setReviews((prev) => prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Approved" as const } : r)));
    setSelectedIds([]);
    toast.success("Reviews approved in bulk");
  };

  const bulkReject = () => {
    setReviews((prev) => prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Rejected" as const } : r)));
    setSelectedIds([]);
    toast.success("Reviews rejected in bulk");
  };

  const reviewColumns = [
    {
      key: "bookTitle",
      header: "Book",
      sortable: true,
      render: (r: AdminReview) => <span className="text-sm text-white font-medium truncate max-w-[160px] block">{r.bookTitle}</span>,
    },
    {
      key: "userName",
      header: "User",
      sortable: true,
      render: (r: AdminReview) => (
        <div className="flex items-center gap-2">
          <img src={r.userAvatar} alt="" className="w-7 h-7 rounded-full bg-white/5 shrink-0" />
          <span className="text-sm text-white/80">{r.userName}</span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (r: AdminReview) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "text-gold fill-gold" : "text-white/20")} />
          ))}
        </div>
      ),
    },
    {
      key: "text",
      header: "Review",
      render: (r: AdminReview) => <span className="text-sm text-white/60 line-clamp-2 max-w-[280px]">{r.text}</span>,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (r: AdminReview) => <span className="text-sm text-white/40">{r.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r: AdminReview) => (
        <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", getStatusColor(r.status))}>{r.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", "Pending", "Approved", "Rejected", "Flagged"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0",
              statusFilter === s ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            )}
          >
            {s}
          </button>
        ))}
        <span className="text-xs text-white/40 ml-auto shrink-0">{filtered.length} reviews</span>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-gold/10 border border-gold/20 rounded-lg overflow-x-auto">
          <span className="text-sm text-gold font-medium whitespace-nowrap">{selectedIds.length} selected</span>
          <button onClick={bulkApprove} className="px-3 py-1.5 bg-emerald/15 text-emerald-400 rounded-md text-xs font-medium hover:bg-emerald/25 transition-colors whitespace-nowrap">Approve All</button>
          <button onClick={bulkReject} className="px-3 py-1.5 bg-red-500/15 text-red-400 rounded-md text-xs font-medium hover:bg-red-500/25 transition-colors whitespace-nowrap">Reject All</button>
        </div>
      )}

      <DataTable
        data={filtered}
        columns={reviewColumns}
        pagination
        pageSize={15}
        selectable
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        cardTitleKey="bookTitle"
        actions={(r) => (
          <>
            {r.status !== "Approved" && (
              <button onClick={() => approve(r.id)} className="w-9 h-9 sm:w-7 sm:h-7 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded-md bg-emerald/15 hover:bg-emerald/25 flex items-center justify-center transition-colors" title="Approve">
                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              </button>
            )}
            {r.status !== "Rejected" && (
              <button onClick={() => reject(r.id)} className="w-9 h-9 sm:w-7 sm:h-7 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded-md bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors" title="Reject">
                <X className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-red-400" />
              </button>
            )}
            <button className="w-9 h-9 sm:w-7 sm:h-7 min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" title="Delete">
              <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white/40" />
            </button>
          </>
        )}
      />
    </div>
  );
}

/* ================================================================== */
/*  Analytics View — preserved                                        */
/* ================================================================== */

function AnalyticsView() {
  const [dateRange, setDateRange] = useState("30 Days");
  const ranges = ["Today", "7 Days", "30 Days", "90 Days", "Custom"];
  const dauData = useMemo(
    () =>
      dailyRevenueData.map((d, i) => ({
        ...d,
        users: Math.floor(800 + Math.random() * 400 + i * 10),
      })),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setDateRange(r)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0",
              dateRange === r ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard title="Daily Active Users" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dauData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }} />
              <Line type="monotone" dataKey="users" stroke="#2A9D8F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={trafficSources} cx="50%" cy="45%" outerRadius={70} dataKey="value" labelLine={false} label={({ name, value }) => `${name}: ${value}%`}>
                {trafficSources.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryDistribution.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${v}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }} />
              <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Growth" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", padding: "12px" }} />
              <Area type="monotone" dataKey="users" stroke="#C9A84C" strokeWidth={2} fill="url(#ugGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Conversion Funnel" className="max-w-2xl">
        <div className="space-y-3 pt-2">
          {conversionFunnel.map((step, idx) => {
            const max = conversionFunnel[0].count;
            const pct = (step.count / max) * 100;
            const prevCount = idx > 0 ? conversionFunnel[idx - 1].count : max;
            const dropOff = idx > 0 ? ((prevCount - step.count) / prevCount * 100).toFixed(1) : null;
            return (
              <div key={step.stage} className="flex items-center gap-3 sm:gap-4">
                <span className="w-16 sm:w-20 text-[10px] sm:text-xs text-white/50 font-medium text-right shrink-0">{step.stage}</span>
                <div className="flex-1 h-6 sm:h-8 bg-white/5 rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: idx === 0 ? "#C9A84C" : idx === conversionFunnel.length - 1 ? "#1E5C45" : `rgba(201,168,76,${0.6 - idx * 0.1})`,
                    }}
                  />
                </div>
                <span className="w-12 sm:w-16 text-xs sm:text-sm text-white font-medium shrink-0">{step.count.toLocaleString()}</span>
                {dropOff && (
                  <span className="text-[10px] sm:text-xs text-red-400 shrink-0">-{dropOff}%</span>
                )}
              </div>
            );
          })}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Purchases</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[280px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase">User</th>
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase">Book</th>
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.slice(0, 6).map((p, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 text-sm text-white/80">{p.user}</td>
                    <td className="py-2.5 text-sm text-white/60 truncate max-w-[140px]">{p.book}</td>
                    <td className="py-2.5 text-sm text-gold text-right">${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Readers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[280px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase">User</th>
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase text-right">Books</th>
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase text-right">Pages</th>
                  <th className="pb-2 text-xs font-semibold text-white/40 uppercase text-right">Streak</th>
                </tr>
              </thead>
              <tbody>
                {topReaders.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 text-sm text-white/80">{r.user}</td>
                    <td className="py-2.5 text-sm text-white/60 text-right">{r.booksRead}</td>
                    <td className="py-2.5 text-sm text-white/60 text-right">{r.pages.toLocaleString()}</td>
                    <td className="py-2.5 text-sm text-gold text-right">{r.streak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Settings View — preserved                                         */
/* ================================================================== */

function SettingsView() {
  const [settings, setSettings] = useState({
    siteName: "QuickFare OTT",
    contactEmail: "admin@quickfare.com",
    currency: "PKR",
    enableReviews: true,
    requireApproval: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-outfit font-bold text-white mb-5">General Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60">Site Name</label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-3.5 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60">Contact Email</label>
            <input
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3 py-3.5 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-3.5 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
            >
              <option className="bg-[#1A1A24]" value="USD">USD ($)</option>
              <option className="bg-[#1A1A24]" value="EUR">EUR (€)</option>
              <option className="bg-[#1A1A24]" value="GBP">GBP (£)</option>
              <option className="bg-[#1A1A24]" value="PKR">PKR (₨)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-outfit font-bold text-white mb-5">Content & Moderation</h3>
        <div className="space-y-4">
          {[
            { key: "enableReviews", label: "Enable Reviews", desc: "Allow users to leave reviews on books" },
            { key: "requireApproval", label: "Require Approval", desc: "New reviews need admin approval before publishing" },
            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Put site in maintenance mode for all visitors" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors shrink-0",
                  settings[item.key as keyof typeof settings] ? "bg-gold/40" : "bg-white/10"
                )}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings[item.key as keyof typeof settings] ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-outfit font-bold text-white mb-5">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: "analyticsEnabled", label: "Analytics", desc: "Collect usage analytics for reports" },
            { key: "emailNotifications", label: "Email Notifications", desc: "Send email alerts for important events" },
            { key: "pushNotifications", label: "Push Notifications", desc: "Enable browser push notifications" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors shrink-0",
                  settings[item.key as keyof typeof settings] ? "bg-gold/40" : "bg-white/10"
                )}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings[item.key as keyof typeof settings] ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button className="px-5 py-3 sm:py-2.5 rounded-lg border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-colors">Reset</button>
        <button
          onClick={() => toast.success("Settings saved successfully")}
          className="px-5 py-3 sm:py-2.5 rounded-lg bg-gold/20 border border-gold/30 text-sm text-gold font-medium hover:bg-gold/30 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Admin Page — with guard                                      */
/* ================================================================== */

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, isLoadingAuth } = useAppStore();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ---- Admin redirect guard ---- */
  useEffect(() => {
    if (!isLoadingAuth && !isAdmin) {
      navigate("/");
    }
  }, [isLoadingAuth, isAdmin, navigate]);

  /* ---- Listen for quick-action navigation ---- */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "string") {
        setActiveView(detail as AdminView);
      }
    };
    window.addEventListener("admin:setView", handler);
    return () => window.removeEventListener("admin:setView", handler);
  }, []);

  /* ---- Show loader while auth loads ---- */
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-white/50 text-sm mt-4">Checking admin access...</p>
      </div>
    );
  }

  /* ---- If not admin, render nothing (redirect will happen) ---- */
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 text-white/20 mb-4" />
        <p className="text-white/50 text-sm">Redirecting to home...</p>
      </div>
    );
  }

  const viewTitles: Record<AdminView, string> = {
    dashboard: "Dashboard",
    books: "Books",
    upload: "Upload",
    categories: "Categories",
    users: "Users",
    reviews: "Reviews",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <TopBar
            onMobileMenuToggle={() => setMobileSidebarOpen(true)}
            title={viewTitles[activeView]}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "books" && <BooksView />}
            {activeView === "upload" && <UploadView />}
            {activeView === "categories" && <CategoriesView />}
            {activeView === "users" && <UsersView />}
            {activeView === "reviews" && <ReviewsView />}
            {activeView === "analytics" && <AnalyticsView />}
            {activeView === "settings" && <SettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
}
