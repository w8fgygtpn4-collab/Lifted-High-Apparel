# Lifted High Apparel

Responsive React + Vite storefront for a small, faith-inspired outdoor lifestyle catalog.

## Development

Node 22.12+ (validated on Node 24).

```sh
npm ci --cache /tmp/lha-npm
npm run dev
```

```sh
npm run build

# Tests use /usr/bin/chromium; set CHROMIUM_PATH to another installed browser.
npm test
```

## Catalog and integration

Edit `src/data.js` to update products and collections. `catalog` is the integration boundary for a future Shopify Storefront API. Cart entries store product IDs, options, and quantities in localStorage. Replace this with Shopify variant IDs and its Cart API before enabling checkout. Payment and fulfillment belong to Shopify/your provider; no payment handling is implemented here.

Products are concept illustrations, not final merchandise. Outdoor photographs are optimized local placeholders sourced from StartBootstrap Grayscale/Clean Blog and the adrianhajdin/travel_ui_ux sample repository. See public/images/PHOTO-LICENSE.txt for StartBootstrap’s license; verify individual photo rights and replace sample photography before commercial launch. Replace these with licensed brand photography and optimized local images before launch. Email signup is a local preview only; connect a consent-aware email provider before launch. Social profiles are explicitly marked as coming soon.

Deploy `dist` to a static host with a fallback from application routes to `index.html`. For search-indexed production merchandising, add server rendering or prerendering, canonical URLs, real product structured data, and finalized policies when the catalog and domain are ready.
