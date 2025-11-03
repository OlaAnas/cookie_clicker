import { SAVE_KEY, game } from "./state.js";
import { shop } from "./shop.js";
import { recomputeFromItems } from "./items.js";

export function saveGame() {
  const state = {
    cookie: game.cookie,
    // cookie_per_click / per_second are derived; we can save for safety
    cookie_per_click: game.cookie_per_click,
    cookie_per_second: game.cookie_per_second,
    shopLevels: shop.map(i => ({ id: i.id, level: i.level })),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    const state = JSON.parse(saved);
    game.cookie = Number(state.cookie) || 0;

    // restore levels then recompute derived stats:
    if (Array.isArray(state.shopLevels)) {
      state.shopLevels.forEach(s => {
        const item = shop.find(i => i.id === s.id);
        if (item) item.level = Number(s.level) || 0;
      });
    }
    recomputeFromItems(shop, game);
  } catch (e) {
    console.error("Save corrupted, clearing…", e);
    localStorage.removeItem(SAVE_KEY);
  }
}

export function resetGame(updateUI) {
  localStorage.removeItem(SAVE_KEY);
  // Hard reset
  game.cookie = 0;
  // wipe levels
  shop.forEach(i => i.level = 0);
  recomputeFromItems(shop, game); // returns to base (1 click, 0/sec)
  updateUI?.();
}