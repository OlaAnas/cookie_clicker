// shop.js
import { game, shortNum } from "./state.js";
import { ClickUpgrade, AutoItem } from "./items.js";
import { saveGame } from "./storage.js";
import { updateUI } from "./ui.js";

// -----------------------------------------------------------------------------
// 1) Define your shop items in ONE array
// -----------------------------------------------------------------------------
export const shop = [
  // --- Click Upgrades ---
  new ClickUpgrade({ id: "click1",  name: "Golden Gloves",          baseCost: 50,      costMul: 1.6, addPerClick: 2,   icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click2",  name: "Magic Sugar",            baseCost: 300,     costMul: 1.6, addPerClick: 5,   icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click3",  name: "Grandma’s Recipe Book",  baseCost: 2500,    costMul: 1.6, addPerClick: 10,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click4",  name: "Non-Stop Oven Timer",    baseCost: 10000,   costMul: 1.7, addPerClick: 20,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click5",  name: "Industrial Ovens",       baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click6",  name: "Butterstorm",            baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click7",  name: "Master Chef Medal",      baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click8",  name: "Cookie Crown",           baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click9",  name: "Quantum Dough Mixer",    baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click10", name: "The Cookie Singularity", baseCost: 25000,   costMul: 1.7, addPerClick: 50,  icon: "img/placeholder.png" }),

  // --- Auto Clickers ---
  new AutoItem({ id: "auto1",  name: "Mom",            baseCost: 100,      costMul: 1.5, addPerSecond: 1,      icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto2",  name: "Grandma",        baseCost: 500,      costMul: 1.5, addPerSecond: 5,      icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto3",  name: "Kitchen",        baseCost: 2000,     costMul: 1.6, addPerSecond: 15,     icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto4",  name: "Chef",           baseCost: 7000,     costMul: 1.6, addPerSecond: 40,     icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto5",  name: "Restaurant",     baseCost: 15000,    costMul: 1.6, addPerSecond: 100,    icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto6",  name: "Bakery",         baseCost: 50000,    costMul: 1.6, addPerSecond: 300,    icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto7",  name: "Factory",        baseCost: 120000,   costMul: 1.7, addPerSecond: 1000,   icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto8",  name: "Cookie City",    baseCost: 500000,   costMul: 1.7, addPerSecond: 5000,   icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto9",  name: "Cookie Land",    baseCost: 2500000,  costMul: 1.8, addPerSecond: 25000,  icon: "img/placeholder.png" }),
  new AutoItem({ id: "auto10", name: "Cookie Universe",baseCost: 10000000, costMul: 1.8, addPerSecond: 100000, icon: "img/placeholder.png" }),
];

// -----------------------------------------------------------------------------
// 1.5) Icon mapping for Bootstrap Icons
// -----------------------------------------------------------------------------
const iconClassMap = {
  // Click upgrades
  click1:  "bi-hand-index-fill",   // Golden Gloves
  click2:  "bi-stars",             // Magic Sugar
  click3:  "bi-journal",           // Recipe Book
  click4:  "bi-alarm",             // Oven Timer
  click5:  "bi-fire",              // Industrial Ovens
  click6:  "bi-cloud-rain-heavy",  // Butterstorm
  click7:  "bi-award",             // Master Chef Medal
  click8:  "bi-gem",               // Cookie Crown
  click9:  "bi-lightning-charge",  // Quantum Mixer
  click10: "bi-shield-shaded",     // Singularity

  // Auto items
  auto1:  "bi-person",             // Mom
  auto2:  "bi-person-hearts",      // Grandma
  auto3:  "bi-house-door",         // Kitchen
  auto4:  "bi-egg-fried",          // Chef
  auto5:  "bi-shop",               // Restaurant
  auto6:  "bi-basket",             // Bakery
  auto7:  "bi-building-gear",      // Factory
  auto8:  "bi-buildings",          // Cookie City
  auto9:  "bi-globe-americas",     // Cookie Land
  auto10: "bi-stars"               // Cookie Universe
};

// -----------------------------------------------------------------------------
// 2) Buy helper (clear + readable)
// -----------------------------------------------------------------------------
function handleBuy(item) {
  const bought = item.buy(game);
  if (!bought) return;

  updateUI();
  saveGame();
}

// -----------------------------------------------------------------------------
// 3) Render helpers (two sections: Upgrades, Auto-Clickers)
// -----------------------------------------------------------------------------
function renderList(containerId, items) {
  const list = document.getElementById(containerId);
  if (!list) return;

  list.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");
    // ✅ Bootstrap button + your own class
    button.className = "shop-item btn btn-outline-light w-100";

    // enable/disable based on affordability
    const affordable = item.canAfford(game.cookie);
    button.disabled = !affordable;

    // Display fields
    const costLabel = `Cost: ${shortNum(item.cost)}`;
    const owned     = item.level; // amount the player owns

    let effectRow = "";
    let totalRow  = "";

    if (item instanceof AutoItem) {
      // Auto-clicker
      effectRow = `CPS: +${shortNum(item.addPerSecond)}/s each`;
      totalRow  = `Total: +${shortNum(item.addPerSecond * owned)}/s`;
    } else {
      // Click upgrade
      effectRow = `Click: +${shortNum(item.addPerClick)} each`;
      totalRow  = `Total: +${shortNum(item.addPerClick * owned)} per click`;
    }

    // Pick Bootstrap icon class based on id
    const iconClass = iconClassMap[item.id] || "bi-circle-fill";

    button.innerHTML = `
      <div class="row">
        <i class="bi ${iconClass} icon"></i>
        <div class="meta-wrap">
          <div class="name">${item.name}</div>
          <div class="cost">${costLabel}</div>
          <div class="owned">Owned: ${owned}</div>
          <div class="effect">${effectRow}</div>
          <div class="total">${totalRow}</div>
        </div>
      </div>
    `;

    // Direct binding: item is closed over, no id lookups
    button.addEventListener("click", function onClick() {
      handleBuy(item);
    });

    list.appendChild(button);
  });
}

// -----------------------------------------------------------------------------
// 4) Public render function (called from updateUI)
// -----------------------------------------------------------------------------
export function renderShop() {
  const upgrades = shop.filter(i => !(i instanceof AutoItem));
  const autos    = shop.filter(i =>  (i instanceof AutoItem));

  renderList("shop-upgrades", upgrades);
  renderList("shop-autos", autos);
}
