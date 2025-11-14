// ui.js
import { game, shortNum } from "./state.js";
import { renderShop } from "./shop.js";
import { renderThemes } from "./themes.js";

// Cache references to key DOM elements once
const totalCookiesEl = document.getElementById("total_cookies");
const perClickEl     = document.getElementById("cookie_per_click");
const perSecondEl    = document.getElementById("cookie_per_second");
const cookieBtn      = document.getElementById("cookie_button");

/**
 * Refresh all on-screen counters and shop items.
 * Called whenever game state changes (click, upgrade, auto income, etc.).
 */
export function updateUI() {
  if (totalCookiesEl) totalCookiesEl.textContent = shortNum(game.cookie);
  if (perClickEl)     perClickEl.textContent     = shortNum(game.cookie_per_click);
  if (perSecondEl)    perSecondEl.textContent    = shortNum(game.cookie_per_second);

  // Re-render shop so costs / disabled-state keep up with cookie count
  renderShop();

  // Re-render themes so newly unlocked themes become clickable
  renderThemes();
}

/**
 * Connect the main cookie button to the click handler from main.js.
 * @param {Function} onClick - Function to run when cookie is clicked.
 */
export function wireCookieButton(onClick) {
  if (!cookieBtn) return; // defensive check
  cookieBtn.addEventListener("click", onClick);
}
