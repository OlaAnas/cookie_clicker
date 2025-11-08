import { game } from "./state.js";
import { updateUI, wireCookieButton } from "./ui.js";
import { wireShopBuying } from "./shop.js";
import { saveGame, loadGame, resetGame } from "./storage.js";

// Click cookie
wireCookieButton(() => {
  game.cookie += game.cookie_per_click;
  updateUI();
  saveGame();
});

// Shop buy handler: after buy → refresh + save
wireShopBuying(() => {
  updateUI();
  saveGame();
});

// Load, show, tick, autosave
loadGame();
updateUI();

setInterval(() => {
  game.cookie += game.cookie_per_second;
  updateUI();
}, 1000);

setInterval(saveGame, 1000);

// wire reset button
document.getElementById("reset_btn").onclick = () => {
  resetGame(updateUI);   // clears save, resets values, refreshes UI
};

// --- buying / click handling ---
// ⬇️  ADD THIS PART RIGHT HERE ⬇️
function handleShopClick(e) {
  const btn = e.target.closest(".shop-item");
  if (!btn) return;
  const id = btn.dataset.itemId;
  const item = shop.find(i => i.id === id);
  if (!item) return;

  if (item.buy(game)) {
    updateUI();
    saveGame();
  }
}

// attach the same listener to both sections
document.getElementById("shop-upgrades").addEventListener("click", handleShopClick);
document.getElementById("shop-autos").addEventListener("click", handleShopClick);