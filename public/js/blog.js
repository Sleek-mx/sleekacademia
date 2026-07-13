(function () {
  const search = document.getElementById("blog-search");
  const filters = Array.from(document.querySelectorAll("[data-blog-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-blog-card]"));
  const empty = document.getElementById("blog-empty");
  if (!search || !filters.length || !cards.length) return;

  let category = "all";
  function update() {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(function (card) {
      const cardCategory = card.dataset.category || "";
      const matchesCategory = category === "all" || cardCategory === category;
      const matchesTerm = !term || card.textContent.toLowerCase().includes(term);
      card.hidden = !(matchesCategory && matchesTerm);
      if (!card.hidden) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  search.addEventListener("input", update);
  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      category = filter.dataset.blogFilter || "all";
      filters.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === filter));
      });
      update();
    });
  });
})();
