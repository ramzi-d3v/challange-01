function resizeCard(event, width) {
  const card = document.getElementById("productCard");
  document
    .querySelectorAll(".demo-controls button")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  card.style.width = width + "px";
}

const card = document.getElementById("productCard");
const badge = document.getElementById("containerWidth");
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
    badge.textContent = "Width: " + Math.round(w) + "px";
  }
});
observer.observe(card);
