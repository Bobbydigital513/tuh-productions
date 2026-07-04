/**
 * TUH Productions — GoHighLevel Product Creator
 * Run: node scripts/create-ghl-products.mjs
 */

// Set these as env vars before running:
// export GHL_API_KEY="pit-xxxx"
// export GHL_LOCATION_ID="xxxx"
const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
  console.error("❌  Missing env vars. Set GHL_API_KEY and GHL_LOCATION_ID before running.");
  process.exit(1);
}
const BASE_URL = "https://services.leadconnectorhq.com";
const LOGO_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3F8bBVZIiZA8w6i5ZF5b1RBHda1/9ca2d591-258a-4d89-94ea-6986be99fce0.png";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
};

// Listed price = 50% off. Original = listed × 2.
const products = [
  // ─── Mid Ticket Services ───────────────────────────────────────────────────
  {
    collection: "Mid Ticket Services",
    name: "Custom Beat — Unlimited Use License",
    description:
      "Get a one-of-a-kind beat crafted specifically for your project. Your Unlimited Use license gives you the right to release on all platforms under your name — perfect for singles, streaming, and building your catalog. Includes up to 2 revision rounds so we dial in the vibe exactly how you hear it.",
    price: 150,
  },
  {
    collection: "Mid Ticket Services",
    name: "Custom Beat — Exclusive License",
    description:
      "This beat is yours and yours alone. An Exclusive license means once delivered, it's pulled from our catalog and no other artist can use it. Ideal for major releases, sync placements, or building a signature sound. Includes up to 3 revision rounds to make it perfect.",
    price: 400,
  },
  {
    collection: "Mid Ticket Services",
    name: "Mixing & Mastering — Single Track",
    description:
      "A full-service mix AND master on your finished track. We balance every element, add depth and clarity in the mix, then master it so it hits hard and translates on every speaker — headphones, car, club. Includes up to 3 revision rounds.",
    price: 250,
  },
  {
    collection: "Mid Ticket Services",
    name: "Mixing Only — Single Track",
    description:
      "Already have a master engineer lined up? Let us handle the mix. We'll shape the levels, EQ, compression, and effects so every element sits in its place and the record sounds professional before it ever hits mastering. Includes up to 2 revision rounds.",
    price: 150,
  },
  {
    collection: "Mid Ticket Services",
    name: "Mastering Only — Single Track",
    description:
      "Your mix is done — now make it loud, clear, and streaming-ready. We master your track to commercial loudness standards so it competes with anything on the charts. Works with any DAW export. Includes up to 2 revision rounds.",
    price: 100,
  },

  // ─── High Ticket Services ──────────────────────────────────────────────────
  {
    collection: "High Ticket Services",
    name: "3-Song EP Production — Unlimited Use Licenses",
    description:
      "Three custom beats built around your sound, delivered as a cohesive body of work. Unlimited Use licenses let you distribute all three songs across all platforms. Each beat includes up to 2 revision rounds. Perfect for your first EP or a quick project drop.",
    price: 450,
  },
  {
    collection: "High Ticket Services",
    name: "3-Song EP Production — Exclusive Licenses",
    description:
      "A fully exclusive 3-song EP production — once delivered, all three beats are removed from our catalog permanently. Own your sound outright. Built for artists serious about protecting their brand and maximizing long-term value. Each beat includes up to 3 revision rounds.",
    price: 1200,
  },
  {
    collection: "High Ticket Services",
    name: "5-Song EP Production — Unlimited Use Licenses",
    description:
      "Five custom beats, one cohesive sound. Unlimited Use licenses across all five songs let you release anywhere without restriction. We work through your project top to bottom to make sure every record feels like it belongs on the same tape. Each beat includes up to 2 revision rounds.",
    price: 750,
  },
  {
    collection: "High Ticket Services",
    name: "5-Song EP Production — Exclusive Licenses",
    description:
      "Five fully exclusive, custom-produced beats — yours permanently. Nobody else records over these. Ideal for an artist ready to build a signature catalog and lock in their sound before anyone else can. Each beat includes up to 3 revision rounds.",
    price: 2000,
  },
  {
    collection: "High Ticket Services",
    name: "9-Song Album Production — Unlimited Use Licenses",
    description:
      "A full 9-track album produced from the ground up. We develop the concept, craft beats tailored to your style, and deliver a project that flows start to finish. Unlimited Use licenses on every track. Each beat includes up to 2 revision rounds. This is how albums get made.",
    price: 1350,
  },
  {
    collection: "High Ticket Services",
    name: "9-Song Album Production — Exclusive Licenses",
    description:
      "Nine fully exclusive custom beats — a complete album that belongs to you and only you. Every record is removed from our library on delivery. Built for artists serious about longevity, sync licensing, and owning their entire body of work. Each beat includes up to 3 revision rounds.",
    price: 3600,
  },
  {
    collection: "High Ticket Services",
    name: "12-Song Album Production — Unlimited Use Licenses",
    description:
      "Our most expansive album package — 12 custom beats for a full-length album release. Unlimited Use licenses mean you can distribute everything everywhere. We build each record to fit your concept and make the project feel like one complete statement. Each beat includes up to 2 revision rounds.",
    price: 1800,
  },
  {
    collection: "High Ticket Services",
    name: "12-Song Album Production — Exclusive Licenses",
    description:
      "The ultimate production package. Twelve exclusive custom beats built exclusively for you — a complete album catalog you own outright. This is for artists ready to make a serious investment in their career. Every beat pulled from our catalog on delivery. Each beat includes up to 3 revision rounds.",
    price: 4800,
  },
];

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${res.status} ${path}: ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  // Step 1: Create the two collections (categories)
  console.log("📁  Creating collections...");
  const collectionNames = ["Mid Ticket Services", "High Ticket Services"];
  const collectionMap = {};

  for (const name of collectionNames) {
    try {
      const data = await apiPost("/products/collections", {
        locationId: LOCATION_ID,
        name,
      });
      const id = data?.collection?.id ?? data?.id;
      collectionMap[name] = id;
      console.log(`  ✅  Collection "${name}" → ${id}`);
    } catch (err) {
      // Collection may already exist — log and continue
      console.warn(`  ⚠️  Collection "${name}": ${err.message}`);
    }
  }

  // Step 2: Create each product + price
  console.log("\n🛒  Creating products...");
  for (const p of products) {
    const originalPrice = p.price * 2; // listed = 50% off
    try {
      // Create product
      const productBody = {
        locationId: LOCATION_ID,
        name: p.name,
        description: p.description,
        productType: "SERVICE",
        image: LOGO_URL,
        ...(collectionMap[p.collection]
          ? { collectionIds: [collectionMap[p.collection]] }
          : {}),
      };
      const productData = await apiPost("/products/", productBody);

      // Try every known GHL response shape
      const productId =
        productData?._id ??
        productData?.id ??
        productData?.product?._id ??
        productData?.product?.id ??
        productData?.data?._id ??
        productData?.data?.id;

      if (!productId) {
        console.error(`  ⚠️  Could not find ID in response: ${JSON.stringify(productData)}`);
        continue;
      }

      // Create price (sale + compare-at)
      await apiPost(`/products/${productId}/price`, {
        locationId: LOCATION_ID,
        name: "Standard",
        type: "one_time",
        amount: p.price * 100,        // in cents
        compareAtAmount: originalPrice * 100,
        currency: "USD",
      });

      console.log(
        `  ✅  "${p.name}" — $${p.price} (was $${originalPrice}) [${p.collection}]`
      );
    } catch (err) {
      console.error(`  ❌  "${p.name}": ${err.message}`);
    }
  }

  console.log("\n✅  Done! Check GHL → Payments → Products");
}

main().catch(console.error);
