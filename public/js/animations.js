/* Sleek Academia — site-wide scroll & micro animations.
   Auto-tags elements so no per-page markup is needed. Fails safe:
   if anything goes wrong, content is revealed rather than hidden. */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav depth-on-scroll is safe regardless of motion preference.
  var nav = document.querySelector("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("sa-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (prefersReduced) return; // honour the user's wish for stillness

  var root = document.documentElement;
  root.classList.add("anim-on");

  var items = [];
  function tag(el, kind) {
    if (!el || el.nodeType !== 1 || el.hasAttribute("data-anim")) return;
    el.setAttribute("data-anim", kind || "up");
    items.push(el);
  }

  // 1) Grid cells reveal with a stagger (cards, testimonials, footer columns…)
  document.querySelectorAll("main .grid, footer .grid").forEach(function (grid) {
    var i = 0;
    Array.prototype.forEach.call(grid.children, function (child) {
      tag(child);
      child.style.transitionDelay = (i % 6) * 70 + "ms";
      i++;
    });
  });

  // 2) Section headings.
  document.querySelectorAll("main h1, main h2").forEach(function (h) {
    tag(h);
  });

  // 3) Standalone cards / panels / CTAs not already inside a tagged block.
  document
    .querySelectorAll(
      'main [class*="rounded-2xl"], main [class*="rounded-3xl"], main [class*="rounded-["]'
    )
    .forEach(function (c) {
      tag(c);
    });

  // Drop any element nested inside another tagged element (parent reveals it).
  items = items.filter(function (el) {
    var p = el.parentElement;
    while (p) {
      if (p.hasAttribute && p.hasAttribute("data-anim")) {
        el.removeAttribute("data-anim");
        el.style.transitionDelay = "";
        return false;
      }
      p = p.parentElement;
    }
    return true;
  });

  function revealAll() {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
    // Failsafe: never leave anything stuck hidden.
    setTimeout(revealAll, 2600);
  }

  // 4) Micro-touches on the landing hero: float the floating accent cards,
  //    pulse the primary CTA once the page settles.
  var hero = document.querySelector("main section");
  if (hero) {
    var floats = hero.querySelectorAll(".absolute.bg-white, .absolute .bg-white");
    floats.forEach(function (el, i) {
      el.classList.add("anim-float");
      if (i % 2 === 1) el.classList.add("delay");
    });
  }
  var primaryCta = document.querySelector('a.shadow-glow[href="/onboard.html"]');
  if (primaryCta) {
    window.setTimeout(function () {
      primaryCta.classList.add("anim-cta");
    }, 900);
  }
})();
