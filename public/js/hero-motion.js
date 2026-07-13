(function () {
  "use strict";

  function wrapCharacters(target) {
    var visual = target.querySelector(".typewriter-visual");
    if (!visual || visual.querySelector(".typewriter-char")) return [];

    var walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) textNodes.push(node);

    var index = 0;
    textNodes.forEach(function (textNode) {
      var fragment = document.createDocumentFragment();
      Array.from(textNode.nodeValue || "").forEach(function (character) {
        var span = document.createElement("span");
        span.className = "typewriter-char";
        span.textContent = character;
        span.style.setProperty("--char-index", String(index));
        fragment.appendChild(span);
        index += 1;
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });

    return Array.from(visual.querySelectorAll(".typewriter-char"));
  }

  function initializeHeroMotion(root) {
    var scope = root || document;
    var target = scope.querySelector("[data-typewriter]");
    if (!target || target.dataset.typewriterReady === "true") return;

    var completeText = target.getAttribute("data-typewriter") || target.textContent.trim();
    target.setAttribute("aria-label", completeText);
    target.dataset.typewriterReady = "true";

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      target.classList.add("typewriter-complete");
      return;
    }

    var characters = wrapCharacters(target);
    if (!characters.length) return;

    target.classList.add("is-typing");
    var startedAt;
    var previousCount = 0;
    var millisecondsPerCharacter = 43;

    function drawFrame(timestamp) {
      if (!startedAt) startedAt = timestamp;
      var visibleCount = Math.min(
        characters.length,
        Math.floor((timestamp - startedAt) / millisecondsPerCharacter) + 1,
      );

      for (var index = previousCount; index < visibleCount; index += 1) {
        characters[index].classList.add("is-typed");
      }

      if (previousCount > 0) characters[previousCount - 1].classList.remove("is-current");
      if (visibleCount > 0 && visibleCount < characters.length) {
        characters[visibleCount - 1].classList.add("is-current");
      }
      previousCount = visibleCount;

      if (visibleCount < characters.length) {
        window.requestAnimationFrame(drawFrame);
        return;
      }

      characters[characters.length - 1].classList.remove("is-current");
      target.classList.remove("is-typing");
      target.classList.add("typewriter-complete");
    }

    window.requestAnimationFrame(drawFrame);
  }

  window.initializeHeroMotion = initializeHeroMotion;
  initializeHeroMotion(document);
})();
