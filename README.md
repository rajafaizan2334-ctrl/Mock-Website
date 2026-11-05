# Captain Media: concept website

A clickable concept for the new Captain Media website: cinematic, bold typography, smooth animations and case studies. All copy is in Dutch. The reference was beeldfanaat.nl, adapted to Captain Media's own logo, tagline ("Sterk in beeld. Scherp in ontwerp.") and contact details.

## View it

- **Quickest:** open `index.html` in a browser. Everything works from disk.
- **Local server:** `npm install`, then `npm run dev`, then open http://localhost:3000

## Pages (26)

| Page | File |
|---|---|
| Home (hero with REC timecode, manifesto, disciplines, pinned case slider, process, CTA) | `index.html` |
| Cases overview with filters | `cases.html` |
| Case detail (7, one template) | `cases/*.html` |
| Services overview | `diensten.html` |
| Service pages (14, one template) | `diensten/*.html` |
| About | `over-ons.html` |
| Contact (production-brief form + callsheet) | `contact.html` |

Navigation is Cases | Diensten | Over ons | Contact. Diensten opens a four-column mega menu (Video, Fotografie, Design, AI) where every service links to its own page.

## How it is built

- `src/data.mjs` holds all content: services, cases and process steps. Change it there, then run `npm run build` to regenerate every page.
- `build.mjs` holds the page templates (no dependencies).
- `assets/css/site.css` is the design system: tokens, type scale and layouts.
- `assets/js/site.js` holds the animations, built with [Motion](https://motion.dev) (vanilla JS): `inView` reveals, `scroll()` parallax and the pinned horizontal case slider, plus a spring 3D tilt, mega-menu choreography, a cursor label and page transitions. Everything respects `prefers-reduced-motion`.

## Moving it to Webflow

The structure maps one to one:

- **Cases** becomes a CMS collection. The fields match `webflow-cms-cases.csv`, which can be imported directly: Name, Slug, Client, Category, Services, Year, Main image, Gallery, Summary, Vraag, Aanpak, Resultaat. `cases/*.html` becomes the collection template page, and the cases grid becomes a Collection List.
- **Diensten** can be a second CMS collection, or 10 static pages built from one template.
- **Animations:** Webflow Interactions with GSAP cover the same effects (split-text reveals, scroll-linked parallax, pinned horizontal scroll).
- **Contact form:** the form currently shows a success message without sending anything. In Webflow it becomes a native Webflow Form.

## Placeholder content

Photos (Unsplash), the hero/showreel video (Mixkit) and the 7 cases with their client names are **example content**. The footer says so too. They should be replaced with Captain Media's own work, video and photography.
