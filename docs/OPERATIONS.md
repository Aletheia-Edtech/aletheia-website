# Running the Aletheia website

## What it depends on

| Service | Used for | Where it is set up |
|---|---|---|
| Render | Builds and hosts the site as a static site | `render.yaml` (service `aletheia-website`), plus the Render dashboard |
| Domain `aletheia.sg` | The public address | The domain registrar and its DNS settings, pointing at Render |
| EmailJS | Sends contact-form messages to our inbox | EmailJS dashboard: the email service, the template and the public key |
| Google reCAPTCHA | Protects the contact form from bots | reCAPTCHA admin console: the site key for `aletheia.sg` |
| GitHub | The code | The `saraundre/aletheia--website` repository |

The repo does not record which person's login each service uses. When handing the site over, list the owner of
each login above and move it to a shared company account.

## Publishing a change

1. Change the content or code, check it locally (`npm run dev`, then `npm run build` and
   `npm run preview:static`).
2. Push to `main`. Render builds and publishes automatically when the push touches the site's files (the
   `buildFilter` paths in `render.yaml`: `app/`, `components/`, `lib/`, `public/`, `hooks/`, `package.json` and the
   config files). A push that changes only docs does not rebuild the site.
3. Watch the deploy in the Render dashboard. `scripts/log-env.js` prints the build environment at the top of the
   log.

The build is a static export (`out/`), so a failed build never takes the live site down: the last good version
keeps serving.

## Updating content

| Content | How |
|---|---|
| Page text | Edit the page under `app/` (for example `app/about/page.tsx`) |
| Gallery photos and videos | See `public/gallery/photos/README.md` and `app/gallery/README.md` |
| Partner logos ("Trusted by") | See `public/partners/README.md` |
| Collaborators carousel | `CollaboratorsCarousel` in `app/about/page.tsx` |

## Contact form settings

Four build-time variables, set in the Render dashboard's environment for the site (they are public values that
end up in the page): `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`,
`NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. The EmailJS template uses the fields
`{{name}}`, `{{email}}`, `{{organization}}`, `{{interest}}` and `{{message}}`. After changing any of them, trigger
a new deploy so the site is rebuilt with the new values.

## If a Render build runs out of memory

A build that stops with exit status 137 ran out of memory. Keep heavy tools (browser-testing packages and
similar) out of `package.json`, and keep the packages the build needs (Tailwind, PostCSS, Autoprefixer) in
`dependencies`, since the production build installs only those.

## Security headers

`render.yaml` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin` and `X-XSS-Protection` on every page.
