/* Sleek Academia — stagger testimonial deck.
   Enhances an existing .quote-wall grid into a staggered, clickable card deck.
   No dependencies. Without JS the original grid renders untouched. */
(function () {
  var wall = document.querySelector("[data-stagger-testimonials]");
  if (!wall) return;

  var cards = Array.prototype.slice.call(wall.querySelectorAll(".testimonial"));
  if (cards.length < 2) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cardSize = 340;
  var order = cards.slice();

  // The reveal observer animates cards individually; that fights our transforms.
  cards.forEach(function (card) {
    card.removeAttribute("data-reveal");
    card.classList.add("is-visible");
    card.setAttribute("role", "group");
  });
  wall.classList.add("is-visible");

  function measure() {
    var wide = window.matchMedia("(min-width: 900px)").matches;
    var mid = window.matchMedia("(min-width: 640px)").matches;
    var available = wall.clientWidth || 320;
    cardSize = Math.min(wide ? 340 : mid ? 320 : 290, available - 24);
    wall.style.setProperty("--stagger-height", cardSize + 150 + "px");
  }

  function render() {
    var count = order.length;
    order.forEach(function (card, index) {
      var position = count % 2 ? index - (count + 1) / 2 : index - count / 2;
      var isCenter = position === 0;
      card.style.width = cardSize + "px";
      card.style.height = cardSize + "px";
      card.style.zIndex = String(10 - Math.abs(position));
      card.style.transform =
        "translate(-50%, -50%)" +
        " translateX(" + (cardSize / 1.6) * position + "px)" +
        " translateY(" + (isCenter ? -40 : position % 2 ? 18 : -18) + "px)" +
        " rotate(" + (isCenter ? 0 : position % 2 ? 2.5 : -2.5) + "deg)";
      card.classList.toggle("is-center", isCenter);
      card.setAttribute("aria-hidden", isCenter ? "false" : "false");
      card.style.pointerEvents = Math.abs(position) > 2 ? "none" : "auto";
      card.style.opacity = Math.abs(position) > 2 ? "0" : "1";
    });
  }

  function move(steps) {
    if (!steps) return;
    var i;
    if (steps > 0) {
      for (i = 0; i < steps; i++) order.push(order.shift());
    } else {
      for (i = 0; i > steps; i--) order.unshift(order.pop());
    }
    // Keep DOM order in sync so tab order follows visual order.
    order.forEach(function (card) { wall.appendChild(card); });
    render();
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      var position = order.indexOf(card);
      var count = order.length;
      move(count % 2 ? position - (count + 1) / 2 : position - count / 2);
    });
  });

  // Controls
  var controls = document.createElement("div");
  controls.className = "stagger-controls";
  controls.innerHTML =
    '<button type="button" data-step="-1" aria-label="Previous testimonial">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<button type="button" data-step="1" aria-label="Next testimonial">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>';
  wall.appendChild(controls);
  controls.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-step]");
    if (!button) return;
    stopAuto();
    move(Number(button.dataset.step));
  });

  // Keyboard
  wall.setAttribute("tabindex", "0");
  wall.setAttribute("role", "region");
  wall.setAttribute("aria-roledescription", "carousel");
  wall.setAttribute("aria-label", "Student testimonials");
  wall.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    stopAuto();
    move(event.key === "ArrowRight" ? 1 : -1);
  });

  // Swipe
  var startX = null;
  wall.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
  }, { passive: true });
  wall.addEventListener("touchend", function (event) {
    if (startX === null) return;
    var delta = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(delta) < 40) return;
    stopAuto();
    move(delta < 0 ? 1 : -1);
  }, { passive: true });

  // Autoplay — pauses on interaction, hover, or when off screen.
  var timer = null;
  function startAuto() {
    if (timer || reduceMotion) return;
    timer = window.setInterval(function () { move(1); }, 6000);
  }
  function stopAuto() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }
  wall.addEventListener("mouseenter", stopAuto);
  wall.addEventListener("focusin", stopAuto);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.4 }).observe(wall);
  } else {
    startAuto();
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      measure();
      render();
    }, 120);
  });

  wall.classList.add("is-stagger");
  measure();
  render();
})();
