(function () {
  const toggle = document.querySelector(".menu-button");
  const menu = document.getElementById("primary-links");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ambientVideos = Array.from(document.querySelectorAll("[data-ambient-video]"));
  if (reduceMotion && ambientVideos.length) {
    ambientVideos.forEach(function (video) {
      video.removeAttribute("autoplay");
      video.pause();
      video.currentTime = 0;
    });
    document.documentElement.classList.add("is-reduced-motion");
  }

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!revealItems.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

  revealItems.forEach(function (item) { observer.observe(item); });
})();
