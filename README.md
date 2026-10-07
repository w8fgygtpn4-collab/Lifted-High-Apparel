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

See [SHOPIFY_SETUP.md](SHOPIFY_SETUP.md) for connecting the store to `y26tvi-rw.myshopify.com`. With the two VITE_SHOPIFY variables set at build time, products load from Shopify and the bag redirects to Shopify checkout. Without both variables, the original concept catalog remains available. Cart entries use a separate storage key for live Shopify variants. The integration does not handle payment processing. Run `npm run test:shopify` for the simulated API integration suite.

In preview mode, products are concept illustrations, not final merchandise. Live mode displays the images and descriptions published in Shopify. Outdoor photographs are optimized local placeholders sourced from StartBootstrap Grayscale/Clean Blog and the adrianhajdin/travel_ui_ux sample repository. See public/images/PHOTO-LICENSE.txt for StartBootstrap’s license; verify individual photo rights and replace sample photography before commercial launch. Replace these with licensed brand photography and optimized local images before launch. Email signup is a local preview only; connect a consent-aware email provider before launch. Social profiles are explicitly marked as coming soon.

Deploy `dist` to a static host with a fallback from application routes to `index.html`. For search-indexed production merchandising, add server rendering or prerendering, canonical URLs, real product structured data, and finalized policies when the catalog and domain are ready.
