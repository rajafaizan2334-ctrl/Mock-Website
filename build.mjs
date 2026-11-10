import { mkdirSync, writeFileSync, copyFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, pillars, services, cases as allCases, steps } from "./src/data.mjs";
// Only real cases go live; example cases stay in data.mjs (real: false) until replaced.
const cases = allCases.filter((c) => c.real);

const ROOT = dirname(fileURLToPath(import.meta.url));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => s.replace(/\*/g, "").replace(/\|/g, " ");
const pillarOf = (key) => pillars.find((p) => p.key === key);
const serviceBy = (slug) => services.find((s) => s.slug === slug);

function rich(text) {
  return esc(text)
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\|/g, "<br>");
}

function split(text) {
  let italic = false;
  return text
    .split("|")
    .map((line) =>
      line
        .split(" ")
        .filter(Boolean)
        .map((word) => {
          let out = "";
          for (const part of word.split(/(\*)/)) {
            if (part === "*") italic = !italic;
            else if (part) out += italic ? `<em>${esc(part)}</em>` : esc(part);
          }
          return `<span class="w"><span class="wi">${out}</span></span>`;
        })
        .join(" ")
    )
    .join("<br>");
}

// Local media (own photos/stills) live in /assets/media; anything else is an Unsplash photo id.
const isLocal = (id) => typeof id === "string" && id.startsWith("/");
function src(id, w, h) {
  if (isLocal(id)) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;
}

function img(id, alt, { w = 1600, ratio, sizes = "100vw", eager = false, cls = "" } = {}) {
  const h = ratio ? Math.round(w / ratio) : undefined;
  if (isLocal(id)) {
    const style = ratio ? ` style="aspect-ratio:${ratio};object-fit:cover"` : "";
    return `<img class="${cls}" src="${id}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${h ? ` width="${w}" height="${h}"` : ""}${style}>`;
  }
  const widths = [480, 800, 1200, 1600, 2200].filter((x) => x <= w * 1.4);
  const set = widths.map((x) => `${src(id, x, ratio ? Math.round(x / ratio) : undefined)} ${x}w`).join(", ");
  return `<img class="${cls}" src="${src(id, w, h)}" srcset="${set}" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${h ? ` width="${w}" height="${h}"` : ""}>`;
}

