(() => {
  const WISHES = window.WISHES;
  const $ = (id) => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // One tint per category; the filter chips carry the same colours as a legend.
  const TONES = { LEGO: "#d4b069", Tech: "#b8c6cf", Clothing: "#c0c8b0", Coffee: "#c7a68a", Car: "#b3b0c9", Accessories: "#dbb7b1" };

  // Transparent cut-outs keep their true colours; only white-background photos are blended into the tile tint.
  const CUTOUT = new Set(["01", "02", "03", "04", "05", "06", "14", "23", "25", "26", "27"]);
  const fmt = (n) => "€" + n.toLocaleString("en-IE", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const img = (w) => (w.img ? `assets/img/${w.img}.webp` : "");

  /* ---------- state ---------- */
  const state = { cat: "All", budget: 250, sort: "curated", picks: new Set() };
  const max = Math.ceil(Math.max(...WISHES.map((w) => w.price)) / 5) * 5;
  try { JSON.parse(localStorage.getItem("rv-picks") || "[]").forEach((id) => WISHES.some((w) => w.id === id) && state.picks.add(id)); } catch (e) {}
  const savePicks = () => { try { localStorage.setItem("rv-picks", JSON.stringify([...state.picks])); } catch (e) {} };

  /* ---------- hero: copy, countdown, parallax ---------- */
  $("heroSub").textContent = `${WISHES.length} things I'd love to unwrap. Set a budget, pick a favourite, or let it choose for you.`;

  function countdown() {
    const now = new Date();
    let xmas = new Date(now.getFullYear(), 11, 25);
    const dayMs = 864e5;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let days = Math.round((xmas - startOfToday) / dayMs);
    if (days < -1) { xmas = new Date(now.getFullYear() + 1, 11, 25); days = Math.round((xmas - startOfToday) / dayMs); }
    if (days === 0) { $("countNum").textContent = "Today"; $("countLabel").textContent = "Merry Christmas"; return; }
    if (days < 0) { $("countNum").textContent = "Hope"; $("countLabel").textContent = "it was a good one"; return; }
    $("countNum").textContent = days;
    $("countLabel").textContent = days === 1 ? "sleep until Christmas" : "sleeps until Christmas";
  }
  countdown();

  if (!reduced && matchMedia("(hover: hover)").matches) {
    const stage = $("stage");
    let raf = 0, nx = 0, ny = 0;
    addEventListener("pointermove", (e) => {
      nx = (e.clientX / innerWidth - .5) * 2;
      ny = (e.clientY / innerHeight - .5) * 2;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; stage.style.setProperty("--mx", nx.toFixed(3)); stage.style.setProperty("--my", ny.toFixed(3)); });
    }, { passive: true });
  }

  /* ---------- chips ---------- */
  const cats = ["All", ...[...new Set(WISHES.map((w) => w.cat))]];
  const chips = $("chips");
  cats.forEach((c) => {
    const n = c === "All" ? WISHES.length : WISHES.filter((w) => w.cat === c).length;
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.cat = c;
    b.setAttribute("aria-pressed", c === "All");
    if (TONES[c]) b.style.setProperty("--dot", TONES[c]);
    b.innerHTML = `${c}<small>${n}</small>`;
    chips.appendChild(b);
  });
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.cat = b.dataset.cat;
    chips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
    applyFilters();
  });

  /* ---------- budget ---------- */
  const budget = $("budget");
  budget.max = max; budget.value = max; state.budget = max;
  $("budgetOut").textContent = fmt(max);
  budget.addEventListener("input", () => {
    state.budget = +budget.value;
    $("budgetOut").textContent = state.budget >= max ? fmt(max) + "+" : fmt(state.budget);
    applyFilters();
  });

  /* ---------- sort ---------- */
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; applySort(); applyFilters(); });
  function sorted() {
    if (state.sort === "curated") return WISHES;
    const dir = state.sort === "asc" ? 1 : -1;
    return [...WISHES].sort((a, b) => (a.price - b.price) * dir || WISHES.indexOf(a) - WISHES.indexOf(b));
  }
  function applySort() { sorted().forEach((w) => grid.appendChild(tiles.get(w.id))); }

  /* ---------- grid ---------- */
  const grid = $("grid");
  const plus = '<svg class="i-plus" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>';
  const check = '<svg class="i-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  WISHES.forEach((w, i) => {
    const el = document.createElement("article");
    el.className = `tile ${w.size}${w.right ? " right" : ""}${w.fit === "cover" ? " cover" : ""}${CUTOUT.has(w.img) ? " cut" : ""}`;
    el.dataset.id = w.id;
    el.style.setProperty("--tone", TONES[w.cat]);
    const art = w.img
      ? `<img src="${img(w)}" alt="" loading="${i < 8 ? "eager" : "lazy"}" decoding="async">`
      : `<span class="tile-mark">${esc(w.mark || w.title)}</span>`;
    el.innerHTML = `
      <button class="tile-main" type="button" aria-label="${esc(w.title)}, ${fmt(w.price)}. View details">
        <div class="tile-art">${art}</div>
        <div class="tile-meta">
          <div><h3 class="tile-title">${esc(w.title)}</h3><p class="tile-store">${esc(w.store)}</p></div>
          <span class="tile-price">${fmt(w.price)}</span>
        </div>
      </button>
      <button class="pick" type="button" aria-pressed="${state.picks.has(w.id)}" aria-label="Add ${esc(w.title)} to my picks">${plus}${check}</button>`;
    grid.appendChild(el);
  });
  const tiles = new Map([...grid.children].map((t) => [t.dataset.id, t]));

  grid.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile"); if (!tile) return;
    const id = tile.dataset.id;
    if (e.target.closest(".pick")) { togglePick(id); return; }
    if (e.target.closest(".tile-main")) openSpot(id);
  });

  const eligible = () => WISHES.filter((w) => (state.cat === "All" || w.cat === state.cat) && w.price <= state.budget);

  function applyFilters() {
    // the curated mosaic only holds together unfiltered and unsorted; otherwise use an even grid
    grid.classList.toggle("is-filtered", state.cat !== "All" || state.sort !== "curated");
    let shown = 0;
    WISHES.forEach((w) => {
      const t = tiles.get(w.id);
      const inCat = state.cat === "All" || w.cat === state.cat;
      const inBudget = w.price <= state.budget;
      t.classList.toggle("hide", !inCat);
      t.classList.toggle("over", inCat && !inBudget);
      if (inCat && inBudget) shown++;
    });
    const inCatCount = WISHES.filter((w) => state.cat === "All" || w.cat === state.cat).length;
    const atMax = state.budget >= max;
    $("status").textContent = atMax
      ? `Showing ${inCatCount} ${inCatCount === 1 ? "wish" : "wishes"}`
      : `${shown} of ${inCatCount} within ${fmt(state.budget)}`;
    $("empty").hidden = shown > 0;
    $("surprise").disabled = shown === 0;
  }

  /* ---------- picks ---------- */
  function togglePick(id) {
    state.picks.has(id) ? state.picks.delete(id) : state.picks.add(id);
    savePicks(); syncPicks();
  }
  function syncPicks() {
    WISHES.forEach((w) => {
      const on = state.picks.has(w.id);
      const b = tiles.get(w.id).querySelector(".pick");
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", `${on ? "Remove" : "Add"} ${w.title} ${on ? "from" : "to"} my picks`);
    });
    const list = WISHES.filter((w) => state.picks.has(w.id));
    const total = list.reduce((s, w) => s + w.price, 0);
    $("tray").hidden = list.length === 0;
    $("trayCount").textContent = list.length;
    $("trayWord").textContent = list.length === 1 ? "pick" : "picks";
    $("trayTotal").textContent = fmt(Math.round(total * 100) / 100) + " in total";
    if (current) {
      const on = state.picks.has(current.id);
      $("spotPick").setAttribute("aria-pressed", on);
      $("spotPick").textContent = on ? "In my picks" : "Add to my picks";
    }
  }
  $("trayClear").addEventListener("click", () => { state.picks.clear(); savePicks(); syncPicks(); });
  $("trayCopy").addEventListener("click", async () => {
    const list = WISHES.filter((w) => state.picks.has(w.id));
    const total = list.reduce((s, w) => s + w.price, 0);
    const text = `Ryan's Christmas wishlist, my picks:\n\n` + list.map((w) => `${w.title} (${fmt(w.price)})\n${w.url}`).join("\n\n") + `\n\nTotal: ${fmt(Math.round(total * 100) / 100)}`;
    const btn = $("trayCopy");
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
    catch (e) { btn.textContent = "Copy failed"; }
    setTimeout(() => (btn.textContent = "Copy list"), 1600);
  });

  /* ---------- spotlight ---------- */
  const spot = $("spot");
  let current = null, rollTimer = 0, surpriseMode = false;

  function render(w, settle) {
    current = w;
    const art = $("spotArt");
    art.style.setProperty("--tone", TONES[w.cat]);
    art.classList.toggle("noimg", !w.img);
    art.classList.toggle("cover", w.fit === "cover");
    art.classList.toggle("cut", CUTOUT.has(w.img));
    $("spotImg").src = w.img ? img(w) : "";
    $("spotMark").textContent = w.mark || w.title;
    $("spotCat").textContent = w.cat;
    $("spotTitle").textContent = w.title;
    $("spotNote").textContent = w.note;
    $("spotPrice").textContent = fmt(w.price);
    const buy = $("spotBuy");
    buy.href = w.url; buy.textContent = `Buy at ${w.store}`;
    const on = state.picks.has(w.id);
    $("spotPick").setAttribute("aria-pressed", on);
    $("spotPick").textContent = on ? "In my picks" : "Add to my picks";
    if (settle) { art.classList.remove("settle"); void art.offsetWidth; art.classList.add("settle"); }
  }

  function openSpot(id) {
    surpriseMode = false;
    $("spotRoll").hidden = true;
    $("spotPrev").hidden = $("spotNext").hidden = false;
    render(WISHES.find((w) => w.id === id), false);
    if (!spot.open) spot.showModal();
  }

  function step(dir) {
    const list = sorted().filter((w) => !tiles.get(w.id).classList.contains("hide"));
    const i = list.findIndex((w) => w.id === current.id);
    render(list[(i + dir + list.length) % list.length], true);
  }
  $("spotPrev").addEventListener("click", () => step(-1));
  $("spotNext").addEventListener("click", () => step(1));
  $("spotPick").addEventListener("click", () => togglePick(current.id));
  $("spotClose").addEventListener("click", () => spot.close());
  spot.addEventListener("click", (e) => { if (e.target === spot) spot.close(); });
  spot.addEventListener("close", () => { clearTimeout(rollTimer); });
  spot.addEventListener("keydown", (e) => {
    if (surpriseMode) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  function roll() {
    const pool = eligible();
    if (!pool.length) return;
    clearTimeout(rollTimer);
    surpriseMode = true;
    $("spotRoll").hidden = true;
    $("spotPrev").hidden = $("spotNext").hidden = true;
    const winner = pool[Math.floor(Math.random() * pool.length)];
    if (!spot.open) spot.showModal();
    if (reduced || pool.length === 1) { render(winner, false); $("spotRoll").hidden = pool.length < 2; return; }

    // shuffle through the pool, slowing down, and land on the winner
    const order = [];
    let last = null;
    for (let i = 0; i < 22; i++) {
      let pick;
      do { pick = pool[Math.floor(Math.random() * pool.length)]; } while (pick === last && pool.length > 1);
      order.push(pick); last = pick;
    }
    if (last === winner && pool.length > 1) order.pop();
    order.push(winner);
    let i = 0;
    const tick = () => {
      const w = order[i];
      const final = i === order.length - 1;
      render(w, final);
      if (final) { $("spotRoll").hidden = false; $("spotBuy").focus({ preventScroll: true }); return; }
      i++;
      rollTimer = setTimeout(tick, 55 + Math.pow(i / order.length, 3) * 420);
    };
    tick();
  }
  $("surprise").addEventListener("click", roll);
  $("spotRoll").addEventListener("click", roll);

  /* ---------- footer + boot ---------- */
  const total = WISHES.reduce((s, w) => s + w.price, 0);
  $("footSmall").textContent = `The whole list comes to ${fmt(Math.round(total))}, so please don't. One thing from it is plenty. Prices are what I saw when I made the list, and sizes and colours are in the notes.`;
  applyFilters();
  syncPicks();
})();
