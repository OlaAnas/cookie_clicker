// shop.js
import { game, shortNum } from "./state.js";
import { ClickUpgrade, AutoItem /*, GlobalMultiplierUpgrade */ } from "./items.js";

// 1) Define your shop items in ONE array
export const shop = [
  // --- Click Upgrades ---
  new ClickUpgrade({ id: "click1",  name: "Golden Gloves",            baseCost: 50,      costMul: 1.6, addPerClick: 2  ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click2",  name: "Magic Sugar",              baseCost: 300,     costMul: 1.6, addPerClick: 5 ,icon: "img/placeholder.png" }),
  new ClickUpgrade({ id: "click3",  name: "Grandma’s Recipe Book",    baseCost: 2500,    costMul: 1.6, addPerClick: 10 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click4",  name: "Non-Stop Oven Timer",      baseCost: 10000,   costMul: 1.7, addPerClick: 20 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click5",  name: "Industrial Ovens",         baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click6",  name: "Butterstorm",              baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click7",  name: "Master Chef Medal",        baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click8",  name: "Cookie Crown",             baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click9",  name: "Quantum Dough Mixer",      baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),
  new ClickUpgrade({ id: "click10", name: "The Cookie Singularity",   baseCost: 25000,   costMul: 1.7, addPerClick: 50 ,icon: "img/placeholder.png"}),

  // --- Auto Clickers ---
  new AutoItem({ id: "auto1",  name: "Mom",            baseCost: 100,      costMul: 1.5, addPerSecond: 1      ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto2",  name: "Grandma",        baseCost: 500,      costMul: 1.5, addPerSecond: 5      ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto3",  name: "Kitchen",        baseCost: 2000,     costMul: 1.6, addPerSecond: 15     ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto4",  name: "Chef",           baseCost: 7000,     costMul: 1.6, addPerSecond: 40     ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto5",  name: "Restaurant",     baseCost: 15000,    costMul: 1.6, addPerSecond: 100    ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto6",  name: "Bakery",         baseCost: 50000,    costMul: 1.6, addPerSecond: 300    ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto7",  name: "Factory",        baseCost: 120000,   costMul: 1.7, addPerSecond: 1000   ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto8",  name: "Cookie City",    baseCost: 500000,   costMul: 1.7, addPerSecond: 5000   ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto9",  name: "Cookie Land",    baseCost: 2500000,  costMul: 1.8, addPerSecond: 25000  ,icon: "img/placeholder.png"}),
  new AutoItem({ id: "auto10", name: "Cookie Universe",baseCost: 10000000, costMul: 1.8, addPerSecond: 100000 ,icon: "img/placeholder.png"}),
];

// 2) Render helpers for two sections
function renderList(containerId, items) {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = "";
  items.forEach(item => {
    const el = document.createElement("button");
    el.className = "shop-item";
    el.dataset.itemId = item.id;

    const affordable = item.canAfford(game.cookie);
    el.disabled = !affordable;

    const costLabel = `Cost: ${shortNum(item.cost)}`;
    const meta =
      item instanceof AutoItem ? `Lvl: ${item.level}` : `Click: +${shortNum(item.addPerClick)}`;
    const effectRow =
      item instanceof AutoItem ? `CPS: +${shortNum(item.addPerSecond)}/s` : "";

    el.innerHTML = `
      <div class="row">
        <img class="icon" src="${item.icon}" alt="${item.name} icon" loading="lazy" />
        <div class="meta-wrap">
          <div class="name">${item.name}</div>
          <div class="cost">${costLabel}</div>
          <div class="lvl">${meta}</div>
          <div class="effect">${effectRow}</div>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
}

export function renderShop() {
  const upgrades = shop.filter(i => !(i instanceof AutoItem));
  const autos    = shop.filter(i =>  (i instanceof AutoItem));
  renderList("shop-upgrades", upgrades);
  renderList("shop-autos", autos);
}

export function wireShopBuying(onAfterBuy) {
  function handleShopClick(e) {
    const btn = e.target.closest(".shop-item");
    if (!btn) return;
    const id = btn.dataset.itemId;
    const item = shop.find(i => i.id === id);
    if (!item) return;
    if (item.buy(game)) onAfterBuy?.();
  }
  const upg = document.getElementById("shop-upgrades");
  const aut = document.getElementById("shop-autos");
  if (upg) upg.addEventListener("click", handleShopClick);
  if (aut) aut.addEventListener("click", handleShopClick);
}