import { SAVE_KEY, game } from "./state.js";
import { shop } from "./shop.js";
import { recomputeFromItems } from "./items.js";

/**
 * Save the current game state to localStorage.
 * This includes cookie count and the level ("Owned") of every shop item.
 */
export function saveGame() {
  const state = {
    cookie: game.cookie,

    // These are derived values (recomputed from items),
    // but we store them anyway for redundancy.
    cookie_per_click: game.cookie_per_click,
    cookie_per_second: game.cookie_per_second,

    // Store each shop item's id and level.
    shopLevels: shop.map(item => ({
      id: item.id,
      level: item.level
    })),
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save game:", err);
  }
}

/**
 * Load a previously saved game state from localStorage.
 * Rebuilds owned item levels and recalculates cookie_per_click / per_second.
 */
export function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) {
    return; // no save yet
  }

  try {
    const state = JSON.parse(saved);

    // Restore cookie count
    game.cookie = Number(state.cookie) || 0;

    // Restore item levels from save file
    if (Array.isArray(state.shopLevels)) {
      state.shopLevels.forEach(savedItem => {
        const shopItem = shop.find(i => i.id === savedItem.id);
        if (shopItem) {
          shopItem.level = Number(savedItem.level) || 0;
        }
      });
    }

    // Recompute derived values based on owned items
    recomputeFromItems(shop, game);
  } catch (error) {
    console.error("Save file corrupted — clearing data:", error);
    localStorage.removeItem(SAVE_KEY);
  }
}

/**
 * Hard-reset the game to its base state.
 * Removes all saved data and restores initial values.
 */
export function resetGame(updateUI) {
  // Clear localStorage
  localStorage.removeItem(SAVE_KEY);

  // Reset cookies and shop levels
  game.cookie = 0;
  shop.forEach(item => {
    item.level = 0;
  });

  // Recalculate base stats (1 per click, 0 per second)
  recomputeFromItems(shop, game);

  // Re-render UI if a callback was provided
  if (typeof updateUI === "function") {
    updateUI();
  }
}