# Purchased State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors mark wishlist items as bought, shared across everyone via Supabase, so nobody buys the same gift twice.

**Architecture:** A small framework-free client (`purchases.js`) talks to Supabase's REST API with `fetch`; it is unit-tested in Node with an injected `fetch`. `app.js` loads the taken set on boot and on tab focus, and the spotlight dialog gets a "Mark as bought" / "Undo" control. If config is missing or a request fails, the site behaves as it does today.

**Tech Stack:** Vanilla JS, static GitHub Pages, Supabase (PostgREST), `node --test` for the client tests (Node built-in, no dependencies).

**Spec:** `docs/superpowers/specs/2026-11-16-purchased-state-design.md`

## Global Constraints

- No build step; site stays static on GitHub Pages.
- No logins or names; anyone can mark bought and anyone can undo (after a confirm).
- Table `purchases(item_id text primary key, created_at timestamptz default now())`; RLS on; anon may select, insert, delete only.
- First claim wins; a duplicate claim is reported as "Someone already marked this as bought".
- Taken tiles: dimmed, "Taken" badge, still visible and clickable. "Buy at ..." link hidden for taken items. "Surprise me" skips taken items.
- Refetch on `visibilitychange` (tab regains focus). No realtime.
- No optimistic UI: button shows a pending state, reverts with a short message on network error.
- Missing `config.js` values or failed list request: no bought controls, site works as today.

## Review Focus

- Duplicate claim (HTTP 409) returns `{ ok: false, reason: "taken" }`, not an exception.
- `list()` network failure rejects, and the app keeps the previous taken set instead of clearing it.
- Empty `url`/`key` in config: `Purchases.enabled` is false and no UI appears.
- Item ids are URL-encoded in the delete filter.
- Every item taken: "Surprise me" is disabled rather than rolling a taken item.
- Undo on a row someone already removed still succeeds.

---

### Task 1: Supabase client

**Files:**
- Create: `purchases.js`
- Test: `tests/purchases.test.js`

**Interfaces:**
- Produces: `createPurchases({ url, key, fetch }) -> { enabled: boolean, list(): Promise<string[]>, claim(id): Promise<{ ok: true } | { ok: false, reason: "taken" }>, release(id): Promise<{ ok: true }> }`. Exported via `module.exports = { createPurchases }` under Node, and as `window.Purchases = createPurchases(window.SUPABASE_CONFIG)` in the browser (using global `fetch`). Non-2xx responses other than the 409 on `claim` throw an `Error` with the status.

- [ ] **Step 1: Write failing tests** in `tests/purchases.test.js` using `node:test` and a stub `fetch` that records calls. Tests, with these assertions:
  - `list returns item ids`: stub returns `[{item_id:"a"},{item_id:"b"}]`; result `["a","b"]`; request is `GET {url}/rest/v1/purchases?select=item_id` with headers `apikey` and `Authorization: Bearer {key}`.
  - `claim posts one row`: request is `POST {url}/rest/v1/purchases`, body `{"item_id":"luxo"}`, headers include `Content-Type: application/json` and `Prefer: return=minimal`; stub 201; result `{ ok: true }`.
  - `claim reports duplicate as taken`: stub 409; result `{ ok: false, reason: "taken" }`.
  - `claim throws on server error`: stub 500; rejects.
  - `release encodes the id`: `release("a&b")` sends `DELETE {url}/rest/v1/purchases?item_id=eq.a%26b`; stub 204; result `{ ok: true }`.
  - `list rejects on network failure`: stub `fetch` rejects; `list()` rejects.
  - `disabled without config`: `createPurchases({ url: "", key: "" , fetch})` has `enabled === false`.
- [ ] **Step 2: Run** `node --test tests/` — Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `purchases.js` to the interface above. Strip a trailing `/` from `url`.
- [ ] **Step 4: Run** `node --test tests/` — Expected: all PASS.
- [ ] **Step 5: Commit** `purchases.js` and `tests/purchases.test.js`.

---

### Task 2: Supabase setup files and README

**Files:**
- Create: `supabase/schema.sql`, `config.js`
- Modify: `README.md`

**Interfaces:**
- Produces: `config.js` defining `window.SUPABASE_CONFIG = { url: "", key: "" }` (empty placeholders; Ryan fills them). Loaded before `purchases.js`.

