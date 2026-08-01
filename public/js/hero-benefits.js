(function () {
  var benefit = document.querySelector("[data-hero-benefit]");
  if (!benefit) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var benefits = [
    "Clear study plans.",
    "Expert feedback.",
    "A private workspace."
  ];
  var index = 0;

  window.setInterval(function () {
    benefit.classList.add("is-changing");
    window.setTimeout(function () {
      index = (index + 1) % benefits.length;
      benefit.textContent = benefits[index];
      benefit.classList.remove("is-changing");
    }, 220);
  }, 2800);
})();
