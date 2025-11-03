import { game, shortNum } from "./state.js";
import { renderShop } from "./shop.js";

const total_cookies = document.getElementById("total_cookies");
const per_click = document.getElementById("cookie_per_click");
const per_second = document.getElementById("cookie_per_second");

export function updateUI() {
  total_cookies.textContent = shortNum(game.cookie);
  per_click.textContent = shortNum(game.cookie_per_click);
  per_second.textContent = shortNum(game.cookie_per_second);
  renderShop();
}

export function wireCookieButton(onClick) {
  const btn = document.getElementById("cookie_button");
  btn.onclick = onClick;
}