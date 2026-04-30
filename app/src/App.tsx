import { lazy, Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";

// Lazy load all pages for code splitting & performance
const Home = lazy(() => import("@/pages/Home"));
const Browse = lazy(() => import("@/pages/Browse"));
const BookDetail = lazy(() => import("@/pages/BookDetail"));
const Reader = lazy(() => import("@/pages/Reader"));
const Categories = lazy(() => import("@/pages/Categories"));
const Library = lazy(() => import("@/pages/Library"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Login = lazy(() => import("@/pages/Login"));
const Admin = lazy(() => import("@/pages/Admin"));

/** Loading skeleton fallback for Suspense */
function PageLoader() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
      </div>
      <p className="text-gold text-sm md:text-base font-semibold mt-5 animate-pulse tracking-wider">
        Loading...
      </p>
    </div>
  );
}

/* ═══════════════════════ Protected Route Guard ═══════════════════════ */
function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const user = useAppStore((s) => s.user);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const isLoadingAuth = useAppStore((s) => s.isLoadingAuth);
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
        <p className="text-gold text-sm font-semibold mt-4 animate-pulse">
          {tLoading("Authenticating...", "توثیق ہو رہی ہے...")}
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/* Small bilingual helper for the loader (no store access during SSR guard) */
function tLoading(en: string, ur: string) {
  // Default to English; store isn't safe here during init
  return en;
}

/* ═══════════════════════ App Routes ═══════════════════════ */
function AppRoutes() {
  const initializeAuth = useAppStore((s) => s.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
