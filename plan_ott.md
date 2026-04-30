# QuickFare OTT Platform — Master Plan

## Architecture Overview

### Frontend (Vite + React + TypeScript + Tailwind CSS)
- **Main Platform**: Cinematic OTT streaming interface
  - Hero carousel with auto-playing featured content
  - Category rows with horizontal scroll (Netflix-style but unique)
  - Book detail modal/player page
  - Search with real-time results
  - User auth (login/register)
  - Watchlist / Continue Watching
  - Responsive (mobile, tablet, desktop, TV)
  
- **Admin Portal**: Complete content management
  - Dashboard with stats
  - Upload books (title, description, category, thumbnail, PDF)
  - Category management
  - User management
  - Analytics

### Backend (Supabase)
- **Database**: PostgreSQL with tables
  - `books` — book content metadata
  - `categories` — content categories
  - `profiles` — user profiles
  - `watchlist` — user watchlists
  - `watch_history` — continue watching
  - `admin_users` — admin access control
  
- **Authentication**: Supabase Auth (email/password, magic link)
- **Storage**: Supabase Storage for thumbnails and PDFs
- **RLS**: Row Level Security for data protection
- **Edge Functions**: API endpoints for complex operations

### Design Philosophy (NOT a Netflix clone)
- **Color**: Deep midnight navy (#0a0a1a) + Rich gold (#d4af37) + Warm cream
- **Typography**: Bold cinematic headings with elegant subtitles
- **Animations**: Smooth scroll, parallax effects, hover zoom
- **Layout**: Unique hero treatment, asymmetric grids, floating category pills
- **Character-driven**: Your covers are the stars — they get cinematic treatment

## Execution Stages

### Stage 1: System Design & Scaffolding
- Design system tokens
- Project scaffolding (Vite + React + TypeScript + Tailwind)
- Supabase project setup guide
- Database schema design

### Stage 2: Database & Backend Setup
- Supabase schema SQL
- RLS policies
- Storage buckets
- Auth configuration
- Seed data for 400 books

### Stage 3: Frontend Core Platform
- Layout shell (header, footer, navigation)
- Hero carousel component
- Category row component with horizontal scroll
- Book card component with hover effects
- Book detail page/modal
- Search page
- Auth pages (login/register)
- User dashboard (watchlist, history)

### Stage 4: Admin Portal
- Admin layout with sidebar
- Dashboard with stats cards
- Book upload form with drag-drop
- Category management table
- User management table
- Analytics view

### Stage 5: Integration & Polish
- Connect frontend to Supabase
- Real data loading
- Image optimization
- Animation polish
- Responsive testing

### Stage 6: Deployment & Testing
- Build and deploy frontend
- Test all flows
- Fix any issues
- Provide admin setup instructions

## File Structure
```
quickfare-ott/
├── public/
│   └── thumbnails/        # 400 book covers
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Header, Footer, Sidebar
│   │   ├── hero/          # Hero carousel
│   │   ├── rows/          # Category rows
│   │   ├── cards/         # Book cards
│   │   └── modals/        # Detail modals
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Browse.tsx
│   │   ├── Search.tsx
│   │   ├── BookDetail.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   └── Admin/
│   │       ├── Dashboard.tsx
│   │       ├── Upload.tsx
│   │       ├── Books.tsx
│   │       ├── Categories.tsx
│   │       └── Users.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── types/
│   └── App.tsx
├── supabase/
│   ├── schema.sql
│   ├── policies.sql
│   └── seed.sql
└── package.json
```

## Deployment Target
- Frontend: Static deployment
- Backend: Supabase (user provides their own project URL + anon key)
