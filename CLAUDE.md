# xBotGo Prime Express Delivery Tracker — CLAUDE.md

## What This Is
A Next.js app that tracks Amazon Prime Express Delivery availability for 2 xBotGo Chameleon ASINs across 10 US ZIP codes. Hosted publicly on Vercel. Data is collected via a bookmarklet that runs on amazon.com. Cloned from the BallerCam Prime Shipping Report project.

## URLs
- Public report: https://xbotgo-prime-tracker.vercel.app
- Runner page: https://xbotgo-prime-tracker.vercel.app/run
- GitHub: https://github.com/marc526/xbotgo-prime-tracker

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Deployed on Vercel (auto-deploys on every push to main)
- Storage: GitHub API commits `public/report-data.json` directly to the repo, which triggers Vercel redeploy

## ASINs Tracked
- `B0D7HQFKPB` — Chameleon, Lava Graphite
- `B0DG2DYQD8` — Chameleon, Lemon Green

## Key Files
- `lib/constants.ts` — ASINS (2 SKUs) and LOCATIONS (10 ZIP codes with SVG map x/y coords)
- `app/page.tsx` — Public report page, fetches /report-data.json at runtime
- `app/run/page.tsx` — Runner page: bookmarklet installer + auto-save flow from URL hash
- `app/api/save-results/route.ts` — Verifies SAVE_SECRET header, commits report-data.json via GitHub API
- `components/SummaryCards.tsx` — 4 stat cards
- `components/USMap.tsx` — SVG map with colored circles (red/orange/green by SKU count)
- `components/PrimeGrid.tsx` — Grid table (rows=SKUs, cols=ZIP codes, cells=✅/❌)
- `public/report-data.json` — Static file updated via GitHub API
- `public/xbotgo-logo.png` — Logo with green background

## Environment Variables (Vercel production)
- `SAVE_SECRET` — must match the secret stored in the user's browser localStorage
- `GITHUB_TOKEN` — fine-grained PAT with Contents read/write on this repo only

**Important:** Add env vars with `--value` flag, NOT heredoc — heredoc adds a trailing newline that causes secret mismatch.
```
npx vercel env add SAVE_SECRET production --value your-secret --yes
```

## localStorage Key
The browser save secret is stored under key: `xbotgo-overnight-secret`

## Workflow
1. Go to amazon.com (logged in as Prime member)
2. Click the "xBotGo Express" bookmarklet
3. Sidebar panel runs, checks 2 ASINs × 10 ZIP codes
4. Click "→ Save Report" in the sidebar when done
5. Redirects to /run, auto-saves using secret from localStorage
6. Vercel deploys in ~1 min — public report updates

## Bookmarklet Gotchas
- **Must install manually**: copy code → right-click bookmarks bar → Add page → paste as URL
- **Chrome drag is broken**: Chrome sanitizes `javascript:` hrefs on drag
- **Single line only**: Chrome's bookmark URL field truncates on newlines
- **No React href**: use `useRef` + `setAttribute` to set the href after mount

## Detection Logic — NEEDS REVIEW
```js
h.toLowerCase().includes('7am')
```
**Known issue**: This is a broad string match. "7am" appears on Amazon product pages in multiple contexts:
- As a delivery arrival time ("Delivered by 7am")
- As an order cutoff time ("Order by 7am to get it today")

This likely captures same-day and other express delivery options, not just overnight-by-7am. The report was renamed from "Prime Overnight 7AM Tracker" to "Prime Express Delivery Tracker" to better reflect actual behavior. Detection string should be reviewed and tightened — inspect raw Amazon product page HTML to find the right string(s) to key off of.

## Map Colors (USMap.tsx)
- 0 SKUs → red (`#ef4444`)
- 1 SKU → orange (`#f97316`)
- 2 SKUs (both) → green (`#22c55e`)

## Branding
- Accent color: `#7dc800` (lime green)
- "Express" in the page title is styled italic electric blue (`#3b82f6`)

## git push pattern
Remote gets updated by the save flow (report-data.json commits). Always pull --rebase before pushing:
```
git pull --rebase && git push
```
