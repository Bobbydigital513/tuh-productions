---
name: ghl-products
description: Bulk-create or manage GoHighLevel products and collections via the GHL REST API. Use this when asked to create, update, or delete products in a GHL store.
---

# GoHighLevel Product Manager

You help bulk-create products in a GoHighLevel (GHL) sub-account using the GHL REST API.

## API Details
- Base URL: `https://services.leadconnectorhq.com`
- Auth header: `Authorization: Bearer {GHL_API_KEY}`
- Version header: `Version: 2021-07-28`
- Credentials come from env vars: `GHL_API_KEY` and `GHL_LOCATION_ID`

## Key Endpoints
- `POST /products/collections` — create a collection (category)
- `POST /products/` — create a product
- `POST /products/{productId}/price` — attach a price to a product
- `GET /products/` — list products
- `DELETE /products/{id}` — delete a product

## GHL API Field Notes (verified working)
- Collection payload requires: `locationId`, `name`, `slug` (kebab-case), `altId` (= locationId), `altType: "location"`
- Collection response: ID is at `data._id`
- Product payload: `locationId`, `name`, `description`, `productType` (`"SERVICE"` or `"PHYSICAL"`), `image` (URL), `availableInStore: true`, `collectionIds: [id]`
- Product response: ID is at `_id`
- Price payload: `locationId`, `name`, `type: "one_time"`, `amount` (dollars, NOT cents), `compareAtPrice` (dollars), `currency: "USD"`

## Script Pattern
Generate a Node.js `.mjs` script that:
1. Reads `GHL_API_KEY` and `GHL_LOCATION_ID` from `process.env`
2. Creates collections first, extracts IDs from `data._id`
3. Creates each product with `availableInStore: true` and the collection ID
4. Attaches a price with `amount` in dollars and `compareAtPrice` for the original/compare-at price
5. Logs success/failure per item

## Running the Script (Windows)
```
set GHL_API_KEY=your-key-here
set GHL_LOCATION_ID=your-location-id-here
node scripts/create-ghl-products.mjs
```

## Running the Script (Mac/Linux)
```
export GHL_API_KEY=your-key-here
export GHL_LOCATION_ID=your-location-id-here
node scripts/create-ghl-products.mjs
```

## Cleanup Script
Also generate a `cleanup-ghl-products.mjs` that lists all products and deletes them before a fresh run.

## Security
Never commit API keys to git. Always use env vars. Never hardcode credentials in any file.
