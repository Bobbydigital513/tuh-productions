/**
 * Deletes ALL products in the GHL location — run this to clean up orphaned products
 * before re-running create-ghl-products.mjs
 * Run: node scripts/cleanup-ghl-products.mjs
 */

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
  console.error("❌  Missing env vars. Set GHL_API_KEY and GHL_LOCATION_ID.");
  process.exit(1);
}

const BASE_URL = "https://services.leadconnectorhq.com";
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
};

async function main() {
  // Fetch all existing products
  const res = await fetch(
    `${BASE_URL}/products/?locationId=${LOCATION_ID}&limit=100`,
    { headers }
  );
  const data = await res.json();

  // Log raw response so we can also see the ID shape
  const items = data?.products ?? data?.data ?? data?.items ?? [];
  console.log(`Found ${items.length} products. First item shape:`, JSON.stringify(items[0] ?? {}));

  if (items.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  for (const item of items) {
    const id = item._id ?? item.id;
    const delRes = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers,
    });
    console.log(`  ${delRes.ok ? "✅" : "❌"}  Deleted "${item.name}" (${id}) — ${delRes.status}`);
  }

  console.log("\nDone. Re-run create-ghl-products.mjs now.");
}

main().catch(console.error);
