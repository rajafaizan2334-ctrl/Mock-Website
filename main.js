/**
 * CAPTAIN MEDIA — MAIN CLIENT LOGIC & MOTION CONTROLLER
 * Crafted for high-end cinematic experience
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Case Studies CMS Data Store (Simulates Webflow CMS Collection)
  // =========================================================================
  const caseStudiesData = [
    {
      id: "case-1",
      category: "video",
      title: "Kracht op Open Water: Een Merkfilm Vol Emotie",
      client: "De Vries Maritiem",
      location: "Urk / IJsselmeer",
      tag: "Bedrijfsfilm • 4K Cinema",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
      synopsis: "Voor scheepsbouwer De Vries Maritiem produceerden we een meeslepende corporate film waarin vakmanschap, maritieme traditie en innovatieve techniek samenkomen. Geschoten met Sony FX6 cinema camera's en 5.1K drone opnamen tijdens zonsopgang op het IJsselmeer.",
      challenge: "De maritieme sector kampt met een traditioneel imago. De opdracht was om jonge technici te enthousiasmeren en tegelijkertijd internationale afnemers te overtuigen van ongeëvenaarde bouwkwaliteit.",
      solution: "Geen standaard interviews, maar een dynamische vertelling met macro-shots van laswerk, krachtige sound-design en dramatische beelden van proefvaarten op ruw water.",
      deliverables: ["Hoofdfilm (02:40)", "3x Social Teasers (9:16)", "Fotoset van 40 beelden", "Drone licentiemateriaal"],
      quote: "Captain Media begreep direct onze nuchtere bedrijfscultuur en vertaalde dat naar een film waar onze medewerkers en klanten nog steeds kippenvel van krijgen.",
      author: "Klaas de Vries — Directeur De Vries Maritiem"
    },
    {
      id: "case-2",
      category: "video",
      title: "Werken bij de Toekomst: 14 Nieuwe Collega’s in 3 Weken",
      client: "North Sea Logistics",
      location: "Kampen, Overijssel",
      tag: "Wervingsvideo • Social Ads",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
      synopsis: "Een energieke employer branding campagne met een serie van 4 wervingsvideo's die de hechte sfeer en moderne logistieke vloot van North Sea Logistics in de schijnwerpers zetten.",
      challenge: "Een acuut tekort aan vrachtwagenchauffeurs en warehouse planners binnen een competitieve arbeidsmarkt.",
      solution: "Echte verhalen van huidige medewerkers. Snelle montage, catchy muziek en een gerichte social media advertentiestrategie op Instagram en TikTok.",
      deliverables: ["4x Recruitment Video's (Vertical & Horizontal)", "Landing page video header", "Campagne dashboard support"],
      quote: "Binnen 3 weken ontvingen we 62 sollicitaties en hebben we 14 vacatures ingevuld. Het rendement op deze videoproductie was fenomenaal.",
      author: "Marit Veenstra — HR Manager"
    },
    {
      id: "case-3",
      category: "fotografie",
      title: "Architectonische Zuiverheid: Team & Werkomgeving",
      client: "Lumen Architects",
      location: "Zwolle",
      tag: "Bedrijfsfotografie • Portretten",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
      videoUrl: null,
      synopsis: "Een complete visuele vernieuwing van de beeldbank voor toonaangevend architectenbureau Lumen Architects. Zowel gerealiseerde projecten als portretfotografie van het voltallige ontwerpteam.",
      challenge: "Lumen had prachtige 3D renders, maar miste authentieke beelden van het team in actie en de werkelijke materialen waarmee gewerkt wordt.",
      solution: "Twee dagen on-site shoot met natuurlijk licht, analoge lenzen en een rustige, editorial esthetiek die naadloos aansluit bij hun minimalistische signatuur.",
      deliverables: ["75 Hoge Resolutie Beelden", "Team Headshots", "Detailfotografie materialen & maquettes"],
      quote: "De foto's geven onze nieuwe website direct een exclusieve, redactionele uitstraling. Precies wat we voor ogen hadden.",
      author: "Sjoerd van der Meer — Partner & Architect"
    },
    {
      id: "case-4",
      category: "design",
      title: "Artisan Coffee Blends: Minimalistische Verpakkingslijn",
      client: "Nordic Roast Coffee",
      location: "Amsterdam / Landelijk",
      tag: "Packaging • Drukwerk",
      image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1400&q=80",
      videoUrl: null,
      synopsis: "Volledig nieuw verpakkingsconcept voor een premium specialty coffee merk. Ontwerp van koffiezakken, foliedruk etiketten en verzenddozen met FSC-gecertificeerd papier.",
      challenge: "Opvallen in het premium koffieschap tussen tientallen kleurrijke merken, zonder schreeuwerig over te komen.",
      solution: "Een strakke, typografische esthetiek gecombineerd met tastbaar reliëf en een subtiel kleurcoderingssysteem voor de herkomst van de bonen.",
      deliverables: ["3x Verpakkingsformaten (250g, 1kg, Drip bags)", "Stansmessen & drukwerkbegeleiding", "3D Product Mockups"],
      quote: "Onze retail partners waren direct enthousiast. De verkopen stegen met 42% na de herlancering van deze verpakking.",
      author: "Bram Lindeman — Brand Director"
    },
    {
      id: "case-5",
      category: "video",
      title: "25.000 Bezoekers, 1 Dag: De Officiële Festival Aftermovie",
      client: "Havenfeesten Festival",
      location: "Flevoland",
      tag: "Aftermovie • Event",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
      synopsis: "Een festivalregistratie met 3 camera-operators en een FPV-drone piloot. De aftermovie werd binnen 48 uur na afloop van het evenement gemonteerd en gelanceerd.",
      challenge: "Het vastleggen van de euforische sfeer over een uitgestrekt festivalterrein, met wisselende weersomstandigheden en avondlicht.",
      solution: "Dynamische speed-ramps, live audio opnames van het publiek en adembenemende FPV drone duiken dwars over de mainstage.",
      deliverables: ["Official Aftermovie (03:15)", "10x Instagram Reels", "Foto selectie van 150 highlights"],
      quote: "Binnen 24 uur na release van de aftermovie waren de Early Bird tickets voor volgend jaar al uitverkocht!",
      author: "Jeroen Bakker — Festivalorganisator"
    },
    {
      id: "case-6",
      category: "fotografie",
      title: "Macro Details & E-Commerce Studio Beelden",
      client: "Chronos Timepieces",
      location: "Utrecht",
      tag: "Productfotografie",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
      videoUrl: null,
      synopsis: "Studio productfotografie voor een Nederlands horlogemerk. Extreme macro close-ups van wijzerplaten, geborsteld staal en saffierglas met polarisatiefilters tegen ongewenste reflecties.",
      challenge: "Horloges fotograferen vereist microscopische precisie qua stofvrijheid, belichting en het vangen van de juiste reflecties op metalen oppervlakken.",
      solution: "Focus-stacking techniek gecombineerd met op maat gemaakte diffusers en handmatige color grading.",
      deliverables: ["32 E-commerce packshots (witte achtergrond)", "16 Lifestyle beelden", "Social media banners"],
      quote: "De beelden tonen elk detail van onze horloges zoals het bedoeld is. Absoluut studio-topniveau.",
      author: "Daan van Leeuwen — Oprichter Chronos"
    }
  ];

  // =========================================================================
  // 2. Custom Magnetic Cursor
  // =========================================================================
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth follower loop
    function updateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover interactive state
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .case-card, .service-subcard');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hover-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hover-link'));
    });
  }

  // =========================================================================
  // 3. Header Scroll Glassmorphism State
  // =========================================================================
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('py-3', 'bg-carbon/90', 'shadow-xl');
      header.classList.remove('py-5', 'bg-carbon/75');
    } else {
      header.classList.remove('py-3', 'bg-carbon/90', 'shadow-xl');
      header.classList.add('py-5', 'bg-carbon/75');
    }
  });

  // =========================================================================
  // 4. Hero Video Audio & Playback Controls
  // =========================================================================
  const heroVideo = document.getElementById('hero-video');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (heroVideo && soundBtn) {
    soundBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        soundIcon.className = 'ph-bold ph-speaker-simple-slash text-neon';
        soundLabel.textContent = 'Geluid uit';
      } else {
        soundIcon.className = 'ph-bold ph-speaker-high text-neon';
        soundLabel.textContent = 'Geluid aan';
      }
    });
  }

  // =========================================================================
  // 5. Case Studies Filtering Logic
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active', 'text-black', 'bg-neon'));
      btn.classList.add('active', 'text-black', 'bg-neon');

      const filter = btn.getAttribute('data-filter');

      caseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 6. Case Study Detail Modal (CMS Drawer Simulation)
  // =========================================================================
  const caseModal = document.getElementById('case-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalBody = document.getElementById('modal-body');

  function openCaseModal(caseId) {
    const item = caseStudiesData.find(c => c.id === caseId);
    if (!item) return;

    modalBody.innerHTML = `
      <div class="mb-4">
        <span class="px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon font-mono text-xs uppercase tracking-wider">
          ${item.tag}
        </span>
      </div>
      
      <h2 class="text-2xl sm:text-4xl font-display font-extrabold text-white mb-2 uppercase">
        ${item.title}
      </h2>
      
      <div class="text-xs font-mono text-zinc-400 mb-6 flex items-center gap-2">
        <span>Klant: <strong>${item.client}</strong></span>
        <span>•</span>
        <span>${item.location}</span>
      </div>

      <div class="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-xl bg-black">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="md:col-span-2 space-y-4 text-sm text-zinc-300 leading-relaxed">
          <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">Het Verhaal & Synopsis</h3>
          <p>${item.synopsis}</p>
          <h3 class="text-base font-display font-bold text-white uppercase tracking-wider pt-2">De Uitdaging & Strategie</h3>
          <p>${item.challenge}</p>
          <p>${item.solution}</p>
        </div>

        <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <h4 class="text-xs font-mono uppercase tracking-wider text-neon">Geleverde Deliverables</h4>
          <ul class="text-xs text-zinc-300 space-y-2">
            ${item.deliverables.map(d => `<li class="flex items-center gap-2"><i class="ph-bold ph-check text-neon"></i> ${d}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-black/60 border border-neon/20 mb-6">
        <p class="text-sm italic text-zinc-200">"${item.quote}"</p>
        <div class="text-xs font-mono text-neon mt-2">— ${item.author}</div>
      </div>

      <div class="flex justify-end gap-4 pt-4 border-t border-white/10">
        <a href="#contact" class="px-6 py-3 rounded-full bg-neon text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neon-hover transition-colors" onclick="document.getElementById('case-modal').classList.add('invisible', 'opacity-0');">
          Project Zoals Dit Starten
        </a>
      </div>
    `;

    caseModal.classList.remove('invisible', 'opacity-0');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    caseModal.classList.add('invisible', 'opacity-0');
    document.body.style.overflow = '';
  }

  // Bind to cards
  document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-case-id');
      openCaseModal(caseId);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCaseModal);
  }

  caseModal.addEventListener('click', (e) => {
    if (e.target === caseModal) closeCaseModal();
  });

  // =========================================================================
  // 7. Webflow CMS Demo Simulator
  // =========================================================================
  const addCaseDemoBtn = document.getElementById('add-case-demo-btn');
  if (addCaseDemoBtn) {
    addCaseDemoBtn.addEventListener('click', () => {
      const demoTitle = prompt("Voer een titel in voor de nieuwe case study (bijv. 'Zilte Pracht: Rederij Documentaire'):", "Zilte Pracht: Rederij Documentaire");
      if (!demoTitle) return;

      const newId = `case-${Date.now()}`;
      const newCase = {
        id: newId,
        category: "video",
        title: demoTitle,
        client: "Urk Fishery & Marine",
        location: "Urk / Noordzee",
        tag: "Nieuwe CMS Case • 4K",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
        videoUrl: null,
        synopsis: "Deze case is zojuist dynamisch toegevoegd via de Webflow CMS interface.",
        challenge: "Snelle toevoeging van nieuwe projecten zonder tussenkomst van een developer.",
        solution: "Een gestructureerd Webflow CMS schema met dynamische velden voor video embeds, tags en klantquotes.",
        deliverables: ["CMS Item Live", "Automatische Tag Filtering", "Direct Vindbaar"],
        quote: "Met de Webflow CMS architectuur van Captain Media kunnen we onze nieuwste producties in 2 minuten online zetten.",
        author: "Captain Media Beheerder"
      };

      caseStudiesData.unshift(newCase);

      // Create new HTML card
      const grid = document.getElementById('cases-grid');
      const newCard = document.createElement('article');
      newCard.className = 'case-card group cursor-pointer animate-fade-in';
      newCard.setAttribute('data-category', 'video');
      newCard.setAttribute('data-case-id', newId);

      newCard.innerHTML = `
        <div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface border border-neon/50 transition-all duration-500 shadow-glow-sm">
          <img src="${newCase.image}" alt="${newCase.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/30 to-transparent"></div>
          
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-3 py-1 rounded-full bg-neon text-black font-mono font-bold text-[10px] tracking-wider uppercase">
              NIEUW TOEGEVOEGD
            </span>
          </div>

          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="w-14 h-14 rounded-full bg-neon text-black flex items-center justify-center shadow-glow">
              <i class="ph-fill ph-play text-xl ml-1"></i>
            </div>
          </div>

          <div class="absolute bottom-4 inset-x-4">
            <div class="text-xs font-mono text-zinc-400 mb-1">${newCase.client} • ${newCase.location}</div>
            <h3 class="text-lg font-display font-bold text-white group-hover:text-neon transition-colors">
              ${newCase.title}
            </h3>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>Webflow CMS Demo</span>
          <span class="text-neon font-mono">Bekijk Case <i class="ph ph-arrow-right"></i></span>
        </div>
      `;

      newCard.addEventListener('click', () => openCaseModal(newId));
      grid.prepend(newCard);

      alert("🎉 Succes! De nieuwe case is succesvol aangemaakt in het CMS en bovenaan het portfolio toegevoegd.");
    });
  }

  // =========================================================================
  // 8. Showreel Video Modal
  // =========================================================================
  const showreelModal = document.getElementById('showreel-modal');
  const openShowreelBtn = document.getElementById('open-showreel-btn');
  const closeShowreelBtn = document.getElementById('close-showreel-btn');
  const showreelIframe = document.getElementById('showreel-iframe');

  if (openShowreelBtn && showreelModal) {
    openShowreelBtn.addEventListener('click', () => {
      // Cinematic reel embed
      showreelIframe.src = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";
      showreelModal.classList.remove('invisible', 'opacity-0');
      document.body.style.overflow = 'hidden';
    });

    closeShowreelBtn.addEventListener('click', () => {
      showreelIframe.src = "";
      showreelModal.classList.add('invisible', 'opacity-0');
      document.body.style.overflow = '';
    });

    showreelModal.addEventListener('click', (e) => {
      if (e.target === showreelModal) {
        showreelIframe.src = "";
        showreelModal.classList.add('invisible', 'opacity-0');
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================================================
  // 9. Interactive Project Estimator (Real-Time Price Calculation)
  // =========================================================================
  const serviceCheckboxes = document.querySelectorAll('input[name="calc-service"]');
  const scopeRadios = document.querySelectorAll('input[name="calc-scope"]');
  const calcResult = document.getElementById('calc-result-price');

  function updateEstimate() {
    let baseMin = 0;
    let baseMax = 0;

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        if (cb.value === 'video') {
          baseMin += 1250;
          baseMax += 2200;
        } else if (cb.value === 'fotografie') {
          baseMin += 650;
          baseMax += 1200;
        } else if (cb.value === 'design') {
          baseMin += 450;
          baseMax += 850;
        }
      }
    });

    // Default fallback if none checked
    if (baseMin === 0) {
      baseMin = 750;
      baseMax = 1500;
    }

    let multiplier = 1;
    scopeRadios.forEach(rb => {
      if (rb.checked) {
        multiplier = parseFloat(rb.value);
      }
    });

    let totalMin = Math.round(baseMin * (multiplier === 1 ? 1 : multiplier === 2 ? 1.75 : 2.8));
    let totalMax = Math.round(baseMax * (multiplier === 1 ? 1 : multiplier === 2 ? 1.85 : 3.0));

    calcResult.innerHTML = `€ ${totalMin.toLocaleString('nl-NL')} - € ${totalMax.toLocaleString('nl-NL')} <span class="text-xs text-zinc-400 font-normal">excl. BTW</span>`;
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimate));
  scopeRadios.forEach(rb => rb.addEventListener('change', updateEstimate));

  // =========================================================================
  // 10. Mobile Navigation Toggle & Diensten Accordion
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileDienstenToggle = document.getElementById('mobile-diensten-toggle');
  const mobileDienstenList = document.getElementById('mobile-diensten-list');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });

    // Close on navigation click
    document.querySelectorAll('.mobile-nav-link, #mobile-diensten-list a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  if (mobileDienstenToggle && mobileDienstenList) {
    mobileDienstenToggle.addEventListener('click', () => {
      mobileDienstenList.classList.toggle('hidden');
      const icon = mobileDienstenToggle.querySelector('.ph-caret-down');
      if (icon) icon.classList.toggle('rotate-180');
    });
  }

  // =========================================================================
  // 11. Contact Form Simulation & Toast Feedback
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      alert(`Bedankt voor jouw aanvraag, ${name}! We hebben jouw gegevens (${email}) goed ontvangen en nemen binnen 24 uur contact met je op voor een kennismaking.`);
      contactForm.reset();
    });
  }

  // Auto-scroll smooth helper for deep links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // =========================================================================
  // 12. Scroll Reveal Animations (Motion Best Practices)
  // =========================================================================
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        entry.target.style.opacity = '1';
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.case-card, .service-pillar, .process-card').forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });

});
