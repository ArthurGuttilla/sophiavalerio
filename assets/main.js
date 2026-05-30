// Sophia Valerio — Phase 1 landing interaction
// Progressive enhancement: the Start link works without JS.
// With JS, we add a composed fade-out before navigating to /home.

(function () {
  "use strict";

  var start = document.getElementById("start");
  var stage = document.getElementById("stage");
  if (!start || !stage) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var navigating = false;

  start.addEventListener("click", function (event) {
    // Respect new-tab / modifier clicks — let the browser handle them.
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

    // No animated transition when reduced motion is requested.
    if (prefersReducedMotion) return;

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
    // Fallback in case transitionend doesn't fire.
    window.setTimeout(go, 450);
  });
})();
