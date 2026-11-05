# Swift Converter Hub ⚡

Free online tools for **images, audio, video, PDFs, data and text**. 46 tools, and every one runs inside the visitor's browser. Files are never uploaded.

Live at **[swiftconverterhub.com](https://www.swiftconverterhub.com)**

> New here? Start with **[SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md)**. It explains the whole project in plain words.

**Built with:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 + shadcn/ui · WebAssembly (ImageMagick, FFmpeg, Tesseract) · WebCodecs · ONNX Runtime Web · pdf-lib · Resend

---

## Get it running

```bash
npm install          # also copies the engines into public/ (see below)
npm run dev          # http://localhost:3000
```

You need a `.env.local` file first (see [Settings](#settings-environment-variables)). Never commit `.env` files.

| Command | What it does |
|---|---|
| `npm run dev` | Start the site locally |
| `npm run build` / `npm start` | Make and run a production build |
| `npm run lint` | Check code style |
| `npx tsc --noEmit` | Check the TypeScript |
| `npm test` | Unit tests (Vitest, no setup needed) |

**About `npm install`:** it runs four small scripts in `scripts/` that copy the processing engines (ImageMagick, FFmpeg, ONNX Runtime, Tesseract) from `node_modules` into `public/`. The site serves them itself, so no request ever goes to a third-party CDN. These copies are in `.gitignore`. If a tool says its engine failed to load, delete `node_modules` and run `npm install` again.

## Where things live

| I want to… | Look in |
|---|---|
| Add, rename or describe a tool | `config/tools.ts` (one file drives menus, search, hubs, sitemap) |
| Change how a tool works | `features/<studio>/<tool>/` (components, hooks, lib) |
| Change a tool's page (title, FAQ, SEO text) | `app/<studio>/<tool>/page.tsx` |
| Change parts every tool shares (drop zone, toolbar, page sections) | `features/shared/` |
| Change the header, footer or search | `components/Navbar.tsx`, `components/Footer.tsx`, `components/shell/` |
| Change colours and fonts | `app/globals.css` (tokens at the top) |
| Change a studio's colour | `config/studio-theme.ts` |
| Change page titles, share cards and SEO | `lib/seo.ts`, `app/og/route.tsx` |
| Change the logo | `components/brand/LogoMark.tsx`, `public/logo.svg` |
| Add a blog post | `config/blog.ts` + a folder in `app/blog/` |
| Change ads or analytics | `components/ads/`, `components/consent/`, `lib/adsense.ts`, `lib/analytics.ts` |
| Change the contact form email | `features/contact/`, `app/api/contact/route.ts` |

**Adding a tool:** add one entry to `TOOLS` in `config/tools.ts`, build it in `features/<studio>/<tool>/`, and give it a page in `app/<studio>/<tool>/page.tsx`. It then shows up in the header menu, mobile menu, search, studio hub, tool tabs, related tools and sitemap by itself.

## Settings (environment variables)

Set these in `.env.local` locally and in your hosting dashboard for the live site. `NEXT_PUBLIC_*` values are fixed at build time, so redeploy after changing one.

| Variable | Needed? | What it's for |
|---|---|---|
| `RESEND_API_KEY` | yes | Sends contact form emails. **Server only, never share it.** The build stops without it. |
| `NEXT_PUBLIC_SITE_URL` | optional | The site's https address. Defaults to `https://www.swiftconverterhub.com`. Set it for preview or staging sites. |
| `NEXT_PUBLIC_ADS_ENABLED` | optional | `false` turns all ads off |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | optional | `false` turns Google Analytics and Clarity off |

AdSense and analytics IDs live in `lib/adsense.ts` and `lib/analytics.ts`.

## Checks before merging

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and push to `main`:

**install → lint → type-check → unit tests → production build**

The build needs the `RESEND_API_KEY` secret set in the GitHub repository settings.

## Going live

1. Add the variables above in your hosting dashboard.
2. Deploy. It's a standard Next.js app (`npm run build`). Use **npm** so the engine copy scripts run.
3. After deploying, open one tool from each studio and convert a real file.

**Checklist**
- [ ] `RESEND_API_KEY` set, and a test message sent from the Contact page arrives
- [ ] Ads and analytics switched on (or off) as intended
- [ ] The background remover works (it loads a 47 MB model on first use, so check it's served from `/models/`)
- [ ] `/sitemap.xml`, `/robots.txt` and `/llms.txt` open correctly
- [ ] A shared link shows its preview image (try WhatsApp or LinkedIn)
- [ ] Site added to Google Search Console and Bing, and `/sitemap.xml` submitted

## Good to know

- **Nothing is uploaded, by design.** All file work happens in the browser. The only server endpoint is `/api/contact`. Don't add server-side file processing. It would break the main promise of the product.
- **Engines load only when needed** and stay cached. The AI model, its runtime and the OCR data are cached for a year. To update one, change the version in its folder name, not the file itself.
- **Video uses the graphics chip first.** Convert, Compress and Trim try a lossless copy, then the device's hardware encoder (WebCodecs), then FFmpeg. Details in `features/video/shared/lib/fastVideo.ts`.
- **Multi-threaded FFmpeg is off on purpose.** It needs cross-origin isolation headers, and those headers block ads.
- **Background remover model:** `public/models/isnet-general-use-w8-v2.onnx` (licence in `NOTICE.txt`). The worker is `public/workers/remove-background.worker.mjs`.
- **Content-Security-Policy** is in report-only mode (`next.config.ts`) while ad partners are tuned. It logs problems but doesn't block anything yet.
- **Running `next dev`** creates `AGENTS.md` and `CLAUDE.md` in the root. Commit them or ignore them.
- Full notes on the latest redesign and new tools are in **[UI-UX-CHANGES.md](UI-UX-CHANGES.md)**.