- [ ] **Step 1: Write `supabase/schema.sql`:** create the `purchases` table per Global Constraints, enable RLS, and create three policies for role `anon` (select using true, insert with check true, delete using true).
- [ ] **Step 2: Write `config.js`** with the empty placeholders and a one-line comment that the anon key is public by design.
- [ ] **Step 3: Add a "Shared purchases (Supabase)" section to `README.md`:** create project, run `supabase/schema.sql` in the SQL editor, copy Project URL and anon public key from Settings → API into `config.js`, push. One short numbered list.
- [ ] **Step 4: Verify** the SQL reads correctly top to bottom (no code to run); confirm `config.js` parses with `node -e 'global.window={};require("./config.js")'`.
- [ ] **Step 5: Commit** these files.

---

### Task 3: UI integration

**Files:**
- Modify: `index.html` (script tags before `app.js`: `config.js`, `purchases.js`; add `<button class="btn btn-line" id="spotBought">` in `.spot-actions` and a `<p id="spotTaken" hidden>` line above it), `app.js`, `styles.css`

**Interfaces:**
- Consumes: `window.Purchases` from Task 1 (`enabled`, `list`, `claim`, `release`).
- Produces: `state.taken: Set<string>`; `refreshTaken(): Promise<void>`; `applyTaken()` which toggles a `taken` class on each tile, updates the spotlight, and sets `$("surprise").disabled` when no eligible item remains.

- [ ] **Step 1: `eligible()` excludes taken ids** (it feeds Surprise me); `applyFilters()` also disables `#surprise` when `eligible()` is empty. `step()` navigation is unchanged (taken items remain browsable).
- [ ] **Step 2: Implement `refreshTaken()`** in `app.js`: if `!Purchases.enabled` return; on `list()` success replace `state.taken` and call `applyTaken()`; on rejection leave `state.taken` unchanged. Call once at boot and from a `visibilitychange` listener when `document.visibilityState === "visible"`.
- [ ] **Step 3: `render(w)`** shows for a taken item: hide `#spotBuy`, show `#spotTaken` ("Marked as bought") and set `#spotBought` to "Undo"; for an available item: show Buy, hide the taken line, set the button to "Mark as bought". Hide `#spotBought` entirely when `!Purchases.enabled`.
- [ ] **Step 4: Click handler on `#spotBought`:** disable the button and set "Saving..." while pending. Available item: `claim(id)`; on `ok` or `reason: "taken"` add to `state.taken` (on "taken" also show "Someone already marked this as bought" in `#spotTaken`); on throw, restore the button and show "Couldn't save, try again" in `#spotTaken`. Taken item: `confirm("Undo this purchase mark?")`, then `release(id)`; on success delete from `state.taken`; on throw, show the same error line. Always finish with `applyTaken()` and `render(current)`.
- [ ] **Step 5: Styles:** `.tile.taken` reduces opacity of the art and meta (keep contrast of the title readable), plus a small "Taken" badge in the tile's top-left using existing colour tokens and radius; follows the existing visual language. Respect `prefers-reduced-motion` (no new animation needed).
- [ ] **Step 6: Verify with a local fake backend.** Run `python3 -m http.server` in the repo, and in the browser console set a fake config before load or temporarily point `config.js` at a real Supabase project if Ryan has finished Task 2 setup. Check: marking an item shows the badge and hides its Buy link; reload keeps it; a second browser profile sees it taken; Undo clears it; with `config.js` empty no bought button appears; taking every item disables Surprise me. Report each check's result.
- [ ] **Step 7: Run** `node --test tests/` — Expected: PASS. **Commit** `index.html app.js styles.css`.

---

## Self-review notes

- Spec coverage: shared persistence, first-claim-wins, undo, dimmed "Taken" tiles, hidden Buy link, Surprise me skip, refocus refetch, graceful degradation, SQL and README setup are each covered by Task 1, 2 or 3.
- Names are consistent across tasks: `createPurchases`, `Purchases.enabled/list/claim/release`, `state.taken`, `refreshTaken`, `applyTaken`, `#spotBought`, `#spotTaken`.
- Real-Supabase verification in Task 3 needs Ryan's project URL and anon key.
