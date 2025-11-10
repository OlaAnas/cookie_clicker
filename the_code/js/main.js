import { game } from "./state.js";
import { updateUI, wireCookieButton } from "./ui.js";
import { saveGame, loadGame, resetGame } from "./storage.js";

// Interval settings (easy to tweak/grade)
const TICK_MS = 1000;     // add CPS to cookies once per second
const AUTOSAVE_MS = 5000; // save every 5 seconds (1s is overkill)

// Handle cookie clicks (named for readability)
function onCookieClick() {
  game.cookie += game.cookie_per_click;
  updateUI();
  saveGame();
}

// Handle reset button
function wireResetButton() {
  const btn = document.getElementById("reset_btn");
  if (!btn) return; // defensive if element is missing
  btn.addEventListener("click", function onReset() {
    resetGame(updateUI);
  });
}

// Start the CPS tick loop
function startTickLoop() {
  setInterval(function tick() {
    game.cookie += game.cookie_per_second;
    updateUI();
  }, TICK_MS);
}

// Start autosave loop
function startAutosave() {
  setInterval(function autosave() {
    saveGame();
  }, AUTOSAVE_MS);

  // Also save when the tab is closing/refreshing
  window.addEventListener("beforeunload", saveGame);
}

// Initialize app (clear order of operations)
function init() {
  // 1) Load previous session
  loadGame();

  // 2) Wire UI
  wireCookieButton(onCookieClick);
  wireResetButton();

  // 3) First paint
  updateUI(); // (updateUI should call renderShop() inside)

  // 4) Loops
  startTickLoop();
  startAutosave();
}

// Because the script is at the end of <body>, DOM is already ready.
// Still safe to call directly:
init();