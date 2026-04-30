import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";

import type { Book } from "@/data/books";
import {
  addToWatchlist as supabaseAddToWatchlist,
  removeFromWatchlist as supabaseRemoveFromWatchlist,
  getWatchlist,
  getProgress,
  updateProgress as supabaseUpdateProgress,
} from "@/lib/supabase-books";

interface AppState {
  /* ── Existing app state ── */
  watchlist: number[];
  readingProgress: Record<number, number>;
  isPlaying: boolean;
  currentBook: Book | null;
  language: "en" | "ur";
  books: Book[];
  booksLoading: boolean;
  booksError: string | null;

  /* ── Supabase auth state ── */
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoadingAuth: boolean;
  isPremiumUser: boolean;

  /* ── Existing actions ── */
  addToWatchlist: (bookId: number) => void;
  removeFromWatchlist: (bookId: number) => void;
  updateProgress: (bookId: number, percent: number) => void;
  setCurrentBook: (book: Book | null) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleLanguage: () => void;
  isInWatchlist: (bookId: number) => boolean;
  getProgress: (bookId: number) => number;
  setBooks: (books: Book[]) => void;
  setBooksLoading: (loading: boolean) => void;
  setBooksError: (error: string | null) => void;
  setUser: (user: User | null, isAdmin?: boolean) => void;
  setAdmin: (isAdmin: boolean) => void;
  syncUserData: () => Promise<void>;

  /* ── Auth actions ── */
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  sendPhoneOtp: (phone: string) => Promise<{ error: string | null }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  checkAdmin: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  initializeAuth: () => (() => void) | void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      /* ── State defaults ── */
      watchlist: [],
      readingProgress: {},
      isPlaying: false,
      currentBook: null,
      language: "en",
      books: [],
      booksLoading: false,
      booksError: null,
      user: null,
      session: null,
      isAdmin: false,
      isLoadingAuth: true,
      isPremiumUser: false,

      /* ── Watchlist with Supabase sync ── */
      addToWatchlist: (bookId) => {
        set((state) => ({
          watchlist: state.watchlist.includes(bookId)
            ? state.watchlist
            : [...state.watchlist, bookId],
        }));

        const user = get().user;
        if (user) {
          supabaseAddToWatchlist(user.id, bookId).catch((err) => {
            console.warn("Supabase addToWatchlist failed:", err);
          });
        }
      },

      removeFromWatchlist: (bookId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((id) => id !== bookId),
        }));

        const user = get().user;
        if (user) {
          supabaseRemoveFromWatchlist(user.id, bookId).catch((err) => {
            console.warn("Supabase removeFromWatchlist failed:", err);
          });
        }
      },

      /* ── Progress with Supabase sync ── */
      updateProgress: (bookId, percent) => {
        const clamped = Math.min(100, Math.max(0, percent));
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            [bookId]: clamped,
          },
        }));

        const user = get().user;
        if (user) {
          const book = get().books.find((b) => b.id === bookId);
          const currentPage = book
            ? Math.round((clamped / 100) * book.pages)
            : 0;

          supabaseUpdateProgress(user.id, bookId, clamped, currentPage).catch(
            (err) => {
              console.warn("Supabase updateProgress failed:", err);
            }
          );
        }
      },

      setCurrentBook: (book) => set({ currentBook: book }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      toggleLanguage: () =>
        set((state) => ({
          language: state.language === "en" ? "ur" : "en",
        })),

      isInWatchlist: (bookId) => get().watchlist.includes(bookId),

      getProgress: (bookId) => get().readingProgress[bookId] || 0,

      setBooks: (books) => set({ books }),

      setBooksLoading: (loading) => set({ booksLoading: loading }),

      setBooksError: (error) => set({ booksError: error }),
      setUser: (user: any, isAdmin?: boolean) => {
        set({ user, isAdmin: isAdmin ?? get().isAdmin });
        if (user) {
          get().syncUserData();
        }
      },

      setAdmin: (isAdmin: boolean) => set({ isAdmin }),

      syncUserData: async () => {
        const user = get().user;
        if (!user) return;

        try {
          const [watchlistBooks, progressData] = await Promise.all([
            getWatchlist(user.id),
            getProgress(user.id, 0),
          ]);
          const watchlistIds = watchlistBooks.map((b: any) => b.id);
          const progressMap: Record<number, number> = {};
          if (progressData && typeof progressData.progress === 'number') {
            progressMap[0] = progressData.progress;
          }

          set((state) => ({
            watchlist: watchlistIds.length > 0
              ? [...new Set([...state.watchlist, ...watchlistIds])]
              : state.watchlist,
            readingProgress: Object.keys(progressMap).length > 0
              ? { ...state.readingProgress, ...progressMap }
              : state.readingProgress,
          }));
        } catch (err) {
          console.warn("syncUserData failed, keeping local data:", err);
        }
      },


      /* ── Auth: Email Login ── */
      login: async (email, password) => {
        return { error: null };
      },

      /* ── Auth: Email Register ── */
      register: async (email, password, fullName) => {
        return { error: null };
      },

      /* ── Auth: Send Phone OTP ── */
      sendPhoneOtp: async (phone) => {
        return { error: null };
      },

      /* ── Auth: Verify Phone OTP ── */
      loginWithPhone: async (phone, otp) => {
        return { error: null };
      },

      /* ── Auth: Logout ── */
      logout: async () => {
        localStorage.removeItem("qf_user");
        set({ user: null, session: null, isAdmin: false, isPremiumUser: false });
      },

      /* ── Auth: Check Admin Role ── */
      checkAdmin: async () => {
        const user = get().user;
        if (!user) {
          set({ isAdmin: false });
          return;
        }
        const stored = localStorage.getItem("qf_user");
        if (stored) {
          try {
            const d = JSON.parse(stored);
            if (d.isAdmin) { set({ isAdmin: true }); return; }
          } catch {}
        }
        set({ isAdmin: false });
      },

      /* ── Auth: Reset Password ── */
      resetPassword: async (email) => {
        return { error: null };
      },

      /* ── Auth: Initialize Listener ── */
      initializeAuth: () => {
        set({ isLoadingAuth: true });
        const stored = localStorage.getItem("qf_user");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            if (data.email) {
              set({
                user: { id: data.id || "offline", email: data.email, user_metadata: {} } as any,
                isAdmin: data.isAdmin || false,
                isLoadingAuth: false,
              });
              get().syncUserData();
              return;
            }
          } catch {}
        }
        set({ isLoadingAuth: false });
        return () => {};
      },
    }),
    {
      name: "quickfare-store",
      partialize: (state) => ({
        watchlist: state.watchlist,
        readingProgress: state.readingProgress,
        isPlaying: state.isPlaying,
        currentBook: state.currentBook,
        language: state.language,
        books: state.books,
      }),
    }
  )
);
