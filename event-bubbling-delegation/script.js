const itemContainer = document.getElementById("item-container");
const addButton = document.getElementById("add-item");
const childButton = document.getElementById("child-btn");
const parentDiv = document.getElementById("parent-div");
const itemStatus = document.getElementById("item-status");
const nestedStatus = document.getElementById("nested-status");
const consoleLog = document.getElementById("console-log");
const logEmpty = document.getElementById("log-empty");

// ── Log helper ──
function addLog(msg, type) {
  logEmpty && (logEmpty.style.display = "none");
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const tagMap = {
    delegation: "Delegate",
    stopped: "Stopped",
    bubbled: "Bubbled",
    added: "Added"
  };
  const entry = document.createElement("div");
  entry.className = `log-entry type-${type}`;
  entry.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-tag">${tagMap[type] || type}</span>
      <span class="log-msg">${msg}</span>`;
  consoleLog.appendChild(entry);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

// ── Flash helper ──
function flash(el, cls, duration = 320) {
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), duration);
}

// ── Event delegation on item container ──
itemContainer.addEventListener("click", function (e) {
  const item = e.target.closest(".item");
  if (!item) return;
  itemStatus.textContent = `Clicked: "${item.textContent.trim()}"`;
  flash(itemStatus, "flash-accent");
  flash(item, "item-clicked");
  addLog(
    `Delegation caught click on "${item.textContent.trim()}"`,
    "delegation"
  );
});

// ── Add new item ──
addButton.addEventListener("click", () => {
  const count = document.querySelectorAll(".item").length + 1;
  const newItem = document.createElement("div");
  newItem.className = "item new-item";
  newItem.textContent = `Dynamic Item ${count}`;
  itemContainer.appendChild(newItem);
  setTimeout(() => newItem.classList.remove("new-item"), 300);
  itemStatus.textContent = `Dynamic Item ${count} added — delegation still works on it.`;
  flash(itemStatus, "flash-good");
  addLog(`Dynamic Item ${count} created and appended to DOM`, "added");
});

// ── Child button — stops propagation ──
childButton.addEventListener("click", function (e) {
  e.stopPropagation();
  nestedStatus.textContent =
    "Child button clicked — propagation stopped. Parent never fires.";
  flash(nestedStatus, "flash-good");
  flash(childButton, "flash-good");
  addLog("Child button clicked — e.stopPropagation() called", "stopped");
});

// ── Parent div — only fires if propagation reaches it ──
parentDiv.addEventListener("click", function () {
  nestedStatus.textContent =
    "Parent div clicked — event bubbled up from child (or direct click).";
  flash(nestedStatus, "flash-bad");
  flash(parentDiv, "flash-bad");
  addLog("Parent div received click — bubbling occurred", "bubbled");
});

// ── Clear log ──
document.getElementById("log-clear").addEventListener("click", () => {
  consoleLog.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "log-empty";
  empty.id = "log-empty";
  empty.textContent = "Interact with the demos above to see logs here";
  consoleLog.appendChild(empty);
});
