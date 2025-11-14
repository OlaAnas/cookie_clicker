// storage.js
import { SAVE_KEY, game } from "./state.js";
import { shop } from "./shop.js";
import { recomputeFromItems } from "./items.js";
import { setTheme } from "./themes.js";

// Which themes are always unlocked in a fresh game
const DEFAULT_UNLOCKED_THEMES = {
  light: true,
  dark: true,
};

/**
 * Save the current game state to localStorage.
 * This includes cookie count, shop item levels, and the current theme.
 */
export function saveGame() {
  const state = {
    // core numbers
    cookie: game.cookie,
    cookie_per_click: game.cookie_per_click,
    cookie_per_second: game.cookie_per_second,

    // shop item levels
    shopLevels: shop.map(item => ({
      id: item.id,
      level: item.level,
    })),

    // theme info
    themeId: game.themeId,
    unlockedThemes: game.unlockedThemes,
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
    // fresh start: base values + default unlocked themes
    game.cookie = 0;
    game.cookie_per_click = 1;
    game.cookie_per_second = 0;
    game.themeId = "dark";
    game.unlockedThemes = { ...DEFAULT_UNLOCKED_THEMES };
    return;
  }

  try {
    const state = JSON.parse(saved);

    // --- cookies / base numbers ---
    game.cookie = Number(state.cookie) || 0;

    // theme id (we only store it here; main.js actually applies CSS)
    if (typeof state.themeId === "string") {
      game.themeId = state.themeId;
    } else {
      game.themeId = "dark";
    }

    // unlocked themes: either from save, or default collection
    if (state.unlockedThemes && typeof state.unlockedThemes === "object") {
      game.unlockedThemes = state.unlockedThemes;
    } else {
      game.unlockedThemes = { ...DEFAULT_UNLOCKED_THEMES };
    }

    // restore shop item levels
    if (Array.isArray(state.shopLevels)) {
      state.shopLevels.forEach(savedItem => {
        const shopItem = shop.find(i => i.id === savedItem.id);
        if (shopItem) {
          shopItem.level = Number(savedItem.level) || 0;
        }
      });
    }

    // recompute derived values based on owned items
    recomputeFromItems(shop, game);
  } catch (error) {
    console.error("Save file corrupted — clearing data:", error);
    localStorage.removeItem(SAVE_KEY);

    // fall back to a clean base state
    game.cookie = 0;
    game.cookie_per_click = 1;
    game.cookie_per_second = 0;
    game.themeId = "dark";
    game.unlockedThemes = { ...DEFAULT_UNLOCKED_THEMES };
  }
}

/**
 * Hard-reset the game to its base state.
 * Removes all saved data and restores initial values.
 */
export function resetGame(updateUI) {
  // Clear localStorage
  localStorage.removeItem(SAVE_KEY);

  // Reset core numbers
  game.cookie = 0;
  game.cookie_per_click = 1;
  game.cookie_per_second = 0;

  // Reset theme state
  game.themeId = "dark";
  game.unlockedThemes = { ...DEFAULT_UNLOCKED_THEMES };

  // Reset all shop item levels
  shop.forEach(item => {
    item.level = 0;
  });

  // Recalculate base stats (from empty shop)
  recomputeFromItems(shop, game);

  // Apply default theme visually
  setTheme("dark");

  // Re-render UI if a callback was provided
  if (typeof updateUI === "function") {
    updateUI();
  }
}
