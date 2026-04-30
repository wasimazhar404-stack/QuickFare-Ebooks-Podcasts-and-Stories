import type { Book } from "@/data/books";

// Offline-only data layer — no Supabase client in browser
// (avoids "Forbidden secret API key" error from service_role keys)

export async function fetchAllBooks(): Promise<Book[]> {
  return [];
}

export async function fetchBookById(id: number): Promise<Book | null> {
  return null;
}

export async function fetchTrendingBooks(): Promise<Book[]> {
  return [];
}

export async function fetchNewBooks(): Promise<Book[]> {
  return [];
}

export async function searchBooks(query: string): Promise<Book[]> {
  return [];
}

export async function addToWatchlist(userId: string, bookId: number): Promise<void> {
  return;
}

export async function removeFromWatchlist(userId: string, bookId: number): Promise<void> {
  return;
}

export async function getWatchlist(userId: string): Promise<Book[]> {
  return [];
}

export async function updateProgress(userId: string, bookId: number, progress: number, currentPage: number): Promise<void> {
  return;
}

export async function getProgress(userId: string, bookId: number): Promise<{ progress: number; currentPage: number } | null> {
  return null;
}
