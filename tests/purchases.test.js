const test = require("node:test");
const assert = require("node:assert");
const { createPurchases } = require("../purchases.js");

const URL = "https://proj.supabase.co";
const KEY = "sb_publishable_test";

function stub(status, body) {
  const calls = [];
  const fetch = async (url, opts = {}) => {
    calls.push({ url, ...opts });
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  return { fetch, calls };
}

test("list returns item ids", async () => {
  const { fetch, calls } = stub(200, [{ item_id: "a" }, { item_id: "b" }]);
  const p = createPurchases({ url: URL, key: KEY, fetch });
  assert.deepStrictEqual(await p.list(), ["a", "b"]);
  assert.strictEqual(calls[0].url, `${URL}/rest/v1/purchases?select=item_id`);
  assert.strictEqual(calls[0].headers.apikey, KEY);
  assert.strictEqual(calls[0].headers.Authorization, `Bearer ${KEY}`);
});

test("claim posts one row", async () => {
  const { fetch, calls } = stub(201);
  const p = createPurchases({ url: URL, key: KEY, fetch });
  assert.deepStrictEqual(await p.claim("luxo"), { ok: true });
  assert.strictEqual(calls[0].method, "POST");
  assert.strictEqual(calls[0].url, `${URL}/rest/v1/purchases`);
  assert.strictEqual(calls[0].body, JSON.stringify({ item_id: "luxo" }));
  assert.strictEqual(calls[0].headers["Content-Type"], "application/json");
  assert.strictEqual(calls[0].headers.Prefer, "return=minimal");
});

test("claim reports duplicate as taken", async () => {
  const p = createPurchases({ url: URL, key: KEY, fetch: stub(409).fetch });
  assert.deepStrictEqual(await p.claim("luxo"), { ok: false, reason: "taken" });
});

test("claim throws on server error", async () => {
  const p = createPurchases({ url: URL, key: KEY, fetch: stub(500).fetch });
  await assert.rejects(p.claim("luxo"), /500/);
});

test("release encodes the id", async () => {
  const { fetch, calls } = stub(204);
  const p = createPurchases({ url: URL, key: KEY, fetch });
  assert.deepStrictEqual(await p.release("a&b"), { ok: true });
  assert.strictEqual(calls[0].method, "DELETE");
  assert.strictEqual(calls[0].url, `${URL}/rest/v1/purchases?item_id=eq.a%26b`);
});

test("list rejects on network failure", async () => {
  const fetch = async () => { throw new TypeError("network"); };
  const p = createPurchases({ url: URL, key: KEY, fetch });
  await assert.rejects(p.list(), /network/);
});

test("disabled without config", () => {
  const p = createPurchases({ url: "", key: "", fetch: stub(200).fetch });
  assert.strictEqual(p.enabled, false);
});

test("trailing slash on url is ignored", async () => {
  const { fetch, calls } = stub(200, []);
  await createPurchases({ url: URL + "/", key: KEY, fetch }).list();
  assert.strictEqual(calls[0].url, `${URL}/rest/v1/purchases?select=item_id`);
});
