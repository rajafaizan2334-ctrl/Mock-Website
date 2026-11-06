(() => {
  const M = window.Motion;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const EASE = [0.22, 1, 0.36, 1];

  if (!M) {
    document.documentElement.classList.remove("js");
    return;
  }
  const { animate, scroll, inView, stagger } = M;

  /* Header */
  const header = $("[data-header]");
  let lastY = window.scrollY;
  const megaWrap = $("[data-mega]");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    const megaOpen = megaWrap && megaWrap.classList.contains("open");
    header.classList.toggle("is-hidden", y > lastY && y > 400 && !megaOpen && !document.body.classList.contains("menu-open"));
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mega menu */
  if (megaWrap) {
    const btn = $("[data-mega-toggle]", megaWrap);
    const panel = $("[data-mega-panel]", megaWrap);
    let closeTimer;
    const open = () => {
      clearTimeout(closeTimer);
      if (megaWrap.classList.contains("open")) return;
      megaWrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
      header.classList.add("is-solid");
      if (!reduced) {
        animate(panel, { opacity: [0, 1], y: [-10, 0] }, { duration: 0.35, ease: EASE });
        animate($$(".mega-col", panel), { opacity: [0, 1], y: [12, 0] }, { duration: 0.45, ease: EASE, delay: stagger(0.05) });
      }
    };
    const close = (instant) => {
      if (!megaWrap.classList.contains("open")) return;
      megaWrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      const done = () => panel.classList.remove("is-open");
      if (reduced || instant) return done();
      animate(panel, { opacity: 0, y: -6 }, { duration: 0.2, ease: "easeIn" }).then(() => {
        if (!megaWrap.classList.contains("open")) done();
      });
    };
    btn.addEventListener("click", () => (megaWrap.classList.contains("open") ? close() : open()));
    if (finePointer) {
      megaWrap.addEventListener("pointerenter", open);
      megaWrap.addEventListener("pointerleave", () => (closeTimer = setTimeout(close, 180)));
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && megaWrap.classList.contains("open")) {
        close(true);
        btn.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!megaWrap.contains(e.target)) close();
    });
    megaWrap.addEventListener("focusout", (e) => {
      if (!megaWrap.contains(e.relatedTarget)) close();
    });
  }

  /* Mobile menu */
  const burger = $("[data-burger]");
  const mobile = $("[data-mobile-menu]");
  if (burger && mobile) {
    const setOpen = (isOpen) => {
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
      document.body.classList.toggle("menu-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
      if (isOpen) {
        mobile.hidden = false;
        header.classList.add("is-solid");
        if (!reduced) {
          animate(mobile, { opacity: [0, 1] }, { duration: 0.3 });
          animate($$(".m-link, .m-foot", mobile), { opacity: [0, 1], y: [24, 0] }, { duration: 0.5, ease: EASE, delay: stagger(0.05, { startDelay: 0.05 }) });
        }
      } else {
        mobile.hidden = true;
      }
    };
    burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });
  }

  /* Split headings */
  const splitIn = (el, delay = 0) =>
    animate($$(".wi", el), { y: ["105%", "0%"] }, { duration: reduced ? 0 : 1, ease: EASE, delay: stagger(0.06, { startDelay: delay }) });

  const hero = $("[data-hero]");
  $$("[data-split]").forEach((el) => {
    if (hero && hero.contains(el)) return;
    if (el.hasAttribute("data-split-now")) splitIn(el, 0.15);
    else inView(el, () => splitIn(el), { amount: 0.4 });
  });

  /* Reveal */
  let batch = 0;
  let batchTimer;
  inView(
    "[data-reveal]",
    (el) => {
      const delay = Math.min(batch++ * 0.08, 0.4);
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => (batch = 0), 120);
      animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: reduced ? 0 : 0.8, ease: EASE, delay });
    },
    { amount: 0.15 }
  );

  /* Hero */
  if (hero) {
    const video = $("[data-hero-video]", hero);
    const bars = $$("[data-letterbox]", hero);
    const title = $("[data-split]", hero);
    const extras = $$(".hero-eyebrow, .hero-hud, .viewfinder, .hero-scroll", hero);
    const fades = $$("[data-hero-fade]", hero);

    if (reduced) {
      video.removeAttribute("autoplay");
      video.pause();
      splitIn(title);
    } else {
      bars[0].style.transformOrigin = "top";
      bars[1].style.transformOrigin = "bottom";
      animate(bars, { scaleY: [1, 0] }, { duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.15 });
      animate(extras, { opacity: [0, 1] }, { duration: 0.8, delay: stagger(0.08, { startDelay: 0.9 }) });
      splitIn(title, 0.75);
      animate(fades, { opacity: [0, 1], y: [20, 0] }, { duration: 0.9, ease: EASE, delay: stagger(0.1, { startDelay: 1.25 }) });
      scroll(animate(video, { y: [0, 180], scale: [1.08, 1.18] }, { ease: "linear" }), { target: hero, offset: ["start start", "end start"] });
      scroll(animate($(".hero-content", hero), { y: [0, -80], opacity: [1, 0.2] }, { ease: "linear" }), { target: hero, offset: ["start start", "end start"] });
    }

    const tc = $("[data-timecode]", hero);
    let raf;
    const start = performance.now();
    const pad = (n) => String(n).padStart(2, "0");
    const tick = (now) => {
      const f = Math.floor(((now - start) / 1000) * 25);
      const s = Math.floor(f / 25);
      tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 25)}`;
      raf = requestAnimationFrame(tick);
    };
    inView(hero, () => {
      if (!reduced) {
        raf = requestAnimationFrame(tick);
        video.play().catch(() => {});
      }
      return () => {
        cancelAnimationFrame(raf);
        video.pause();
      };
    });
  }

  /* Parallax */
  if (!reduced) {
    $$("[data-parallax]").forEach((el) => {
      const media = $("img", el);
      if (!media) return;
      scroll(animate(media, { y: ["-7%", "7%"] }, { ease: "linear" }), { target: el, offset: ["start end", "end start"] });
    });
  }

  /* Manifest words */
  const words = $("[data-words]");
  if (words && !reduced) {
    const spans = $$("span", words);
    let lit = -1;
    scroll(
      (p) => {
        const n = Math.round(p * spans.length);
        if (n === lit) return;
        for (let i = 0; i < spans.length; i++) spans[i].classList.toggle("on", i < n);
        lit = n;
      },
      { target: words, offset: ["start 0.85", "end 0.55"] }
    );
  }

  /* Disciplines hover preview */
  const preview = $("[data-disc-preview]");
  if (preview && finePointer && !reduced) {
    const pImg = $("img", preview);
    const rows = $$(".disc-row");
    let visible = false;
    const move = (e) => animate(preview, { x: e.clientX + 24, y: e.clientY - 180 }, { duration: 0.6, ease: EASE });
    rows.forEach((row) => {
      row.addEventListener("pointerenter", (e) => {
        if (window.innerWidth < 1100) return;
        pImg.src = row.dataset.img;
        if (!visible) animate(preview, { x: e.clientX + 24, y: e.clientY - 180 }, { duration: 0 });
        visible = true;
        animate(preview, { opacity: 1, scale: [0.85, 1], rotate: [-4, 0] }, { duration: 0.45, ease: EASE });
      });
      row.addEventListener("pointermove", move);
    });
    $("[data-disc]").addEventListener("pointerleave", () => {
      visible = false;
      animate(preview, { opacity: 0, scale: 0.9 }, { duration: 0.25 });
    });
  }

  /* Pinned horizontal cases */
  const hs = $("[data-hscroll]");
  if (hs) {
    const track = $("[data-hscroll-track]", hs);
    const bar = $("[data-hscroll-bar]", hs);
    const mq = window.matchMedia("(min-width: 900px)");
    let cancels = [];
    const teardown = () => {
      cancels.forEach((c) => c());
      cancels = [];
      hs.classList.remove("is-pinned");
      hs.style.height = "";
      track.style.transform = "";
    };
    const setup = () => {
      teardown();
      if (!mq.matches || reduced) return;
      hs.classList.add("is-pinned");
      const dist = Math.max(0, track.scrollWidth - window.innerWidth);
      hs.style.height = `${dist + window.innerHeight}px`;
      cancels.push(scroll(animate(track, { x: [0, -dist] }, { ease: "linear" }), { target: hs }));
      cancels.push(scroll(animate(bar, { scaleX: [0, 1] }, { ease: "linear" }), { target: hs }));
    };
    setup();
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(setup, 200);
    });
  }

  /* Tilt */
  if (finePointer && !reduced) {
    $$("[data-tilt]").forEach((el) => {
      const target = el.querySelector(".case-media") || el;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        animate(target, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 1000 }, { type: "spring", stiffness: 180, damping: 22 });
      });
      el.addEventListener("pointerleave", () => animate(target, { rotateY: 0, rotateX: 0 }, { type: "spring", stiffness: 140, damping: 18 }));
    });
  }

  /* Cursor label */
  const cursor = $("[data-cursor]");
  if (cursor && finePointer && !reduced) {
    const label = $("span", cursor);
    let shown = false;
    window.addEventListener(
      "pointermove",
      (e) => {
        if (shown) animate(cursor, { x: e.clientX, y: e.clientY }, { duration: 0.35, ease: EASE });
        else animate(cursor, { x: e.clientX, y: e.clientY }, { duration: 0 });
      },
      { passive: true }
    );
    $$("[data-cursor-label]").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        label.textContent = el.dataset.cursorLabel;
        shown = true;
        animate(cursor, { opacity: 1, scale: 1 }, { type: "spring", stiffness: 300, damping: 24 });
      });
      el.addEventListener("pointerleave", () => {
        shown = false;
        animate(cursor, { opacity: 0, scale: 0.3 }, { duration: 0.2 });
      });
    });
  }

  /* Case filters */
  const filters = $("[data-filters]");
  if (filters) {
    const cards = $$("[data-cases-grid] .case-card");
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      $$("[data-filter]", filters).forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      const f = btn.dataset.filter;
      const show = [];
      cards.forEach((c) => {
        const match = f === "all" || c.dataset.category === f;
        c.classList.toggle("is-hidden", !match);
        if (match) show.push(c);
      });
      if (!reduced) animate(show, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: EASE, delay: stagger(0.06) });
    });
  }

  /* Video modal */
  const modal = $("[data-modal]");
  if (modal) {
    const mv = $("[data-modal-video]", modal);
    const frame = $("[data-modal-embed]", modal);
    let opener;
    // YouTube / Vimeo links play in an iframe, everything else as an MP4 file
    const embedUrl = (url) => {
      const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
      if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`;
      const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
      if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1${vm[2] ? "&h=" + vm[2] : ""}`;
      return null;
    };
    const closeModal = () => {
      mv.pause();
      mv.removeAttribute("src");
      mv.load();
      if (frame) { frame.src = "about:blank"; frame.hidden = true; }
      mv.hidden = false;
      modal.hidden = true;
      document.body.style.overflow = "";
      if (opener) opener.focus();
    };
    $$("[data-play]").forEach((b) =>
      b.addEventListener("click", () => {
        opener = b;
        const url = b.dataset.play;
        const embed = frame && embedUrl(url);
        if (embed) {
          mv.hidden = true;
          frame.hidden = false;
          frame.src = embed;
        } else {
          if (frame) frame.hidden = true;
          mv.hidden = false;
          mv.src = url;
          mv.play().catch(() => {});
        }
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (!reduced) animate(modal, { opacity: [0, 1] }, { duration: 0.3 });
        $("[data-modal-close]", modal).focus();
      })
    );
    $("[data-modal-close]", modal).addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* FAQ */
  $$(".faq-item").forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open && !reduced) animate($(".faq-a", d), { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35, ease: EASE });
    })
  );

  /* Form */
  const form = $("[data-form]");
  if (form) {
    const pre = new URLSearchParams(location.search).get("dienst");
    if (pre) {
      const box = form.querySelector(`input[name="dienst"][value="${CSS.escape(pre)}"]`);
      if (box) box.checked = true;
    }
    const checks = [
      ["f-naam", "e-naam", (v) => v.trim().length > 1],
      ["f-mail", "e-mail", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
      ["f-bericht", "e-bericht", (v) => v.trim().length > 4],
    ];
    const validate = (id, errId, test) => {
      const input = document.getElementById(id);
      const ok = test(input.value);
      input.closest(".field").classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok) input.setAttribute("aria-describedby", errId);
      else input.removeAttribute("aria-describedby");
      return ok;
    };
    checks.forEach(([id, errId, test]) => {
      const input = document.getElementById(id);
      input.addEventListener("blur", () => input.value && validate(id, errId, test));
      input.addEventListener("input", () => input.closest(".field").classList.contains("has-error") && validate(id, errId, test));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = checks.map((c) => validate(...c));
      const firstBad = checks.find((c, i) => !results[i]);
      if (firstBad) {
        document.getElementById(firstBad[0]).focus();
        return;
      }
      const ok = $(".form-success", form);
      ok.hidden = false;
      if (!reduced) animate(ok, { opacity: [0, 1] }, { duration: 0.5 });
    });
  }

  /* Page transitions */
  const curtain = $("[data-curtain]");
  if (curtain && !reduced) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.protocol.indexOf("http") !== 0 && url.protocol !== "file:") return;
      if (url.pathname === location.pathname && url.hash) return;
      if (!/\.html$|\/$/.test(url.pathname)) return;
      e.preventDefault();
      animate(curtain, { opacity: [0, 1] }, { duration: 0.3, ease: "easeOut" }).then(() => (location.href = a.href));
    });
    window.addEventListener("pageshow", () => (curtain.style.opacity = "0"));
  }
})();
