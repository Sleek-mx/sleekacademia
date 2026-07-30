/* Sleek Academia - liquid glass nav behaviour.
 *
 * Drives one droplet element behind the primary nav links:
 *   - it rests behind the current page's link
 *   - it follows the pointer on hover and flows back on leave
 *   - across a page change it starts at the link you came FROM and travels to
 *     the new one, so navigation reads as one drop moving through the words
 *
 * The droplet is sized once to the active link and every move after that is a
 * pure transform (translate + scale), so travel stays on the compositor and the
 * squash never reflows the bar. Progressive enhancement: the stylesheet renders
 * a static pill on the active link whenever this script has not run.
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var list = document.querySelector(".nav-links");
  if (!list) return;

  var links = Array.prototype.slice.call(list.querySelectorAll(".nav-link"));
  var active = list.querySelector('.nav-link[aria-current="page"]');
  if (links.length < 2 || !active) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = typeof Element.prototype.animate === "function";
  var STORAGE_KEY = "sa-nav-from";
  var SPRING = "cubic-bezier(0.34, 1.32, 0.5, 1)";
  var TRAVEL_MS = 640;

  var droplet = document.createElement("span");
  droplet.className = "nav-droplet";
  droplet.setAttribute("aria-hidden", "true");
  list.insertBefore(droplet, list.firstChild);

  var base = null; // the active link's box; the droplet's resting geometry

  function boxOf(link) {
    return { x: link.offsetLeft, y: link.offsetTop, w: link.offsetWidth, h: link.offsetHeight };
  }

  /* Transform that lands the droplet exactly over `box`, given it is laid out
     at `base` and scales from its own centre. */
  function transformFor(box, stretch) {
    var sx = (box.w / base.w) * (stretch || 1);
    var sy = (box.h / base.h) / (stretch ? 1 + (stretch - 1) * 0.7 : 1);
    var dx = box.x - base.x + (box.w - base.w) / 2;
    var dy = box.y - base.y + (box.h - base.h) / 2;
    return "translate3d(" + dx + "px," + dy + "px,0) scale(" + sx + "," + sy + ")";
  }

  function layout() {
    base = boxOf(active);
    if (!base.w) return false;
    droplet.style.left = base.x + "px";
    droplet.style.top = base.y + "px";
    droplet.style.width = base.w + "px";
    droplet.style.height = base.h + "px";
    return true;
  }

  var settledOn = null; // box the droplet currently rests on
  var running = null;

  function moveTo(link, animate) {
    if (!base) return;
    var box = boxOf(link);
    if (!box.w) return;

    var from = settledOn;
    settledOn = box;
    var target = transformFor(box);

    if (!animate || reduced || !canAnimate || !from) {
      if (running) { running.cancel(); running = null; }
      droplet.style.transform = target;
      droplet.classList.add("is-visible");
      return;
    }

    var distance = Math.abs(box.x - from.x) + Math.abs(box.y - from.y);
    // Longer hops elongate more, the way a real drop does.
    var stretch = Math.min(1 + distance / 520, 1.34);
    var midBox = {
      x: (from.x + box.x) / 2,
      y: (from.y + box.y) / 2,
      w: (from.w + box.w) / 2,
      h: (from.h + box.h) / 2,
    };

    if (running) running.cancel();
    droplet.style.transform = target;
    droplet.classList.add("is-visible");
    running = droplet.animate(
      [
        { transform: transformFor(from), offset: 0 },
        { transform: transformFor(midBox, distance > 24 ? stretch : 1), offset: 0.45 },
        { transform: target, offset: 1 },
      ],
      { duration: TRAVEL_MS, easing: SPRING }
    );
  }

  if (!layout()) return;

  /* Which link the visitor came from, so the drop can cross the page change. */
  var origin = null;
  try {
    var stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      var candidate = links[Number(stored)];
      if (candidate && candidate !== active) origin = candidate;
    }
    window.sessionStorage.setItem(STORAGE_KEY, String(links.indexOf(active)));
  } catch (err) {
    /* private mode: fall back to landing straight on the active link */
  }

  if (origin) {
    settledOn = boxOf(origin);
    droplet.style.transform = transformFor(settledOn);
    droplet.classList.add("is-visible");
    moveTo(active, true);
  } else {
    moveTo(active, false);
  }

  /* Hover and keyboard focus pull the drop across; leaving lets it flow back. */
  var settleTimer = null;

  links.forEach(function (link) {
    function follow() {
      window.clearTimeout(settleTimer);
      moveTo(link, true);
    }
    link.addEventListener("mouseenter", follow);
    link.addEventListener("focus", follow);
  });

  function release() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(function () { moveTo(active, true); }, 110);
  }
  list.addEventListener("mouseleave", release);
  list.addEventListener("focusout", release);

  /* Re-measure whenever the bar reflows under the drop. */
  var reflow = null;
  function remeasure() {
    window.clearTimeout(reflow);
    reflow = window.setTimeout(function () {
      if (running) { running.cancel(); running = null; }
      settledOn = null;
      if (layout()) moveTo(active, false);
    }, 120);
  }
  window.addEventListener("resize", remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

  var menuButton = document.querySelector(".menu-button");
  if (menuButton) menuButton.addEventListener("click", remeasure);

  /* Thicken the glass once content scrolls beneath it. */
  if (header && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none";
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("is-lifted", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(sentinel);
  }
})();
