# Hot Tea — Static Site

This repository contains a small static site for the Hot Tea café.

## Development

- Start local server: `npm run start`

## CI

A GitHub Actions workflow (`.github/workflows/lighthouse-ci.yml`) runs:
- `pa11y-ci` accessibility checks
- `lhci autorun` (Lighthouse CI collect + assert + upload)

You can configure thresholds in `.lighthouserc.js` (see `assertions`).

To run the checks locally:
- `npm ci`
- `npm run start` (or `npx http-server ./site -p 8080 -c-1`)
- `npx pa11y-ci`
- `npx lhci autorun --upload.target=temporary-public-storage`

Build & deploy:
- `npm run build` — produce optimized site in `site/dist`
- `npm run deploy:netlify` — deploy `site/dist` to Netlify (requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets)

Logo & assets:
- Replace `site/assets/images/logo.png` with your high-resolution logo (the attached file) to have it appear as the site favicon and app icon.
- Add additional images for menu items to `site/assets/images/` and reference them from `menu.html`.

PWA (installable web app):
- I added an `Install App` button that appears when the browser fires the `beforeinstallprompt` event and a basic `manifest.json` + `sw.js` service worker to enable offline caching and installability.
- Ensure your build process copies `manifest.json` and `sw.js` to the published `dist` folder so the service worker is served from the site root.
- I added a `download.html` page that will be used to host Play Store / APK links when the Android build is ready.

Feedback email forwarding (SendGrid):
- I added a Netlify Function `netlify/functions/send-feedback.js` to forward feedback submissions by email using SendGrid.
- Environment variables to set in Netlify site settings (Build & deploy > Environment):
  - `SENDGRID_API_KEY` — your SendGrid API key (required)
  - `SENDGRID_FROM` — email address used as the From (e.g., `no-reply@hottea.in`) (optional)
  - `FEEDBACK_TO` — recipient email address (defaults to `vishwakarmasuraj089504@gmail.com`) (optional)

If you prefer Mailgun or SMTP instead, tell me which provider and I'll adapt the function and the README.

