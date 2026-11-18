# Aletheia website

The public website of Aletheia, live at https://aletheia.sg. A static Next.js site: no server and no database.
Every page is built to plain HTML at deploy time.

## Who built it

Sara Undre ([@saraundre](https://github.com/saraundre)) started the site in June 2025, and she and Ahmad Pathan ([@PathanAhmad](https://github.com/PathanAhmad)) wrote most of it: 46 commits by Ahmad and 40 by Sara, out of 112. [@GeniusN281](https://github.com/GeniusN281) and [@mahmoudrules](https://github.com/mahmoudrules) wrote 13 each. In November 2026 Sara redesigned the Tech4All page and added the gallery's filters and the smoother scrolling on the home page.

## Pages

| Route | Source | What it shows |
|---|---|---|
| `/` | `app/page.tsx` | Home: who we are and what we do |
| `/about` | `app/about/page.tsx` | About us, the collaborators carousel and the "Trusted by" partner logos (`public/partners/`) |
| `/stem-for-all` | `app/stem-for-all/` | The STEM for All programme |
| `/tech4all` | `app/tech4all/page.tsx` | The Tech4All programme |
| `/gallery` | `app/gallery/page.tsx` | Event videos and photos (`public/gallery/photos/`) |
| `/contact` | `app/contact/page.tsx` | Contact form |

Shared parts: `components/nav.tsx`, `components/footer.tsx`, the Sparkie mascot animations in
`components/animations/`. `components/ui/` is the stock shadcn/ui kit.

How to add a gallery photo or a partner logo: `public/gallery/photos/README.md`, `app/gallery/README.md` and
`public/partners/README.md`. Hosting, accounts, publishing and the contact-form settings:
[docs/OPERATIONS.md](docs/OPERATIONS.md).

## Stack

Next.js (App Router) with `output: 'export'` (static HTML into `out/`), TypeScript, Tailwind CSS, Framer Motion,
React Hook Form + Zod for the contact form.

`next.config.js` sets `ignoreBuildErrors` and `ignoreDuringBuilds`, so **a TypeScript or lint error does not stop
a build**. Run `npx tsc --noEmit` and `npm run lint` yourself before you push.

## The contact form

The form sends email straight from the browser through EmailJS (a hosted email-sending service), protected by
Google reCAPTCHA. There is no backend of ours. It needs these build-time variables:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | The EmailJS email service |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | The EmailJS template. It uses `{{name}}`, `{{email}}`, `{{organization}}`, `{{interest}}` and `{{message}}` |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | The EmailJS public key |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | The reCAPTCHA site key. Without it the form says it cannot be sent |

These are public values (they end up in the page), but they are not in `render.yaml`. They live in the Render
dashboard's environment settings for this site, and the EmailJS account owner controls where the mail goes.

## Run and build

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # static site into out/
npm run preview:static   # serve out/ locally to check it
```

`npm run build` runs `scripts/build.js`, which copies the project to a temporary folder, builds there and then
swaps `out/` in, so a failed build never leaves a half-written `out/`. `scripts/log-env.js` prints the build
environment first, which helps when a Render build fails.

## Deploy

Render hosts it as a static site from `render.yaml`. Every push to `main` that touches the site's files
redeploys it. `render.yaml` also sets the security headers.

`server.js` is a leftover custom Node server from before the site became static. Nothing uses it.

## Ownership

This repository is in the Aletheia-Edtech GitHub organisation (moved from the `saraundre` account on 2026-11-18).
Render reads it through the Render app installed on the organisation. The Render service, the domain and the EmailJS
and reCAPTCHA accounts are separate logins; check who holds each.
