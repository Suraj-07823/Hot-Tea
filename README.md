# Hot Tea — Static Website

This project is a minimal, mobile-first static website for the cafe "Hot Tea". It focuses on trust, hygiene, and a warm cafe vibe.

## What's included
- `index.html` — Home (Hero, highlights, reviews preview, gallery, location embed)
- `menu.html` — Clean categorized menu
- `reviews.html` — Reviews and guidance for live integration
- `about.html` — Story and promise
- `contact.html` — Address, map, hours, call/WhatsApp buttons
- `css/styles.css` — Mobile-first responsive styles
- `js/main.js` — Minimal interactivity
- `assets/images` — placeholder SVGs for gallery

## Local preview
Open the site folder and run a static server (recommended):
- Python: `python -m http.server 8080` and visit `http://localhost:8080`
- Or use VS Code Live Server extension

## Replace placeholders
- Replace `assets/images/*` with real photos (interior, food, kitchen). Use compressed, web-optimized images (WebP/AVIF recommended).
- Update the Google Maps iframe `src` in `index.html` and `contact.html` with your real embed URL.
- Update address, phone number, and opening hours in `contact.html`.

## SEO & Reviews
- The site includes JSON-LD LocalBusiness schema.
- To display live Google reviews you can use the Google Places API (requires API key and server-side caching). See `reviews.html` and sample serverless snippet below.

### Sample serverless snippet (Node.js / Netlify function)
```js
// Replace PLACE_API_KEY and PLACE_ID, cache responses server-side
const fetch = require('node-fetch');
exports.handler = async () => {
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=name,rating,reviews&key=PLACE_API_KEY`);
  const data = await res.json();
  return { statusCode: 200, body: JSON.stringify({ reviews: data.result.reviews || [] }) };
};
```

## Accessibility & Performance
- Semantic HTML, ARIA for nav toggle, and visible focus styles.
- Lazy-loading images and small SVG placeholders for speed.

## Next steps (recommended)
1. Provide real images & logo
2. Add real Google Maps embed URL and address
3. Integrate live reviews via the Places API and cache results
4. Run Lighthouse audits and fix any accessibility/lcp issues

If you'd like, I can:
- Add a dark-mode toggle
- Integrate a serverless reviews endpoint
- Prepare optimized image assets and compress them

---

Made for Hot Tea — let me know the exact address, contact number, and a few real photos and I'll integrate them.

## Serverless Reviews Function

A Netlify-compatible function is included at `netlify/functions/get-reviews.js`. It fetches Google Place Details (reviews), sanitizes them (removes URLs/phone-like text, truncates long text, uses first name only), and caches results in-memory for 1 hour.

Required environment variables (set in your Netlify project settings or CI):
- `GOOGLE_PLACES_API_KEY` — your Google API key with Places API enabled
- `GOOGLE_PLACE_ID` — the place_id for your business

Testing locally:
- Install Netlify CLI (`npm i -g netlify-cli`) and run `netlify dev` in the `site` folder. The endpoint will be available at `/.netlify/functions/get-reviews`.
- You can bypass cache by calling `/.netlify/functions/get-reviews?noCache=true`.

Security & privacy: sanitize logic strips URLs, basic phone patterns and reduces author name to first name to reduce PII exposure. Consider additional server-side checks or moderation as needed.

If you'd like, I can also add a Vercel/Cloud Functions variant, or wire server-side caching using Redis for production-grade persistence.