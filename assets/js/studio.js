/* Sillage — curseur custom, affiches génératives, reveals */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- reveals ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- curseur custom ---------- */
  var cursor = document.getElementById("cursor");
  if (touch || reduce || !cursor) {
    document.body.classList.add("no-cursor");
  } else {
    var x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("grow"); });
    });
  }

  /* ---------- affiches riso génératives ---------- */
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

  function poster(host) {
    var seed = +host.parentElement.getAttribute("data-seed") || 1;
    var A = getComputedStyle(host.parentElement).getPropertyValue("--a").trim() || "#1D2AE8";
    var B = getComputedStyle(host.parentElement).getPropertyValue("--b").trim() || "#FF5C39";
    var name = host.parentElement.querySelector("h3");
    var initial = name ? name.textContent.trim().charAt(0) : "S";
    var r = rng(seed), W = 200, H = 250;

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid slice", role: "presentation" });

    // grain
    var defs = el("defs", {});
    var f = el("filter", { id: "grain" + seed, x: "0", y: "0", width: "100%", height: "100%" });
    f.appendChild(el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", stitchTiles: "stitch", result: "n" }));
    var cm = el("feColorMatrix", { in: "n", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" });
    f.appendChild(cm);
    f.appendChild(el("feComposite", { operator: "in", in2: "SourceGraphic" }));
    defs.appendChild(f);
    svg.appendChild(defs);

    // base
    svg.appendChild(el("rect", { x: 0, y: 0, width: W, height: H, fill: A }));

    var g = el("g", { style: "mix-blend-mode:multiply" });
    var variant = Math.floor(r() * 4);

    // grande forme B
    var cxp = 40 + r() * 120, cyp = 40 + r() * 120, rad = 55 + r() * 55;
    g.appendChild(el("circle", { cx: cxp, cy: cyp, r: rad, fill: B }));

    // forme secondaire paper
    if (variant === 0) {
      // arc / demi-lune
      var ax = r() * W, ay = 90 + r() * 90, ar = 40 + r() * 40;
      g.appendChild(el("path", { d: "M" + (ax - ar) + " " + ay + " a" + ar + " " + ar + " 0 0 1 " + (2 * ar) + " 0 z", fill: PAPER, opacity: ".9" }));
    } else if (variant === 1) {
      // rayures diagonales
      for (var i = 0; i < 7; i++) {
        var off = i * 34 - 40;
        g.appendChild(el("line", { x1: off, y1: 0, x2: off + 120, y2: H, stroke: PAPER, "stroke-width": 6, opacity: ".55" }));
      }
    } else if (variant === 2) {
      // anneaux concentriques
      var ox = 40 + r() * 120, oy = 40 + r() * 150;
      for (var k = 1; k <= 5; k++) g.appendChild(el("circle", { cx: ox, cy: oy, r: k * 16, fill: "none", stroke: PAPER, "stroke-width": 3, opacity: ".7" }));
    } else {
      // rectangle pivoté
      var rx = 30 + r() * 90, ry = 60 + r() * 110, rot = -30 + r() * 60;
      g.appendChild(el("rect", { x: rx, y: ry, width: 90, height: 90, fill: PAPER, opacity: ".85", transform: "rotate(" + rot.toFixed(0) + " " + (rx + 45) + " " + (ry + 45) + ")" }));
    }

    // petit point d'accent encre
    g.appendChild(el("circle", { cx: 20 + r() * 160, cy: 20 + r() * 200, r: 6 + r() * 8, fill: INK, opacity: ".85" }));
    svg.appendChild(g);

    // grande initiale (spécimen typo, police Instrument)
    var t = el("text", {
      x: 14, y: H - 18, "font-family": "Instrument, Georgia, serif",
      "font-size": 108, fill: PAPER, opacity: ".92", "letter-spacing": "-4"
    });
    t.textContent = initial;
    svg.appendChild(t);

    // couche grain
    var grainRect = el("rect", { x: 0, y: 0, width: W, height: H, filter: "url(#grain" + seed + ")", opacity: ".5", style: "mix-blend-mode:overlay" });
    svg.appendChild(grainRect);

    host.appendChild(svg);
  }

  document.querySelectorAll("[data-poster]").forEach(poster);
})();