const arrow = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const arrowRight = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevron = `<svg class="ico chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const play = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>`;
const waIcon = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>`;

function header(r, current) {
  const col = (p) => `
          <div class="mega-col">
            <a class="mega-head" href="${r}diensten.html#${p.key}"><span class="mono">${p.no}</span>${p.title}</a>
            <ul>
              ${services
                .filter((s) => s.pillar === p.key)
                .map(
                  (s) => `<li><a class="mega-link" href="${r}diensten/${s.slug}.html"><span class="mega-title">${esc(s.title)}</span><span class="mega-sub">${esc(s.menu)}</span>${arrowRight}</a></li>`
                )
                .join("")}
            </ul>
          </div>`;
  const nav = (href, label, key) => `<a class="nav-link${current === key ? " is-active" : ""}" href="${r}${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `
  <a class="skip" href="#main">Naar de inhoud</a>
  <header class="site-header" data-header>
    <div class="header-inner">
      <a class="logo" href="${r}index.html" aria-label="Captain Media, naar de homepage">
        <img src="${r}assets/img/captain-media-logo.png" alt="Captain Media" width="623" height="168">
      </a>
      <nav class="main-nav" aria-label="Hoofdmenu">
        ${nav("cases.html", "Cases", "cases")}
        <div class="has-mega" data-mega>
          <button class="nav-link${current === "diensten" ? " is-active" : ""}" type="button" aria-expanded="false" aria-controls="mega" data-mega-toggle>Diensten ${chevron}</button>
          <div class="mega" id="mega" data-mega-panel>
            <div class="mega-grid">${pillars.map(col).join("")}</div>
            <div class="mega-foot">
              <span><span class="rec-dot"></span> Video, foto, design en AI onder één dak</span>
              <a href="${r}diensten.html">Alle diensten ${arrowRight}</a>
            </div>
          </div>
        </div>
        ${nav("over-ons.html", "Over ons", "over")}
        ${nav("contact.html", "Contact", "contact")}
      </nav>
      <a class="btn btn-sm btn-light header-cta" href="${r}contact.html">Plan een gesprek ${arrow}</a>
      <button class="burger" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="mobile-menu" data-burger><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
    <nav aria-label="Mobiel menu">
      <a class="m-link" href="${r}cases.html">Cases</a>
      <details class="m-group">
        <summary class="m-link">Diensten ${chevron}</summary>
        ${pillars
          .map(
            (p) => `<div class="m-pillar"><span class="mono">${p.no} ${p.title}</span>${services
              .filter((s) => s.pillar === p.key)
              .map((s) => `<a href="${r}diensten/${s.slug}.html">${esc(s.title)}</a>`)
              .join("")}</div>`
          )
          .join("")}
      </details>
      <a class="m-link" href="${r}over-ons.html">Over ons</a>
      <a class="m-link" href="${r}contact.html">Contact</a>
    </nav>
    <div class="m-foot">
      <a class="btn btn-accent" href="${site.whatsapp}" target="_blank" rel="noopener">${waIcon} Stuur een WhatsApp</a>
      <a href="mailto:${site.email}">${site.email}</a>
    </div>
  </div>`;
}

function callsheet(r) {
  return `
      <div class="callsheet" data-reveal>
        <div class="cs-top"><span class="mono">Callsheet</span><span class="mono"><span class="rec-dot"></span> Nu beschikbaar</span></div>
        <dl>
          <div><dt>Productie</dt><dd>Jouw volgende project</dd></div>
          <div><dt>Disciplines</dt><dd>Video · Fotografie · Design · AI</dd></div>
          <div><dt>Locatie</dt><dd>Op locatie, door heel Nederland</dd></div>
          <div><dt>Bellen</dt><dd><a href="tel:${site.phoneHref}">${site.phone}</a></dd></div>
          <div><dt>Mail</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
        </dl>
        <div class="cs-actions">
          <a class="btn btn-accent" href="${site.whatsapp}" target="_blank" rel="noopener">${waIcon} WhatsApp</a>
          <a class="btn btn-ghost" href="${r}contact.html">Plan een gesprek ${arrow}</a>
        </div>
      </div>`;
}

function ctaBlock(r, title = "Klaar voor de *opname?*") {
  return `
  <section class="cta">
    <div class="wrap cta-grid">
      <div>
        <p class="eyebrow" data-reveal>Laten we iets moois maken</p>
        <h2 class="display-xl" data-split>${split(title)}</h2>
        <p class="lead" data-reveal>Vertel ons wat je wilt maken. Binnen één werkdag hoor je van ons, met een eerlijk advies en een heldere planning.</p>
      </div>
      ${callsheet(r)}
    </div>
  </section>`;
}

function footer(r) {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="${r}assets/img/captain-media-logo.png" alt="Captain Media" width="623" height="168" loading="lazy">
          <p class="muted">${site.tagline}</p>
        </div>
        <div>
          <p class="mono">Diensten</p>
          <ul>${pillars.map((p) => `<li><a href="${r}diensten.html#${p.key}">${p.title}</a></li>`).join("")}</ul>
        </div>
        <div>
          <p class="mono">Pagina's</p>
          <ul>
            <li><a href="${r}cases.html">Cases</a></li>
            <li><a href="${r}over-ons.html">Over ons</a></li>
            <li><a href="${r}contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <p class="mono">Contact</p>
          <ul>
            <li><a href="mailto:${site.email}">${site.email}</a></li>
            <li><a href="tel:${site.phoneHref}">${site.phone}</a></li>
            <li><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Captain Media</span>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="Stuur Captain Media een WhatsApp">${waIcon}</a>
  <div class="cursor" data-cursor aria-hidden="true"><span>Bekijk</span></div>
  <div class="curtain" data-curtain aria-hidden="true"></div>`;
}

