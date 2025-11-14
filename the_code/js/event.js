// event.js
import { game } from "./state.js";
import { updateUI } from "./ui.js";

export const activeEvent = {
  name: null,
  expiresAt: 0,
};

// random event timings
const MIN_DELAY = 20;   // earliest: 20 seconds
const MAX_DELAY = 60;   // latest: 60 seconds

let nextEventTime = Date.now() + rand(MIN_DELAY, MAX_DELAY) * 1000;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Launch one random event
function triggerRandomEvent() {
  const events = ["golden", "fever", "cpsBoost"];
  const pick = events[Math.floor(Math.random() * events.length)];

  if (pick === "golden") {
    activateGoldenCookie();
  }
  if (pick === "fever") {
    activateFever();
  }
  if (pick === "cpsBoost") {
    activateCPSBoost();
  }
}

// -------------------------
// GOLDEN COOKIE EVENT
// -------------------------
function activateGoldenCookie() {
  activeEvent.name = "golden";
  activeEvent.expiresAt = Date.now() + 7000; // 7 sec

  const el = document.createElement("div");
  el.id = "golden-cookie";
  el.textContent = "🍪✨";
  el.className = "golden-popup";

  document.body.appendChild(el);

  el.addEventListener("click", () => {
    game.cookie += 200 * game.cookie_per_click;
    endEvent();
  });
}

// -------------------------
// FEVER MODE (x2 click power)
// -------------------------
function activateFever() {
  activeEvent.name = "fever";
  activeEvent.expiresAt = Date.now() + 15000; // 15 sec

  game.clickMultiplier = 2;

  document.body.classList.add("fever-mode");
}

// -------------------------
// TEMP CPS BOOST
// -------------------------
function activateCPSBoost() {
  activeEvent.name = "cpsBoost";
  activeEvent.expiresAt = Date.now() + 12000; // 12 sec

  game.cpsBoost = 2;
}

// -------------------------
// End any active event
// -------------------------
export function endEvent() {
  document.body.classList.remove("fever-mode");
  const el = document.getElementById("golden-cookie");
  if (el) el.remove();

  game.clickMultiplier = 1;
  game.cpsBoost = 1;

  activeEvent.name = null;
  activeEvent.expiresAt = 0;

  nextEventTime = Date.now() + rand(MIN_DELAY, MAX_DELAY) * 1000;
}

// -------------------------
// MAIN LOOP — called inside your tick loop
// -------------------------
export function eventLoop() {
  const now = Date.now();

  if (!activeEvent.name && now >= nextEventTime) {
    triggerRandomEvent();
  }

  if (activeEvent.name && now >= activeEvent.expiresAt) {
    endEvent();
  }
}
