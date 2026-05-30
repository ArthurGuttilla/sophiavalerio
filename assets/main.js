// Sophia Valerio — Phase 1 landing interaction
// Progressive enhancement: everything degrades gracefully without JS,
// and all ambient motion is disabled under prefers-reduced-motion.

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------
     1. Greeting by time of day — "Boa noite, Sophia"
     ---------------------------------------------------------- */
  (function greeting() {
    var el = document.getElementById("greeting");
    if (!el) return;
    var h = new Date().getHours();
    var part = h >= 5 && h < 12 ? "Bom dia" : h >= 12 && h < 18 ? "Boa tarde" : "Boa noite";
    el.textContent = part + ", Sophia";
  })();

  /* ----------------------------------------------------------
     2. Composed fade-out before navigating to /home
     ---------------------------------------------------------- */
  (function startTransition() {
    var start = document.getElementById("start");
    var stage = document.getElementById("stage");
    if (!start || !stage) return;

    var navigating = false;

    start.addEventListener("click", function (event) {
      // Respect new-tab / modifier clicks.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (prefersReducedMotion) return; // navigate immediately

      event.preventDefault();
      if (navigating) return;
      navigating = true;

      var href = start.getAttribute("href");
      stage.classList.add("is-leaving");

      var done = false;
      var go = function () {
        if (done) return;
        done = true;
        window.location.href = href;
      };

      stage.addEventListener("transitionend", go, { once: true });
      window.setTimeout(go, 450);
    });
  })();

  // Ambient canvas effects are decorative — never run them when the user
  // has asked for reduced motion.
  if (prefersReducedMotion) return;

  // Shared helper: size a canvas to the viewport, accounting for DPR.
  function fit(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  /* ----------------------------------------------------------
     3. Natural-light motes drifting over the beige background
     ---------------------------------------------------------- */
  var light = (function lightfield() {
    var canvas = document.getElementById("lightfield");
    if (!canvas) return null;
    var ctx = fit(canvas);
    var motes = [];

    function seed() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      // Density tuned to feel barely-there; capped for performance.
      var count = Math.min(46, Math.round((w * h) / 26000));
      motes = [];
      for (var i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 2.2,
          vy: 0.08 + Math.random() * 0.22, // slow fall
          sway: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          a: 0.05 + Math.random() * 0.14 // very low opacity
        });
      }
    }
    seed();

    function frame() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y += m.vy;
        m.phase += 0.01;
        var x = m.x + Math.sin(m.phase) * m.sway;
        if (m.y - m.r > h) {
          m.y = -m.r;
          m.x = Math.random() * w;
        }
        var g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 4);
        g.addColorStop(0, "rgba(255, 250, 240, " + m.a + ")");
        g.addColorStop(1, "rgba(255, 250, 240, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return { ctx: ctx, canvas: canvas, frame: frame, resize: function () { ctx = fit(canvas); seed(); } };
  })();

  /* ----------------------------------------------------------
     4. Espresso ink trail — tap/drag on the background leaves
        soft brushstrokes that slowly fade away.
     ---------------------------------------------------------- */
  var ink = (function inkfield() {
    var canvas = document.getElementById("inkfield");
    if (!canvas) return null;
    var ctx = fit(canvas);
    var stamps = [];
    var last = null;

    function dab(x, y, size) {
      stamps.push({ x: x, y: y, r: size, a: 0.5 + Math.random() * 0.25 });
    }

    // Interpolate along the pointer path so drags read as one stroke.
    function addPoint(x, y) {
      var base = 7 + Math.random() * 7;
      if (last) {
        var dx = x - last.x;
        var dy = y - last.y;
        var dist = Math.hypot(dx, dy);
        var steps = Math.max(1, Math.floor(dist / 5));
        for (var s = 1; s <= steps; s++) {
          dab(last.x + (dx * s) / steps, last.y + (dy * s) / steps, base);
        }
      } else {
        dab(x, y, base);
      }
      last = { x: x, y: y };
    }

    var down = false;
    window.addEventListener("pointerdown", function (e) {
      down = true;
      last = null;
      addPoint(e.clientX, e.clientY);
    });
    window.addEventListener("pointermove", function (e) {
      if (down) addPoint(e.clientX, e.clientY);
    });
    window.addEventListener("pointerup", function () { down = false; last = null; });
    window.addEventListener("pointercancel", function () { down = false; last = null; });

    function frame() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      // Gently fade existing ink each frame.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      for (var i = 0; i < stamps.length; i++) {
        var p = stamps[i];
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, "rgba(62, 52, 43, " + p.a + ")");
        g.addColorStop(0.6, "rgba(62, 52, 43, " + p.a * 0.5 + ")");
        g.addColorStop(1, "rgba(62, 52, 43, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stamps are drawn once; the canvas keeps and fades them.
      stamps.length = 0;
    }

    return { ctx: ctx, canvas: canvas, frame: frame, resize: function () { ctx = fit(canvas); } };
  })();

  /* ----------------------------------------------------------
     5. Single shared animation loop (pauses when tab is hidden)
     ---------------------------------------------------------- */
  var running = true;
  function loop() {
    if (running) {
      if (light) light.frame();
      if (ink) ink.frame();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (light) light.resize();
      if (ink) ink.resize();
    }, 150);
  });
})();