function layout({ title, desc, r = "", current = "", body, bodyClass = "" }) {
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta name="theme-color" content="#0b0b0b">
  <link rel="icon" type="image/png" href="${r}assets/img/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,600&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="${r}assets/css/site.css">
  <script>document.documentElement.classList.add("js")</script>
</head>
<body class="${bodyClass}">
${header(r, current)}
  <main id="main">
${body}
  </main>
${footer(r)}
  <div class="modal" data-modal hidden>
    <button class="modal-close" type="button" data-modal-close aria-label="Video sluiten">✕</button>
    <video data-modal-video controls playsinline preload="none"></video>
    <iframe data-modal-embed title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen hidden></iframe>
  </div>
  <script src="${r}assets/vendor/motion.js"></script>
  <script src="${r}assets/js/site.js"></script>
  <script>window.CM_CHAT = { webhookUrl: ${JSON.stringify(site.chatWebhook || "")}, whatsapp: ${JSON.stringify(site.whatsapp)} };</script>
  <script src="${r}assets/js/chat.js" defer></script>
</body>
</html>
`;
}

function caseCard(c, r, { cls = "", sizes = "(min-width: 900px) 33vw, 90vw" } = {}) {
  const p = pillarOf(c.category);
  return `
        <article class="case-card ${cls}" data-category="${c.category}" data-tilt>
          <a href="${r}cases/${c.slug}.html" data-cursor-label="Bekijk">
            <div class="case-media">${img(c.img, `${c.client}: ${plain(c.title)}`, { w: 1200, ratio: 4 / 5, sizes })}</div>
            <div class="case-meta">
              <span class="mono">${p.title} · ${c.year}</span>
              <h3>${rich(c.title)}</h3>
              <span class="case-client">${esc(c.client)}</span>
            </div>
          </a>
        </article>`;
}

function pageHero({ eyebrow, title, text, image, r }) {
  return `
  <section class="page-hero${image ? " has-image" : ""}">
    ${image ? `<div class="page-hero-media" data-parallax>${img(image, "", { w: 2200, eager: true })}</div>` : ""}
    <div class="wrap">
      <p class="eyebrow" data-reveal>${eyebrow}</p>
      <h1 class="display-xl" data-split>${split(title)}</h1>
      ${text ? `<p class="lead" data-reveal>${text}</p>` : ""}
    </div>
  </section>`;
}

function stepsBlock() {
  return `
  <section class="section steps">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow" data-reveal>Werkwijze</p>
        <h2 class="display-l" data-split>${split("Van eerste idee|tot *laatste frame*")}</h2>
      </div>
      <ol class="steps-grid">
        ${steps
          .map(
            ([t, d], i) => `
        <li class="step" data-reveal>
          <span class="mono step-no">Scène 0${i + 1}</span>
          <h3>${t}</h3>
          <p>${d}</p>
        </li>`
          )
          .join("")}
      </ol>
    </div>
  </section>`;
}

function homePage() {
  const r = "";
  const featured = cases.slice(0, 6);
  const marquee = services.map((s) => `<span>${esc(s.title)}</span><span class="star">✦</span>`).join("");
  const intro =
    "Ik ben Jacob-Wouter Kaptijn, het gezicht achter Captain Media. Sinds 2016 help ik bedrijven om te laten zien wie ze zijn, wat ze doen en wat ze te bieden hebben, met video, fotografie, design en slimme AI-oplossingen.";
  const body = `
  <section class="hero" data-hero>
    <div class="hero-media">
      <video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="${src(site.heroPoster, 1920)}" data-hero-video>
        <source src="${site.heroVideo}" type="video/mp4">
      </video>
    </div>
    <div class="hero-shade"></div>
    <div class="letterbox top" data-letterbox></div>
    <div class="letterbox bottom" data-letterbox></div>
    <div class="viewfinder" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="hero-hud mono" aria-hidden="true">
      <span class="rec"><span class="rec-dot"></span> REC</span>
      <span data-timecode>00:00:00:00</span>
    </div>
    <div class="wrap hero-content">
      <p class="eyebrow hero-eyebrow">Video / Fotografie / Design</p>
      <h1 class="display-hero" data-split data-split-now>${split("Sterk in *beeld.*|Scherp in *ontwerp.*")}</h1>
      <div class="hero-bottom">
        <p class="lead hero-lead" data-hero-fade>We maken films, foto's en ontwerp met een cinematische blik, voor merken die gezien willen worden.</p>
        <div class="hero-actions" data-hero-fade>
          <a class="btn btn-light" href="cases.html">Bekijk ons werk ${arrow}</a>
          <button class="btn btn-ghost" type="button" data-play="${site.heroVideo}"><span class="play-dot">${play}</span> Showreel</button>
        </div>
      </div>
    </div>
  </section>

  <section class="section intro">
    <div class="wrap intro-grid">
      <figure class="intro-photo" data-reveal>
        ${img(site.ownerPhoto, site.owner, { w: 900, ratio: 4 / 5, sizes: "(min-width: 900px) 34vw, 90vw" })}
        <figcaption><strong>${esc(site.owner)}</strong><span>Oprichter Captain Media</span></figcaption>
      </figure>
      <div class="intro-copy">
        <p class="eyebrow" data-reveal>Over Captain Media</p>
        <h2 class="display-m" data-split>${split("Goed werk begint met|*goed contact.*")}</h2>
        <p class="lead" data-reveal>${esc(intro)}</p>
        <p data-reveal>Je spreekt rechtstreeks met mij, van het eerste idee tot de oplevering. Korte lijnen, eerlijk advies en werk dat bij jouw bedrijf past.</p>
        <a class="link-arrow" href="over-ons.html" data-reveal>Meer over mij ${arrowRight}</a>
      </div>
    </div>
  </section>

  <section class="section disciplines">
    <div class="wrap">
      <div class="section-head center-head">
        <p class="eyebrow" data-reveal>Wat we doen</p>
        <h2 class="display-m" data-split>${split("Vier disciplines.|*Eén* team.")}</h2>
        <p class="lead" data-reveal>Van video en fotografie tot design en AI, alles onder één dak.</p>
      </div>
      <div class="disc-cards">
        ${pillars
          .map(
            (p) => `
        <a class="disc-card" href="diensten.html#${p.key}" data-reveal>
          <div class="disc-card-media">${img(p.img, "", { w: 700, ratio: 4 / 3, sizes: "(min-width: 1100px) 24vw, (min-width: 640px) 46vw, 92vw" })}</div>
          <div class="disc-card-body">
            <span class="mono disc-no">${p.no}</span>
            <h3>${p.title}</h3>
            <span class="disc-card-tags">${services
              .filter((s) => s.pillar === p.key)
              .map((s) => esc(s.title))
              .join(" · ")}</span>
          </div>
        </a>`
          )
          .join("")}
      </div>
      <div class="disc-more" data-reveal><a class="link-arrow" href="diensten.html">Alle diensten ${arrowRight}</a></div>
    </div>
  </section>

  <section class="hscroll" data-hscroll>
    <div class="hscroll-sticky">
      <div class="wrap hscroll-head">
        <div>
          <p class="eyebrow">Uitgelicht werk</p>
          <h2 class="display-l" data-split>${split("Cases die *spreken*")}</h2>
        </div>
        <div class="hscroll-progress" aria-hidden="true"><span data-hscroll-bar></span></div>
      </div>
      <div class="hscroll-track" data-hscroll-track>
        ${featured.map((c) => caseCard(c, r, { cls: "case-wide", sizes: "(min-width: 900px) 34vw, 80vw" })).join("")}
        <a class="case-more" href="cases.html"><span>Alle cases</span> ${arrow}</a>
      </div>
    </div>
  </section>

  <section class="marquee" aria-label="Onze diensten">
    <div class="marquee-track"><div>${marquee}</div><div aria-hidden="true">${marquee}</div></div>
  </section>

  ${stepsBlock()}

  <section class="section why">
    <div class="wrap why-grid">
      <div class="why-media" data-parallax>${img("1485846234645-a62644f84728", "Klapbord op een filmset", { w: 1400, ratio: 4 / 5, sizes: "(min-width: 900px) 45vw, 90vw" })}</div>
      <div>
        <p class="eyebrow" data-reveal>Waarom Captain Media</p>
        <h2 class="display-l" data-split>${split("Eén team, *één stijl*")}</h2>
        <ul class="why-list">
          <li data-reveal><h3>Alles onder één dak</h3><p>Video, fotografie en design door hetzelfde team. Daardoor ziet je campagne er overal hetzelfde uit, van poster tot Reel.</p></li>
          <li data-reveal><h3>Cinematisch, niet standaard</h3><p>We denken als filmmakers: in licht, ritme en verhaal. Ook een productfoto of flyer krijgt die aandacht.</p></li>
          <li data-reveal><h3>Kort en duidelijk</h3><p>Eén aanspreekpunt, een vaste prijs vooraf en korte lijnen. Bellen of appen mag altijd.</p></li>
        </ul>
      </div>
    </div>
  </section>

  ${ctaBlock(r)}`;
  return layout({
    title: "Captain Media | Video, fotografie, design & AI",
    desc: "Captain Media maakt cinematische video, fotografie en grafisch ontwerp, en helpt bedrijven slimmer werken met AI. Sterk in beeld. Scherp in ontwerp.",
    body,
    bodyClass: "page-home",
  });
}

function casesPage() {
  const r = "";
  const count = (k) => cases.filter((c) => c.category === k).length;
  const body = `
  ${pageHero({ eyebrow: "Cases", title: "Werk waar we *trots* op zijn", text: "Een selectie van onze producties in video, fotografie en design. Elk project begint met een verhaal en eindigt met beelden die werken.", r })}
  <section class="section cases-index">
    <div class="wrap">
      <div class="filters" role="group" aria-label="Filter cases" data-filters>
        <button type="button" class="filter is-active" data-filter="all" aria-pressed="true">Alles <sup>${cases.length}</sup></button>
        ${pillars.filter((p) => count(p.key)).map((p) => `<button type="button" class="filter" data-filter="${p.key}" aria-pressed="false">${p.title} <sup>${count(p.key)}</sup></button>`).join("")}
      </div>
      <div class="cases-grid" data-cases-grid>
        ${cases.map((c) => caseCard(c, r)).join("")}
      </div>
    </div>
  </section>
  ${ctaBlock(r, "Jouw project *hier?*")}`;
  return layout({ title: "Cases | Captain Media", desc: "Bekijk de video-, fotografie- en designprojecten van Captain Media.", current: "cases", body });
}

function casePage(c, i) {
  const r = "../";
  const next = cases[(i + 1) % cases.length];
  const p = pillarOf(c.category);
  const svc = c.services.map(serviceBy);
  const body = `
  <section class="case-hero">
    <div class="case-hero-media" data-parallax>${img(c.img, "", { w: 2200, eager: true })}</div>
    <div class="wrap">
      <a class="back mono" href="${r}cases.html">← Alle cases</a>
      <p class="eyebrow" data-reveal>${esc(c.client)}</p>
      <h1 class="display-xl" data-split data-split-now>${split(c.title)}</h1>
    </div>
  </section>
  <section class="section case-body">
    <div class="wrap">
      <dl class="case-facts" data-reveal>
        <div><dt>Klant</dt><dd>${esc(c.client)}</dd></div>
        <div><dt>Discipline</dt><dd>${p.title}</dd></div>
        <div><dt>Diensten</dt><dd>${svc.map((s) => `<a href="${r}diensten/${s.slug}.html">${esc(s.title)}</a>`).join(", ")}</dd></div>
        <div><dt>Jaar</dt><dd>${c.year}</dd></div>
      </dl>
      <p class="case-summary" data-reveal>${esc(c.summary)}</p>
      <div class="case-chapters">
        <div class="chapter" data-reveal><span class="mono">01 · De vraag</span><p>${esc(c.vraag)}</p></div>
        <div class="chapter" data-reveal><span class="mono">02 · De aanpak</span><p>${esc(c.aanpak)}</p></div>
        <div class="chapter" data-reveal><span class="mono">03 · Het resultaat</span><p>${esc(c.resultaat)}</p></div>
      </div>
    </div>
  </section>
  <section class="case-film">
    <div class="wrap">
      ${c.video
        ? `<button class="film-frame" type="button" data-play="${esc(c.video)}" data-cursor-label="Afspelen" aria-label="Video van ${esc(c.client)} afspelen">
        ${img(c.gallery[0], "", { w: 2000, ratio: 16 / 9, sizes: "(min-width: 1400px) 1320px, 94vw" })}
        <span class="film-play">${play}</span>
        <span class="film-hud mono"><span class="rec-dot"></span> ${esc(c.client.toUpperCase())} · ${c.year}</span>
      </button>`
        : `<figure class="film-frame is-still">
        ${img(c.gallery[0], `${esc(c.client)}`, { w: 2000, ratio: 16 / 9, sizes: "(min-width: 1400px) 1320px, 94vw" })}
        <span class="film-hud mono"><span class="rec-dot"></span> ${esc(c.client.toUpperCase())} · ${c.year}</span>
      </figure>`}
    </div>
  </section>
  <section class="section gallery">
    <div class="wrap gallery-grid">
      ${c.gallery
        .slice(1)
        .concat([c.img])
        .map((g, n) => `<figure class="g-item g-${n}" data-reveal>${img(g, `${c.client}, beeld ${n + 1}`, { w: 1400, ratio: n === 2 ? 21 / 9 : 4 / 5, sizes: n === 2 ? "94vw" : "(min-width: 900px) 46vw, 94vw" })}</figure>`)
        .join("")}
    </div>
  </section>
  <section class="next-case">
    <a href="${r}cases/${next.slug}.html" class="wrap next-link" data-cursor-label="Volgende">
      <span class="mono">Volgende case</span>
      <span class="next-title">${rich(next.title)}</span>
      <span class="next-client">${esc(next.client)} ${arrow}</span>
    </a>
  </section>`;
  return layout({ title: `${plain(c.title)} | ${c.client} | Captain Media`, desc: c.summary, r, current: "cases", body });
}

function dienstenPage() {
  const r = "";
  const body = `
  ${pageHero({ eyebrow: "Diensten", title: "Video, foto, design|*en AI*", text: "Veertien diensten, één team. Kies wat je nodig hebt, of combineer disciplines: van een campagne die overal hetzelfde voelt tot AI die je klanten 24/7 helpt.", r })}
  ${pillars
    .map(
      (p, i) => `
  <section class="section pillar${i % 2 ? " flip" : ""}" id="${p.key}">
    <div class="wrap pillar-grid">
      <div class="pillar-media" data-parallax data-tilt>${img(p.img, p.title, { w: 1400, ratio: 4 / 5, sizes: "(min-width: 900px) 45vw, 94vw" })}</div>
      <div>
        <p class="eyebrow" data-reveal>${p.no} · ${p.lead}</p>
        <h2 class="display-l" data-split>${split(p.title)}</h2>
        <p class="lead" data-reveal>${p.text}</p>
        <ul class="svc-list">
          ${services
            .filter((s) => s.pillar === p.key)
            .map((s) => `<li data-reveal><a href="${r}diensten/${s.slug}.html"><span><strong>${esc(s.title)}</strong><small>${esc(s.short)}</small></span>${arrow}</a></li>`)
            .join("")}
        </ul>
      </div>
    </div>
  </section>`
    )
    .join("")}
  ${ctaBlock(r)}`;
  return layout({ title: "Diensten | Captain Media", desc: "Bedrijfsfilms, short form content, wervingsvideo's, aftermovies, fotografie, grafisch ontwerp en AI-oplossingen zoals chatbots en automatiseringen door Captain Media.", current: "diensten", body });
}

function servicePage(s) {
  const r = "../";
  const p = pillarOf(s.pillar);
  const siblings = services.filter((x) => x.pillar === s.pillar && x.slug !== s.slug);
  const related = cases.filter((c) => c.services.includes(s.slug)).concat(cases.filter((c) => c.category === s.pillar && !c.services.includes(s.slug))).slice(0, 3);
  const body = `
  <section class="page-hero has-image svc-hero">
    <div class="page-hero-media" data-parallax>${img(s.img, "", { w: 2200, eager: true })}</div>
    <div class="wrap">
      <nav class="crumbs mono" aria-label="Kruimelpad"><a href="${r}diensten.html">Diensten</a> / <a href="${r}diensten.html#${p.key}">${p.title}</a> / <span aria-current="page">${esc(s.title)}</span></nav>
      <h1 class="display-xl" data-split data-split-now>${split(s.heading)}</h1>
      <p class="lead" data-reveal>${esc(s.short)}</p>
      <div class="hero-actions" data-reveal>
        <a class="btn btn-light" href="${r}contact.html?dienst=${s.slug}">Vraag een offerte aan ${arrow}</a>
        <a class="btn btn-ghost" href="${site.whatsapp}" target="_blank" rel="noopener">${waIcon} WhatsApp</a>
      </div>
    </div>
  </section>
  <section class="section svc-intro">
    <div class="wrap svc-intro-grid">
      <p class="eyebrow" data-reveal>${p.no} · ${p.title}</p>
      <p class="intro-text" data-reveal>${esc(s.intro)}</p>
    </div>
  </section>
  <section class="section deliver">
    <div class="wrap">
      <div class="section-head"><p class="eyebrow" data-reveal>Wat je krijgt</p><h2 class="display-l" data-split>${split("Alles voor een *scherp* resultaat")}</h2></div>
      <ul class="deliver-grid">
        ${s.deliverables.map((d, i) => `<li data-reveal><span class="mono">${String(i + 1).padStart(2, "0")}</span>${esc(d)}</li>`).join("")}
      </ul>
    </div>
  </section>
  ${stepsBlock()}
  ${
    related.length
      ? `<section class="section related">
    <div class="wrap">
      <div class="section-head split-head"><div><p class="eyebrow" data-reveal>Gerelateerd werk</p><h2 class="display-l" data-split>${split("Bekijk het *in actie*")}</h2></div><a class="link-arrow" href="${r}cases.html" data-reveal>Alle cases ${arrowRight}</a></div>
      <div class="cases-grid">${related.map((c) => caseCard(c, r)).join("")}</div>
    </div>
  </section>`
      : ""
  }
  <section class="section faq">
    <div class="wrap faq-grid">
      <div><p class="eyebrow" data-reveal>Veelgestelde vragen</p><h2 class="display-l" data-split>${split("Goed om te *weten*")}</h2></div>
      <div class="faq-list">
        ${s.faqs.map(([q, a]) => `<details class="faq-item" data-reveal><summary>${esc(q)}<span class="plus" aria-hidden="true"></span></summary><div class="faq-a"><p>${esc(a)}</p></div></details>`).join("")}
      </div>
    </div>
  </section>
  <section class="section siblings">
    <div class="wrap">
      <p class="eyebrow" data-reveal>Meer ${p.title.toLowerCase()}</p>
      <ul class="svc-list svc-list-row">
        ${siblings.map((x) => `<li data-reveal><a href="${r}diensten/${x.slug}.html"><span><strong>${esc(x.title)}</strong><small>${esc(x.short)}</small></span>${arrow}</a></li>`).join("")}
      </ul>
    </div>
  </section>
  ${ctaBlock(r)}`;
  return layout({ title: `${s.title} | Captain Media`, desc: `${s.short} ${s.title} door Captain Media.`, r, current: "diensten", body });
}

function overPage() {
  const r = "";
  const body = `
  ${pageHero({ eyebrow: "Over ons", title: "Goed werk begint|met *begrijpen*", text: "Ik ben Jacob-Wouter Kaptijn, het gezicht achter Captain Media. Goed werk begint met begrijpen wat jouw bedrijf nodig heeft.", r, image: "/assets/img/about-hero.jpg" })}
  <section class="section story">
    <div class="wrap story-grid">
      <div class="story-media" data-parallax>${img("/assets/img/about-on-set.jpg", "Jacob-Wouter Kaptijn met camera op een opnamelocatie", { w: 1200, ratio: 4 / 5, sizes: "(min-width: 900px) 40vw, 94vw" })}</div>
      <div>
        <p class="eyebrow" data-reveal>Wie ik ben</p>
        <h2 class="display-l" data-split>${split("Het gezicht achter *Captain Media*")}</h2>
        <p class="intro-text" data-reveal>Sinds 2016 ben ik bezig met beeld en vormgeving. Wat mij daarin het meeste aanspreekt? Iets maken dat een bedrijf verder helpt.</p>
        <p data-reveal> Een website die meer aanvragen oplevert, video’s die de juiste mensen bereiken of een slimmer proces dat iedere week tijd bespaart.</p>
        <p data-reveal>Daarom kijk ik graag verder dan de opdracht alleen. Hoe komen klanten bij je terecht? Wat overtuigt hen om voor jou te kiezen? En waar blijven kansen liggen? Ik leer jouw bedrijf graag kennen, denk persoonlijk mee en maak de vertaalslag naar concrete verbeteringen.</p>
      </div>
    </div>
  </section>
  <section class="section values">
    <div class="wrap">
      <div class="section-head"><p class="eyebrow" data-reveal>Wat ik doe</p><h2 class="display-l" data-split>${split("Van een sterkere uitstraling|naar *meer resultaat*")}</h2></div>
      <div class="values-grid">
        <div class="value" data-reveal data-tilt><span class="mono">01</span><h3>Zichtbaar worden</h3><p>Met video, fotografie, design en websites help ik bedrijven om zichtbaar te worden en hun verhaal duidelijk over te brengen. Van korte video’s voor social media en bedrijfsfotografie tot verpakkingen en een website waarop bezoekers makkelijk vinden wat ze zoeken én contact opnemen.</p></div>
        <div class="value" data-reveal data-tilt><span class="mono">02</span><h3>Het doel voor ogen</h3><p>Meer passende aanvragen, nieuwe klanten en ruimte om te groeien. Mooi werk trekt aandacht; de inhoud en de uitwerking moeten vervolgens helpen om die aandacht om te zetten in actie.</p></div>
        <div class="value" data-reveal data-tilt><span class="mono">03</span><h3>Slim achter de schermen</h3><p>Met praktische AI-oplossingen en automatiseringen kunnen we terugkerende taken vereenvoudigen, klantvragen sneller afhandelen en processen beter laten aansluiten. Zo blijft er meer tijd over voor jouw klanten en het ondernemen zelf.</p></div>
      </div>
    </div>
  </section>
  <section class="section story story-alt">
    <div class="wrap story-grid">
      <div>
        <p class="eyebrow" data-reveal>Samenwerken</p>
        <h2 class="display-l" data-split>${split("Persoonlijk betrokken, *met korte lijnen*")}</h2>
        <p class="intro-text" data-reveal>Ik houd van laagdrempelig contact.</p>
        <p data-reveal>Even bellen, een appje sturen of samen aan tafel om ideeën door te nemen. Je spreekt rechtstreeks met mij en hoeft geen uitgewerkt plan klaar te hebben. Vertel waar je naartoe wilt of waar je tegenaan loopt, dan kijken we samen wat er nodig is.</p>
        <p data-reveal>Ik stel vragen, geef eerlijk advies en denk ook mee over kansen die buiten de oorspronkelijke opdracht liggen. Het liefst bouw ik aan een langdurige samenwerking waarin ik jouw bedrijf steeds beter leer kennen en gericht kan bijdragen aan de volgende stap.</p>
      </div>
      <div class="story-media" data-parallax>${img("/assets/img/jacob-wouter.jpg", "Jacob-Wouter Kaptijn, oprichter van Captain Media", { w: 1200, ratio: 4 / 5, sizes: "(min-width: 900px) 40vw, 94vw" })}</div>
    </div>
  </section>
  ${stepsBlock()}
  ${ctaBlock(r, "Zullen we *kennismaken?*")}`;
  return layout({ title: "Over ons | Captain Media", desc: "Ik ben Jacob-Wouter Kaptijn, het gezicht achter Captain Media. Video, fotografie, design, websites en slimme automatiseringen die je bedrijf verder helpen.", current: "over", body });
}

function contactPage() {
  const r = "";
  const options = services.map((s) => `<label class="chip"><input type="checkbox" name="dienst" value="${s.slug}"><span>${esc(s.title)}</span></label>`).join("");
  const body = `
  ${pageHero({ eyebrow: "Contact", title: "Vertel ons je *verhaal*", text: "Vul het draaiboek hieronder in, of stuur direct een WhatsApp. Binnen één werkdag hoor je van ons.", r })}
  <section class="section contact">
    <div class="wrap contact-grid">
      <form class="brief" data-form novalidate>
        <div class="brief-top"><span class="mono">Draaiboek · nieuw project</span><span class="mono" data-timecode-static>SCÈNE 01</span></div>
        <div class="field-row">
          <div class="field"><label for="f-naam">Naam</label><input id="f-naam" name="naam" autocomplete="name" required><p class="err" id="e-naam">Vul je naam in.</p></div>
          <div class="field"><label for="f-bedrijf">Bedrijf <span class="opt">(optioneel)</span></label><input id="f-bedrijf" name="bedrijf" autocomplete="organization"></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="f-mail">E-mail</label><input id="f-mail" name="email" type="email" autocomplete="email" required><p class="err" id="e-mail">Vul een geldig e-mailadres in.</p></div>
          <div class="field"><label for="f-tel">Telefoon <span class="opt">(optioneel)</span></label><input id="f-tel" name="telefoon" type="tel" autocomplete="tel"></div>
        </div>
        <fieldset class="field">
          <legend>Waar kunnen we je mee helpen?</legend>
          <div class="chips">${options}</div>
        </fieldset>
        <div class="field">
          <label for="f-bericht">Vertel kort over je project</label>
          <textarea id="f-bericht" name="bericht" rows="5" required></textarea>
          <p class="err" id="e-bericht">Vertel ons kort wat je wilt maken.</p>
        </div>
        <button class="btn btn-accent btn-block" type="submit">Verstuur draaiboek ${arrow}</button>
        <div class="form-success" role="status" hidden>
          <h3>Bedankt, <em>we gaan aan de slag.</em></h3>
          <p>Je bericht is ontvangen. Binnen één werkdag nemen we contact met je op.</p>
        </div>
      </form>
      <aside class="contact-aside">
        ${callsheet(r)}
      </aside>
    </div>
  </section>`;
  return layout({ title: "Contact | Captain Media", desc: "Neem contact op met Captain Media voor video, fotografie of design.", current: "contact", body });
}

function cmsCsv() {
  const cols = ["Name", "Slug", "Client", "Category", "Services", "Year", "Main image", "Gallery", "Summary", "Vraag", "Aanpak", "Resultaat"];
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = cases.map((c) =>
    [plain(c.title), c.slug, c.client, pillarOf(c.category).title, c.services.map((s) => serviceBy(s).title).join("; "), c.year, src(c.img, 2000), c.gallery.map((g) => src(g, 2000)).join("; "), c.summary, c.vraag, c.aanpak, c.resultaat].map(q).join(",")
  );
  return [cols.map(q).join(","), ...rows].join("\n") + "\n";
}

function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

if (existsSync(join(ROOT, "cases"))) rmSync(join(ROOT, "cases"), { recursive: true });
if (existsSync(join(ROOT, "diensten"))) rmSync(join(ROOT, "diensten"), { recursive: true });

write("index.html", homePage());
write("cases.html", casesPage());
cases.forEach((c, i) => write(`cases/${c.slug}.html`, casePage(c, i)));
write("diensten.html", dienstenPage());
services.forEach((s) => write(`diensten/${s.slug}.html`, servicePage(s)));
write("over-ons.html", overPage());
write("contact.html", contactPage());
write("webflow-cms-cases.csv", cmsCsv());
mkdirSync(join(ROOT, "assets/vendor"), { recursive: true });
copyFileSync(join(ROOT, "node_modules/motion/dist/motion.js"), join(ROOT, "assets/vendor/motion.js"));

console.log(`Built ${4 + cases.length + services.length + 1} pages.`);

if (process.argv.includes("--public")) {
  const out = join(ROOT, "public");
  rmSync(out, { recursive: true, force: true });
  const entries = ["index.html", "cases.html", "diensten.html", "over-ons.html", "contact.html", "cases", "diensten", "assets"];
  for (const e of entries) cpSync(join(ROOT, e), join(out, e), { recursive: true });
  console.log("Copied site to public/ for deployment.");
}
