import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Users,
  BarChart3,
  Tags,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminView =
  | "dashboard"
  | "books"
  | "upload"
  | "categories"
  | "users"
  | "reviews"
  | "analytics"
  | "settings";

interface SidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: {
  id: AdminView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "books", label: "Books", icon: BookOpen, badge: "400" },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "users", label: "Users", icon: Users, badge: "12.5K" },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "categories", label: "Categories", icon: Tags, badge: "27" },
  { id: "reviews", label: "Reviews", icon: MessageSquare, badge: "24" },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    onCloseMobile();
  }, [activeView]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (view: AdminView) => {
    onViewChange(view);
    onCloseMobile();
  };

  const sidebarContent = (
    <>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-outfit font-bold text-white text-sm leading-tight whitespace-nowrap">
                QuickFare
              </span>
              <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
                Admin
              </span>
            </div>
          )}
        </div>
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:flex ml-auto w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 items-center justify-center transition-colors shrink-0",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white/60" />
          )}
        </button>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => collapsed && setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
            >
              <button
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 rounded-lg transition-all duration-200 group relative min-h-[48px]",
                  isActive
                    ? "bg-[rgba(201,168,76,0.1)] text-white border-l-[3px] border-gold"
                    : "text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-gold" : "text-white/50 group-hover:text-white/80"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-gold/20 text-gold"
                        : "bg-white/10 text-white/60"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip when collapsed */}
              {collapsed && tooltip === item.label && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[#1A1A24] text-white text-xs rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 text-[10px] text-gold">{item.badge}</span>
                  )}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1A1A24] border-l border-b border-white/10 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg",
            collapsed ? "justify-center" : ""
          )}
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-8 h-8 rounded-full bg-gold/20 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                Admin User
              </p>
              <p className="text-[10px] text-white/40 truncate">Super Admin</p>
            </div>
          )}
        </div>
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors mt-1",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: Overlay + sliding sidebar */}
      {/* Mobile backdrop */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Mobile sidebar (slides from left) */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0f0f1e] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          "w-[80%] max-w-[320px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen bg-[#0f0f1e] border-r border-white/5 z-40 flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-[240px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
