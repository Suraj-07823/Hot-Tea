# Hot Tea — Static Website

A small, mobile-first static website for the cafe "Hot Tea". This repository is intended for building and previewing the site locally or deploying to a static host.

## Quickstart (local preview)
1. Clone the repo and open the `site` folder.
2. Start a simple static server and visit http://localhost:8080
   - Python (built-in): `python -m http.server 8080`
   - Or use the **Live Server** extension in VS Code

## Optional: test serverless functions locally
- Install Netlify CLI: `npm i -g netlify-cli`
- Create a local `.env` file (do NOT commit this file). Example names:
  - `GOOGLE_PLACES_API_KEY` (your Places API key)
  - `GOOGLE_PLACE_ID` (your business place_id)
- Run: `netlify dev` in the `site` folder and visit `/.netlify/functions/get-reviews` to test the reviews endpoint.

> Note: Keep any API keys or secrets out of version control. Use environment variables or your hosting provider's secrets management.

## Replace placeholders
- Add real images in `assets/images/` (interior, food, kitchen). Optimize images (WebP/AVIF recommended) and provide responsive sizes.
- Update the Google Maps iframe `src` and the address/phone in `contact.html`.

## Accessibility & Performance
- The site uses semantic HTML, ARIA attributes for the nav, and lazy-loading for images. Run a Lighthouse audit and improve LCP/CLS as needed.

## Contributing
- This repo is a simple static site — contributors can submit image updates, content improvements, or style tweaks via PRs.

## License
- Use as you like (no license attached by default). Add a LICENSE file if you plan to publish with specific terms.

---

