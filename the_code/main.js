const cookie_button = document.getElementById("cookie_button");
const total_cookies = document.getElementById("total_cookies");
const per_click = document.getElementById("cookie_per_click");
const cookie_per_second_display = document.getElementById("cookie_per_second");

const SAVE_KEY = "cookieClickerSave_v1";

// === Helpers ===
function shortNum(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

// === Core game state ===
const game = {
  cookie: 0,
  cookie_per_click: 1,
  cookie_per_second: 0,
};

// === Classes ===
class ShopItem {
  constructor({ id, name, baseCost, costMul = 1.5 }) {
    this.id = id;
    this.name = name;
    this.baseCost = baseCost;
    this.costMul = costMul;
    this.level = 0;
  }
  get cost() { return Math.floor(this.baseCost * Math.pow(this.costMul, this.level)); }
  canAfford(cookies) { return cookies >= this.cost; }
  applyEffect(game) {}
  buy(game) {
    if (!this.canAfford(game.cookie)) return false;
    game.cookie -= this.cost;
    this.level += 1;
    this.applyEffect(game);
    return true;
  }
}
class ClickUpgrade extends ShopItem {
  constructor(opts) { super(opts); this.addPerClick = opts.addPerClick; }
  applyEffect(game) { game.cookie_per_click += this.addPerClick; }
}
class AutoItem extends ShopItem {
  constructor(opts) { super(opts); this.addPerSecond = opts.addPerSecond; }
  applyEffect(game) { game.cookie_per_second += this.addPerSecond; }
}

// === Shop definition ===
const shop = [
  new ClickUpgrade({ id: "click1", name: "+1 per click", baseCost: 10,  costMul: 1.5, addPerClick: 1 }),
  new AutoItem    ({ id: "auto1",  name: "Cursor (+1/s)", baseCost: 50,  costMul: 1.5, addPerSecond: 1 }),
  // add more later:
  // new ClickUpgrade({ id: "click2", name: "+5 per click", baseCost: 250, addPerClick: 5 }),
  // new AutoItem    ({ id: "auto2",  name: "Grandma (+5/s)", baseCost: 400, addPerSecond: 5 }),
];

// === Rendering ===
function renderShop() {
  const list = document.getElementById("shop");
  list.innerHTML = "";
  shop.forEach(item => {
    const el = document.createElement("button");
    el.className = "shop-item";
    el.dataset.itemId = item.id;
    el.disabled = !item.canAfford(game.cookie);
    el.innerHTML = `
      <div class="name">${item.name}</div>
      <div class="cost">Cost: ${shortNum(item.cost)}</div>
      <div class="lvl">Lvl: ${item.level}</div>
    `;
    list.appendChild(el);
  });
}

// one handler for all shop items
document.getElementById("shop").addEventListener("click", (e) => {
  const btn = e.target.closest(".shop-item");
  if (!btn) return;
  const id = btn.dataset.itemId;
  const item = shop.find(i => i.id === id);
  if (!item) return;
  if (item.buy(game)) { updateUI(); saveGame(); }
});

// === UI ===
function updateUI() {
  total_cookies.textContent = shortNum(game.cookie);
  per_click.textContent = shortNum(game.cookie_per_click);
  cookie_per_second_display.textContent = shortNum(game.cookie_per_second);
  renderShop();
}

// === Save/Load ===
function saveGame() {
  const state = {
    cookie: game.cookie,
    cookie_per_click: game.cookie_per_click,
    cookie_per_second: game.cookie_per_second,
    shopLevels: shop.map(i => ({ id: i.id, level: i.level })),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    const state = JSON.parse(saved);
    game.cookie = Number(state.cookie) || 0;
    // reset to base, then reapply item effects by level
    game.cookie_per_click = 1;
    game.cookie_per_second = 0;

    if (Array.isArray(state.shopLevels)) {
      state.shopLevels.forEach(s => {
        const item = shop.find(i => i.id === s.id);
        if (item) item.level = Number(s.level) || 0;
      });
    }
    // Re-apply effects
    shop.forEach(item => { for (let k = 0; k < item.level; k++) item.applyEffect(game); });
  } catch (e) {
    console.error("Save corrupted; clearing...", e);
    localStorage.removeItem(SAVE_KEY);
  }
}

// === Wire cookie click ===
cookie_button.onclick = function () {
  game.cookie += game.cookie_per_click;
  updateUI();
  saveGame();
};

// === Tick & autosave ===
setInterval(function () {
  game.cookie += game.cookie_per_second;
  updateUI();
}, 1000);

setInterval(saveGame, 5000);

// === Boot ===
loadGame();
updateUI();