# Fix Plan — Netflix-Style Clean UI

## Issues to Fix

### 1. BookCard: Text Overlay on Covers → Move Below (Netflix Style)
- Remove gradient overlay + title/subtitle/rating/price from ON the cover image
- Display clean cover image ONLY
- Show title, subtitle, rating, price BELOW the cover image in a separate text area
- Keep badges (Category, Premium, NEW) as subtle corner overlays only
- Keep hover overlay for desktop

### 2. Browse Page: Filter Bar Hidden
- Add proper z-index to filter bar container
- Add margin-bottom so grid doesn't overlap
- Ensure dropdowns are visible above grid

### 3. Home Page: Show ONLY Uploaded 54 Covers
- Replace featuredBooks with uploaded books only
- Replace trendingBooks with uploaded books
- Replace newBooks with uploaded books
- Show only the premium uploaded covers

### 4. Browse: Prioritize Uploaded Covers
- Sort: uploaded covers first, then others
- Uploaded covers get "isNew=true, isTrending=true" priority

### 5. Covers: Clean (No Extra Text Overlay)
- Re-copy uploaded covers WITHOUT any PIL text overlay
- Use original uploaded images directly
- Only add subtle corner QuickFare watermark if needed
- Covers should be clean artwork (title is shown in UI below)

## Execution Order
1. Fix BookCard.tsx — Netflix-style text-below layout
2. Fix Browse.tsx — filter bar z-index + uploaded-first sorting
3. Fix Home.tsx — only uploaded covers
4. Re-copy clean uploaded covers (no text overlay)
5. Build & Deploy
