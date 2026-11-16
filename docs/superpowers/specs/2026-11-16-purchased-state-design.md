# Purchased state: design

## Intent
Ryan shares the wishlist with family and friends. When someone buys an item they mark it as bought, and everyone else sees it as taken, so nobody buys the same gift twice.

## Goals
- Any visitor can mark an item bought; every other visitor sees it as taken on their next load.
- State is shared and persistent (not per-browser).
- Two people claiming the same item at once: first claim wins, the second is told it's already taken.
- Zero ongoing maintenance. Ryan sets it up once and doesn't look at it again.

## Non-goals / anti-goals
- No logins, names, or accounts. Trust-based, family-scale.
- No hiding from Ryan (he chose visible; spoilers are fine).
- No build step. The site stays static on GitHub Pages.
- Not hardened against a determined tamperer (the key is public in the page; stakes are a gift list).

## Constraints
- Static hosting, vanilla JS, existing `data.js` / `app.js` structure.
- Item identity is the existing `id` in `data.js`.

## Approaches considered
- **A. Supabase table, called from the browser (chosen).** Atomic first-claim-wins via primary key, fast, no server code. Needs a free account, a project URL and anon key in the page.
- B. Cloudflare Worker + KV. Key not exposed, but most setup and no atomic claim.
- C. Google Sheet + Apps Script. No new account and hand-editable, but slow and fiddly cross-origin.

## Design
**Data:** one table `purchases(item_id text primary key, created_at timestamptz default now())`. Row-level security on, with anon policies allowing select, insert and delete only. Primary key makes a duplicate claim fail.

**Config:** `config.js` holds the Supabase URL and anon key (public by design). If it is missing or the request fails, the site behaves exactly as today with no bought buttons.

**Reads:** on load, fetch all `item_id`s once and mark tiles. Refetch when the tab regains focus. No realtime.

**Writes:** the spotlight dialog gets a "Mark as bought" button next to "Add to my picks". Insert on click; on success mark taken; on conflict say "Someone already marked this as bought" and mark taken. A taken item shows "Bought" with an "Undo" link (anyone can undo, since mistakes happen), which deletes the row after a confirm.

**Appearance:** taken tiles are dimmed with a "Taken" badge, stay visible and clickable. The "Buy at..." link is hidden for taken items. "Surprise me" skips taken items. Budget and category filters are unchanged; the status line is unchanged.

**Failure handling:** optimistic UI is not used; the button shows a brief pending state and reverts with a short message on network error.

## Left to the builder
- Exact badge styling and copy, within the existing visual language.
- Whether to refetch on `visibilitychange` or a slow interval.
- SQL file location (`supabase/schema.sql` proposed) and README setup steps for Ryan.

## My calls (not yet agreed with Ryan)
- No names or login; anyone can undo; taken items stay visible but dimmed; Surprise me skips them; refetch on focus, no realtime.
