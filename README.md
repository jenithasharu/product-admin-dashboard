# Product Admin Dashboard

A small admin dashboard built with Next.js, React, Tailwind CSS, and Axios, using the free [DummyJSON](https://dummyjson.com) API. Users log in, browse products with pagination/search/filter/sort, view product details, and add/edit/delete products.

**Live demo:** [https://product-admin-dashboard-theta-navy.vercel.app]

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Axios

## Setup

1. Clone the repo:
   ```
   git clone <your-repo-url>
   cd admin-dashboard
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open `http://localhost:3000` — it redirects to `/login`.

**Test login:** username `emilys`, password `emilyspass`

## What's Finished

- [x] Login page with real DummyJSON auth, error handling, protected routes, logout
- [x] Product list — table layout, showing image/title/category/price/rating/stock
- [x] Pagination — page numbers, Previous/Next, page size selector (10/20/50), "Showing X–Y of Z" text
- [x] Search — debounced (waits for typing to stop), resets to page 1, ignores stale/slow responses (race-condition safe)
- [x] Filter by category and sort by price/rating/title
- [x] Product detail page (`/products/[id]`) with images, description, price, reviews, and a "not found" fallback for bad IDs
- [x] Add product form with validation
- [x] Edit product form (pre-filled, same validation)
- [x] Delete with confirmation popup
- [x] Loading, empty, and error states with clear messaging
- [x] All state (page, search, filter, sort) synced to the URL, so refreshing or sharing a link preserves the view
- [x] One shared Axios instance (`lib/axios.js`) that attaches the auth token to every request and handles errors centrally
- [x] Invalid URL params (`?page=abc`, `?page=999`) don't break the page — they fall back to safe defaults
- [x] Login and Save buttons are disabled while a request is in flight, preventing duplicate submissions

## Not Finished / Known Limitations

- No responsive card view for mobile yet — currently table-only
- Basic Tailwind styling, no custom theme

## Notes on My Approach

**Why the app doesn't feel "styled":** I focused on getting every functional requirement working correctly first, since that's what's explicitly graded, and treated visual polish as a stretch goal given the time constraint.

**Category + search limitation:** DummyJSON's API can't filter by category and search by keyword at the same time. My app prioritizes category filtering — if a category is selected, it ignores any active search term. I chose this because filtering feels like a more deliberate, primary action than search.

**Add/Edit/Delete persistence:** DummyJSON is a mock API — it returns success responses for POST/PUT/DELETE but doesn't actually persist changes server-side (a refresh reverts everything). My app calls the real endpoints (so the request/response cycle is genuine), and removes deleted items from local UI state immediately after a successful response, to demonstrate the intended user experience even though the backend itself is not stateful.

**One problem I faced:** [Fill this in with your own words — see write-up draft below for a starting point.]

**Where AI helped:** I used Claude to learn Next.js and Axios from scratch (I'd only worked with plain React before), to debug setup/environment issues (nested folder structure, missing dependencies, build errors), and to get explanations for unfamiliar concepts (Tailwind CSS, React hooks patterns, debouncing, race conditions) as I built each feature. I made sure to understand the logic of each piece as it was written, since I'll be walking through and modifying the code live in the next round.
