# Submission Write-up

## My choices

I built this with the Next.js App Router and kept the styling minimal (plain Tailwind utility classes, no custom design system) so I could focus my limited time on getting every functional requirement — auth, pagination, debounced search, filter/sort, CRUD, URL state — actually working correctly rather than looking polished.

For state, I kept everything in React's built-in `useState`/`useEffect` rather than a library, as required, and used the URL (via `useSearchParams`) as the single source of truth for page/search/filter/sort, so refreshing or sharing a link always shows the same view.

For the category-vs-search API limitation, I made category filtering take priority over search — if you pick a category, any active search term is ignored, since filtering felt like the more deliberate action of the two.

## One problem I faced

Early on, my dev server kept failing with confusing errors ("Module not found," "package.json only 51 bytes") because I had accidentally nested my project folder inside itself while running `create-next-app` — so my terminal was sitting in an empty parent folder instead of the real project. I fixed it by carefully checking the folder structure in VS Code's file explorer and navigating (`cd`) into the correct nested folder before running commands. It taught me to always double check my current directory before running install/build commands.

## Where AI helped

I have experience with plain React but had never used Next.js or Axios before this assignment. I used Claude throughout to:
- Learn Next.js fundamentals (App Router, file-based routing, dynamic routes, `useRouter`/`useSearchParams`) and Axios basics from scratch
- Debug environment/setup issues (nested folders, missing installs, build-only errors)
- Get plain-language explanations of unfamiliar concepts as I went — Tailwind CSS utility classes, debouncing, race conditions, React hooks patterns — so I understood *why* each piece of code worked, not just that it worked
- Review error messages and terminal output to figure out what had actually gone wrong

I wrote/reviewed every line that went into the final code and made sure I could explain its purpose, since I know I'll need to walk through and modify it live in the next round.
