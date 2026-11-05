/* Captain Media AI chat widget.
   Talks to an n8n "Chat Trigger" webhook (mode: Embedded Chat, public).
   Request:  POST { action: "sendMessage", sessionId, chatInput }
   Response: { output: "..." }  (also accepts { text } / { message } / plain text)
   The widget stays hidden until window.CM_CHAT.webhookUrl is set. */
(function () {
  var cfg = window.CM_CHAT || {};
  if (!cfg.webhookUrl) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var M = window.Motion;
  var store = (function () { try { return window.sessionStorage; } catch (e) { return null; } })();
  var get = function (k) { try { return store && store.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { store && store.setItem(k, v); } catch (e) {} };

  var sessionId = get("cm-chat-session");
  if (!sessionId) {
    sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "s" + Date.now() + Math.random().toString(16).slice(2);
    set("cm-chat-session", sessionId);
  }

  var greeting = cfg.greeting || "Hoi! Ik ben de AI-assistent van Captain Media. Vraag me alles over video, fotografie, design of AI voor je bedrijf. Waar kan ik je mee helpen?";
  var chips = cfg.suggestions || ["Ik wil een bedrijfsfilm", "Wat kost een AI chatbot?", "Plan een kennismaking"];

  var ico = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8M8 13h5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
  };

  // ---------- DOM ----------
  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "cm-chat-launch";
  launcher.setAttribute("aria-label", "Open de AI-assistent");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = ico.chat + '<span>Vraag het onze AI</span>';

  var panel = document.createElement("section");
  panel.className = "cm-chat";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat met de AI-assistent van Captain Media");
  panel.hidden = true;
  panel.innerHTML =
    '<header class="cm-chat-head">' +
      '<div class="cm-chat-id"><span class="cm-chat-dot" aria-hidden="true"></span><div><b>Captain Media AI</b><small>Antwoordt direct, 24/7</small></div></div>' +
      '<button type="button" class="cm-chat-x" aria-label="Sluit de chat">' + ico.close + '</button>' +
    '</header>' +
    '<p class="cm-chat-note">Je praat met een AI-assistent. Liever een mens? <a href="' + (cfg.whatsapp || "#") + '" target="_blank" rel="noopener">Stuur een WhatsApp</a>.</p>' +
    '<div class="cm-chat-log" aria-live="polite"></div>' +
    '<div class="cm-chat-chips"></div>' +
    '<form class="cm-chat-form">' +
      '<label class="cm-sr" for="cm-chat-input">Typ je bericht</label>' +
      '<textarea id="cm-chat-input" rows="1" placeholder="Typ je vraag..." maxlength="1000"></textarea>' +
      '<button type="submit" aria-label="Verstuur">' + ico.send + '</button>' +
    '</form>';

  document.body.appendChild(panel);
  document.body.appendChild(launcher);
  document.documentElement.classList.add("has-cm-chat");

  var log = panel.querySelector(".cm-chat-log");
  var chipWrap = panel.querySelector(".cm-chat-chips");
  var form = panel.querySelector(".cm-chat-form");
  var input = panel.querySelector("textarea");
  var sendBtn = form.querySelector("button");
  var busy = false;

  // ---------- rendering ----------
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // minimal, safe markdown: **bold**, [text](url), bare urls, line breaks, "- " lists
  function md(s) {
    var h = esc(s);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    h = h.replace(/^(?:- |• )(.*)$/gm, "<li>$1</li>").replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>");
    return h.replace(/\n{2,}/g, "<br><br>").replace(/\n(?!<\/?(ul|li))/g, "<br>");
  }
  function add(role, text) {
    var el = document.createElement("div");
    el.className = "cm-msg " + role;
    el.innerHTML = role === "bot" ? md(text) : esc(text);
    log.appendChild(el);
    if (M && !reduce) M.animate(el, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3 });
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function typing(on) {
    var t = log.querySelector(".cm-typing");
    if (on && !t) {
      t = document.createElement("div");
      t.className = "cm-msg bot cm-typing";
      t.setAttribute("aria-label", "De assistent typt");
      t.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
    } else if (!on && t) t.remove();
  }
  function renderChips() {
    chipWrap.innerHTML = "";
    chips.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = c;
      b.addEventListener("click", function () { send(c); });
      chipWrap.appendChild(b);
    });
  }

  // ---------- network ----------
  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true;
    chipWrap.innerHTML = "";
    add("user", text);
    input.value = ""; grow();
    typing(true);
    fetch(cfg.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendMessage", sessionId: sessionId, chatInput: text, metadata: { page: location.pathname } })
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        var ct = r.headers.get("content-type") || "";
        return ct.indexOf("json") > -1 ? r.json() : r.text();
      })
      .then(function (data) {
        if (Array.isArray(data)) data = data[0];
        var out = typeof data === "string" ? data : (data && (data.output || data.text || data.message || data.response)) || "";
        typing(false);
        add("bot", out || "Sorry, daar ging iets mis. Probeer het nog eens of stuur ons een WhatsApp.");
        saveLog();
      })
      .catch(function () {
        typing(false);
        add("bot", "Sorry, ik ben even niet bereikbaar. Stuur ons gerust een WhatsApp: " + (cfg.whatsapp || ""));
      })
      .then(function () { busy = false; sendBtn.disabled = false; input.focus(); });
  }

  // keep the conversation when moving between pages (same tab)
  function saveLog() { set("cm-chat-log", log.innerHTML); }
  var saved = get("cm-chat-log");
  if (saved) log.innerHTML = saved; else { add("bot", greeting); renderChips(); }

  // ---------- open / close ----------
  function open(on) {
    panel.hidden = !on;
    launcher.setAttribute("aria-expanded", on ? "true" : "false");
    launcher.classList.toggle("is-open", on);
    if (on) {
      if (M && !reduce) M.animate(panel, { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] }, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
      log.scrollTop = log.scrollHeight;
      setTimeout(function () { input.focus(); }, 50);
    } else launcher.focus();
  }
  launcher.addEventListener("click", function () { open(panel.hidden); });
  panel.querySelector(".cm-chat-x").addEventListener("click", function () { open(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) open(false); });

  function grow() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; }
  input.addEventListener("input", grow);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });

  // links like <a data-open-chat> anywhere on the site open the assistant
  Array.prototype.forEach.call(document.querySelectorAll("[data-open-chat]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); open(true); });
  });
})();
