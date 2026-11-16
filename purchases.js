// Tiny Supabase (PostgREST) client for the shared "bought" list. One row per taken item.
(function (root) {
  function createPurchases({ url, key, fetch }) {
    const base = (url || "").replace(/\/+$/, "") + "/rest/v1/purchases";
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const check = (res) => { if (!res.ok) throw new Error(`Supabase request failed (${res.status})`); };
    return {
      enabled: Boolean(url && key),
      async list() {
        const res = await fetch(`${base}?select=item_id`, { headers });
        check(res);
        return (await res.json()).map((r) => r.item_id);
      },
      async claim(id) {
        const res = await fetch(base, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ item_id: id }),
        });
        if (res.status === 409) return { ok: false, reason: "taken" };
        check(res);
        return { ok: true };
      },
      async release(id) {
        const res = await fetch(`${base}?item_id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers });
        check(res);
        return { ok: true };
      },
    };
  }
  if (typeof module !== "undefined") module.exports = { createPurchases };
  else root.Purchases = createPurchases({ ...root.SUPABASE_CONFIG, fetch: root.fetch.bind(root) });
})(typeof window !== "undefined" ? window : globalThis);
