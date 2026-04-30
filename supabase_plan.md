# QuickFare Supabase Backend Integration Plan

## Supabase Credentials
- **Project ID**: vvopncwmrftnjnxqhwbi
- **URL**: https://vvopncwmrftnjnxqhwbi.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3BuY3dtcmZ0bmpueXFod2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjQzNzUsImV4cCI6MjA5MzE0MDM3NX0.eNy_J-88s_lKrshuE3aRanjW3pR4w3t8zu1-c9aIARo
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3BuY3dtcmZ0bmpueXFod2JpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2NDM3NSwiZXhwIjoyMDkzMTQwMzc1fQ.Nz7Y4iql2jhvvw8P_YRz8cZddlhnEejk4qc8ujXcEBY

## Phase 1: Database Schema (SQL)
1. **books** table — all 410 book records
2. **profiles** table — user profiles linked to auth.users
3. **watchlists** table — user watchlist entries
4. **reading_progress** table — per-user per-book progress
5. **reviews** table — user book reviews

## Phase 2: Supabase Client Setup
1. Install @supabase/supabase-js
2. Create lib/supabase.ts with client initialization
3. Create types for database tables

## Phase 3: Auth Integration
1. Replace localStorage auth with Supabase Auth
2. Email/password registration + login
3. Phone OTP login (for Pakistan)
4. Password reset flow
5. Admin role detection (role column in profiles)

## Phase 4: Book Data Migration
1. Upload 410 books JSON to Supabase books table via service role
2. Upload cover images to Supabase Storage
3. Update books.ts to fetch from Supabase (with local fallback)

## Phase 5: Watchlist + Progress API
1. Replace localStorage watchlist with Supabase
2. Replace localStorage progress with Supabase
3. Add to useAppStore (zustand persists to Supabase)

## Phase 6: Admin Panel (Full CRUD)
1. Admin-only routes
2. Add/Edit/Delete books
3. Upload new cover images to Storage
4. View user analytics

## Phase 7: Build & Deploy
1. Build with new supabase dependency
2. Copy covers to dist
3. Deploy
