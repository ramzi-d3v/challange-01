/* ── Debounce utility ── */
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/* ══════════════════════════════════════
     01 — Live Search
  ══════════════════════════════════════ */
const data = [
  "Apple",
  "Banana",
  "Cherry",
  "Mango",
  "Strawberry",
  "Blueberry",
  "Orange",
  "Grapes",
  "Pineapple"
];
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const resultsEmpty = document.getElementById("results-empty");
const debounceBar = document.getElementById("debounce-bar");

let barTimeout;

function searchItems(query) {
  // Reset bar
  debounceBar.classList.remove("running");
  debounceBar.classList.add("done");
  requestAnimationFrame(() => debounceBar.classList.remove("done"));

  // Clear old results (keep empty msg el)
  resultsDiv.querySelectorAll(".result-item").forEach((el) => el.remove());

  if (!query) {
    resultsEmpty.style.display = "";
    return;
  }
  resultsEmpty.style.display = "none";
  const filtered = data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
  if (filtered.length === 0) {
    resultsEmpty.style.display = "";
    resultsEmpty.textContent = `No results for "${query}"`;
    return;
  }
  resultsEmpty.textContent = "Results appear 500ms after you stop typing";
  filtered.forEach((item) => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = item;
    resultsDiv.appendChild(div);
  });
}

const debouncedSearch = debounce(searchItems, 500);

searchInput.addEventListener("input", () => {
  // Animate the debounce bar
  debounceBar.classList.remove("running", "done");
  void debounceBar.offsetWidth; // reflow
  debounceBar.classList.add("running");
  debouncedSearch(searchInput.value);
});

/* ══════════════════════════════════════
     02 — Debounced Button
  ══════════════════════════════════════ */
const btn = document.getElementById("debounceBtn");
const message = document.getElementById("message");
const cooldownTrack = document.getElementById("cooldown-track");
const cooldownFill = document.getElementById("cooldown-fill");
let isClickable = true;

function handleClick() {
  if (!isClickable) return;
  message.textContent = "Action fired!";
  message.classList.remove("empty");
  isClickable = false;
  btn.disabled = true;

  // Cooldown bar
  cooldownTrack.classList.add("visible");
  cooldownFill.classList.remove("counting");
  void cooldownFill.offsetWidth;
  cooldownFill.classList.add("counting");

  setTimeout(() => {
    isClickable = true;
    btn.disabled = false;
    message.textContent = "—";
    message.classList.add("empty");
    cooldownTrack.classList.remove("visible");
    cooldownFill.classList.remove("counting");
  }, 2000);
}

const debouncedAction = debounce(handleClick, 500);
btn.addEventListener("click", debouncedAction);

/* ══════════════════════════════════════
     03 — Window Resize
  ══════════════════════════════════════ */
const resizeW = document.getElementById("resize-w");
const resizeH = document.getElementById("resize-h");
const resizeDot = document.getElementById("resize-dot");
const resizeTxt = document.getElementById("resize-status-text");

// Init with current values
resizeW.textContent = window.innerWidth;
resizeH.textContent = window.innerHeight;

function updateSize() {
  resizeW.textContent = window.innerWidth;
  resizeH.textContent = window.innerHeight;
  resizeDot.classList.remove("active");
  resizeTxt.textContent = `Updated — ${window.innerWidth} × ${window.innerHeight}`;
  // Flash values
  [resizeW, resizeH].forEach((el) => {
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 150);
  });
  setTimeout(() => {
    resizeTxt.textContent = "Resize the window — fires 300ms after you stop";
  }, 1500);
}

const debouncedResize = debounce(updateSize, 300);

window.addEventListener("resize", () => {
  resizeDot.classList.add("active");
  resizeTxt.textContent = "Resizing… waiting for you to stop";
  debouncedResize();
});
