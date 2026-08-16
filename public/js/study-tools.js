(function () {
  "use strict";

  var buttons = Array.from(document.querySelectorAll(".gc-market-filters [data-filter]"));
  var cards = Array.from(document.querySelectorAll("[data-tool-card]"));
  var status = document.getElementById("study-filter-status");
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    var visible = 0;
    cards.forEach(function (card) {
      var show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    if (status) status.textContent = visible + (visible === 1 ? " study pack shown" : " study packs shown");
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () { applyFilter(button.dataset.filter); });
  });

  applyFilter("all");
})();
