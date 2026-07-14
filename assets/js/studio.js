/* ============================================================
   Sillage — curseur custom, affiches génératives jouables, reveals
   Sécurité : 0 innerHTML, 0 eval, 0 requête réseau. DOM via createElementNS.
   Styles ponctuels via CSSOM par-propriété (jamais setAttribute('style')).
   Liens internes : smooth-scroll sans laisser de # dans l'URL.
   ============================================================ */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. reveals ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. curseur custom ---------- */
  var cursor = $("cursor");
  var cursorActive = !(touch || reduce || !cursor);
  if (!cursorActive) {
    document.body.classList.add("no-cursor");
  } else {
    var x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }
  function bindGrow(el) {
    if (!cursorActive) return;
    el.addEventListener("mouseenter", function () { cursor.classList.add("grow"); });
    el.addEventListener("mouseleave", function () { cursor.classList.remove("grow"); });
  }
  document.querySelectorAll("[data-cursor]").forEach(bindGrow);

  /* ---------- 3. navigation interne : smooth-scroll SANS # dans l'URL ---------- */
  var nav = document.querySelector("[data-nav]");
  document.querySelectorAll("[data-nav-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      // focus la cible pour le clavier / lecteur d'écran, sans re-scroller
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (nav) nav.classList.remove("is-open");
      var burger = $("navBurger");
      if (burger) burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 4. menu mobile (hamburger) ---------- */
  (function () {
    var burger = $("navBurger");
    if (!burger || !nav) return;
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  })();

  /* ---------- 5. affiches riso génératives ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  var PAPER = "#F4F2EC", INK = "#16150F";

  // opts = { seed, A, B, initial, variant? }  (variant absent → dérivé du seed)
  function makePoster(host, opts) {
    var seed = opts.seed | 0;
    var A = opts.A || "#1D2AE8", B = opts.B || "#FF5C39";
    var initial = (opts.initial || "S").toUpperCase();
    var r = rng(seed), W = 200, H = 250;

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid slice", role: "presentation" });

    // grain (filtre unique par host pour éviter les collisions d'id)
    var fid = "grain" + seed + "_" + (opts.variant == null ? "v" : opts.variant);
    var defs = el("defs", {});
    var f = el("filter", { id: fid, x: "0", y: "0", width: "100%", height: "100%" });
    f.appendChild(el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", stitchTiles: "stitch", result: "n" }));
    f.appendChild(el("feColorMatrix", { in: "n", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" }));
    f.appendChild(el("feComposite", { operator: "in", in2: "SourceGraphic" }));
    defs.appendChild(f);
    svg.appendChild(defs);

    svg.appendChild(el("rect", { x: 0, y: 0, width: W, height: H, fill: A }));

    var g = el("g", {});
    g.style.mixBlendMode = "multiply"; // CSSOM par-propriété (CSP-safe)
    var variant = (opts.variant == null) ? Math.floor(r() * 4) : (opts.variant | 0);

    var cxp = 40 + r() * 120, cyp = 40 + r() * 120, rad = 55 + r() * 55;
    g.appendChild(el("circle", { cx: cxp, cy: cyp, r: rad, fill: B }));

    if (variant === 0) {
      var ax = r() * W, ay = 90 + r() * 90, ar = 40 + r() * 40;
      g.appendChild(el("path", { d: "M" + (ax - ar) + " " + ay + " a" + ar + " " + ar + " 0 0 1 " + (2 * ar) + " 0 z", fill: PAPER, opacity: ".9" }));
    } else if (variant === 1) {
      for (var i = 0; i < 7; i++) {
        var off = i * 34 - 40;
        g.appendChild(el("line", { x1: off, y1: 0, x2: off + 120, y2: H, stroke: PAPER, "stroke-width": 6, opacity: ".55" }));
      }
    } else if (variant === 2) {
      var ox = 40 + r() * 120, oy = 40 + r() * 150;
      for (var k = 1; k <= 5; k++) g.appendChild(el("circle", { cx: ox, cy: oy, r: k * 16, fill: "none", stroke: PAPER, "stroke-width": 3, opacity: ".7" }));
    } else {
      var rx = 30 + r() * 90, ry = 60 + r() * 110, rot = -30 + r() * 60;
      g.appendChild(el("rect", { x: rx, y: ry, width: 90, height: 90, fill: PAPER, opacity: ".85", transform: "rotate(" + rot.toFixed(0) + " " + (rx + 45) + " " + (ry + 45) + ")" }));
    }

    g.appendChild(el("circle", { cx: 20 + r() * 160, cy: 20 + r() * 200, r: 6 + r() * 8, fill: INK, opacity: ".85" }));
    svg.appendChild(g);

    var t = el("text", { x: 14, y: H - 18, "font-family": "Instrument, Georgia, serif", "font-size": 108, fill: PAPER, opacity: ".92", "letter-spacing": "-4" });
    t.textContent = initial;
    svg.appendChild(t);

    var grainRect = el("rect", { x: 0, y: 0, width: W, height: H, filter: "url(#" + fid + ")", opacity: ".5" });
    grainRect.style.mixBlendMode = "overlay"; // CSSOM par-propriété (CSP-safe)
    svg.appendChild(grainRect);

    host.replaceChildren(svg); // pas d'innerHTML
  }

  function readDuo(work) {
    var cs = getComputedStyle(work);
    return { A: cs.getPropertyValue("--a").trim() || "#1D2AE8", B: cs.getPropertyValue("--b").trim() || "#FF5C39" };
  }

  /* ---------- 6. travaux : rendu + clic = « autre piste » ---------- */
  document.querySelectorAll(".work").forEach(function (work) {
    var host = work.querySelector("[data-poster]");
    if (!host) return;
    var duo = readDuo(work);
    var h3 = work.querySelector("h3");
    var initial = h3 ? h3.textContent.trim().charAt(0) : "S";
    var seed = +work.getAttribute("data-seed") || 1;
    makePoster(host, { seed: seed, A: duo.A, B: duo.B, initial: initial });
    host.addEventListener("click", function () {
      seed = Math.floor(Math.random() * 100000);
      makePoster(host, { seed: seed, A: duo.A, B: duo.B, initial: initial });
    });
  });

  /* ---------- 7. l'atelier : générateur jouable ---------- */
  (function atelier() {
    var stage = $("atelierPoster");
    if (!stage) return;
    var PALETTES = [
      ["#1D2AE8", "#FF5C39"], ["#0E1E14", "#8CD24A"], ["#4413B8", "#F4C10F"],
      ["#B31255", "#12324F"], ["#175E52", "#EA7A2B"], ["#20208C", "#F0568A"]
    ];
    var state = { seed: 4821, A: PALETTES[0][0], B: PALETTES[0][1], initial: "S", variant: 0 };
    function render() { makePoster(stage, state); }

    // swatches
    var swBox = $("atSwatches");
    var swEls = [];
    PALETTES.forEach(function (p, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "swatch" + (idx === 0 ? " is-active" : "");
      b.setAttribute("data-cursor", "");
      b.setAttribute("aria-label", "Duo de couleurs " + (idx + 1));
      b.setAttribute("aria-pressed", idx === 0 ? "true" : "false");
      b.style.background = "linear-gradient(135deg," + p[0] + "," + p[1] + ")";
      b.addEventListener("click", function () {
        state.A = p[0]; state.B = p[1];
        swEls.forEach(function (s) { s.classList.remove("is-active"); s.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-active"); b.setAttribute("aria-pressed", "true");
        render();
      });
      bindGrow(b);
      swBox.appendChild(b);
      swEls.push(b);
    });

    // initiale
    var initInput = $("atInit");
    if (initInput) initInput.addEventListener("input", function () {
      state.initial = (initInput.value.trim().charAt(0) || "S");
      render();
    });

    // composition
    var vbtns = document.querySelectorAll("#atVariants .vbtn");
    vbtns.forEach(function (v) {
      v.addEventListener("click", function () {
        state.variant = +v.getAttribute("data-variant") || 0;
        vbtns.forEach(function (o) { o.classList.remove("is-active"); o.setAttribute("aria-pressed", "false"); });
        v.classList.add("is-active"); v.setAttribute("aria-pressed", "true");
        render();
      });
    });

    // dé : nouvelle piste (seed + couleur + composition au hasard)
    var dice = $("atDice");
    if (dice) dice.addEventListener("click", function () {
      state.seed = Math.floor(Math.random() * 100000);
      var pi = Math.floor(Math.random() * PALETTES.length);
      state.A = PALETTES[pi][0]; state.B = PALETTES[pi][1];
      state.variant = Math.floor(Math.random() * 4);
      swEls.forEach(function (s, i) { s.classList.toggle("is-active", i === pi); s.setAttribute("aria-pressed", i === pi ? "true" : "false"); });
      vbtns.forEach(function (o) { var on = (+o.getAttribute("data-variant") === state.variant); o.classList.toggle("is-active", on); o.setAttribute("aria-pressed", on ? "true" : "false"); });
      if (!reduce) { dice.classList.remove("rolling"); void dice.offsetWidth; dice.classList.add("rolling"); }
      render();
    });

    render();
  })();

})();
