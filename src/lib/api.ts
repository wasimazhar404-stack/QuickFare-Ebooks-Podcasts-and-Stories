// Simple fetch-based data client — no Supabase JS library (avoids "Forbidden secret key" error)
const SUPABASE_URL = 'https://vvopncwmrftnjnxqhwbi.supabase.co'
const SUPABASE_KEY = 'sb_secret_eR04YLzCZnyfJBcYNA5Tlw_0nOAMYCd'

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

export async function fetchBooks() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?select=*`, { headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function fetchBookById(id: number) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${id}&select=*`, { headers })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data[0] || null
}

export async function fetchTrendingBooks() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?is_trending=eq.true&select=*`, { headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function fetchNewBooks() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?is_new=eq.true&select=*`, { headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function searchBooks(query: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/books?or=(title.ilike.*${query}*,subtitle.ilike.*${query}*)&select=*`,
    { headers }
  )
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
