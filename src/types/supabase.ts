export type BookRow = {
  id: number
  title: string
  subtitle?: string
  category: string
  subcategory?: string
  cover: string
  rating: number
  pages: number
  language: string
  price: number
  is_premium: boolean
  is_new: boolean
  is_trending: boolean
  description?: string
  tags?: string[]
}

export type ProfileRow = {
  id: string
  full_name?: string
  phone?: string
  avatar_url?: string
  role: 'user' | 'admin'
  language_preference: 'en' | 'ur'
  created_at: string
  updated_at: string
}

export type WatchlistRow = {
  id: string
  user_id: string
  book_id: number
  created_at: string
}

export type ReadingProgressRow = {
  id: string
  user_id: string
  book_id: number
  progress: number
  current_page: number
  created_at: string
  updated_at: string
}

export type ReviewRow = {
  id: string
  user_id: string
  book_id: number
  rating: number
  comment?: string
  created_at: string
}
