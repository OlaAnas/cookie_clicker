export class ShopItem {
  constructor({ id, name, baseCost, costMul = 1.5 }) {
    this.id = id;
    this.name = name;
    this.baseCost = baseCost;
    this.costMul = costMul;
    this.level = 0;
  }
  get cost() { return Math.floor(this.baseCost * Math.pow(this.costMul, this.level)); }
  canAfford(cookies) { return cookies >= this.cost; }
  applyEffect(_game) {} // overridden by subclasses
  buy(game) {
    if (!this.canAfford(game.cookie)) return false;
    game.cookie -= this.cost;
    this.level += 1;
    this.applyEffect(game);
    return true;
  }
}

export class ClickUpgrade extends ShopItem {
  constructor(opts) { super(opts); this.addPerClick = opts.addPerClick; }
  applyEffect(game) { game.cookie_per_click += this.addPerClick; }
}

export class AutoItem extends ShopItem {
  constructor(opts) { super(opts); this.addPerSecond = opts.addPerSecond; }
  applyEffect(game) { game.cookie_per_second += this.addPerSecond; }
}

// After loading levels, rebuild derived stats from items:
export function recomputeFromItems(shop, game) {
  game.cookie_per_click = 1;
  game.cookie_per_second = 0;
  shop.forEach(item => { for (let k = 0; k < item.level; k++) item.applyEffect(game); });
}

// This goes below your ClickUpgrade and AutoItem classes in items.js
export class GlobalMultiplierUpgrade extends ShopItem {
  constructor(opts) {
    super(opts);
    this.clickMul = opts.clickMul ?? 1; // how much to multiply click power (e.g., 1.5 = +50%)
    this.cpsMul = opts.cpsMul ?? 1;     // how much to multiply cookies per second
    this.owned = false;                 // you can buy it only once
  }

  get cost() {
    return this.baseCost;               // cost never increases
  }

  applyEffect(game) {
    // only apply once
    if (this.owned) return;

    if (this.clickMul !== 1)
      game.cookie_per_click *= this.clickMul;

    if (this.cpsMul !== 1)
      game.cookie_per_second *= this.cpsMul;

    this.owned = true;
  }

  buy(game) {
    if (this.owned) return false;               // already bought
    if (!this.canAfford(game.cookie)) return false; // not enough cookies
    game.cookie -= this.baseCost;               // pay cost
    this.applyEffect(game);                     // apply multiplier
    return true;
  }
}