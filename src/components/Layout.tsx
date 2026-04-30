import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  Search,
  BookOpen,
  Crown,
  User,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const bottomNavItems = [
  { label: "Home", icon: Compass, href: "/" },
  { label: "Browse", icon: Search, href: "/browse" },
  { label: "Library", icon: BookOpen, href: "/library" },
  { label: "Pricing", icon: Crown, href: "/pricing" },
  { label: "Profile", icon: User, href: "/profile" },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        height: "calc(64px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="h-full bg-midnight-100/85 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="flex flex-col items-center justify-center gap-0.5 min-h-[48px] min-w-[56px] rounded-lg transition-colors duration-200"
              aria-label={item.label}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  active ? "text-gold" : "text-[#6B6B7B]"
                }`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  active ? "text-gold" : "text-[#6B6B7B]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-midnight text-white overflow-x-hidden">
      <Navbar />
      {/* Bottom padding on mobile for bottom nav, none on desktop */}
      <main className="pb-[calc(64px+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      {/* Footer on mobile - simplified view */}
      <div className="lg:hidden pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
