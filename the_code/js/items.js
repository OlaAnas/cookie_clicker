export class ShopItem {
  /**
   * @param {Object} opts - Configuration for the item.
   * @param {string} opts.id - Unique ID for the item (e.g., "click1", "auto3").
   * @param {string} opts.name - Display name.
   * @param {number} opts.baseCost - Starting cost for the item.
   * @param {number} [opts.costMul=1.5] - Cost multiplier per level.
   * @param {string} [opts.icon] - Optional image path for the item card.
   */
  constructor(opts) {
    this.id = opts.id;
    this.name = opts.name;
    this.baseCost = opts.baseCost;
    this.costMul = opts.costMul === undefined ? 1.5 : opts.costMul;
    this.level = 0; // “Owned” amount in the UI
    // If no icon provided, try to load one by convention: img/<id>.png
    this.icon = opts.icon || `img/${opts.id}.png`;
  }

  /**
   * Current cost based on level (owned amount).
   * Example: baseCost * costMul^level, rounded down.
   */
  get cost() {
    const scaled = this.baseCost * Math.pow(this.costMul, this.level);
    return Math.floor(scaled);
  }

  /** Whether the player can afford to buy one more. */
  canAfford(currentCookies) {
    return currentCookies >= this.cost;
  }

  /**
   * Apply this item's effect once (for one level).
   * Subclasses override this.
   */
  applyEffect(_game) {
    // no-op in base class
  }

  /**
   * Attempt to buy one unit of this item.
   * Decreases cookies by the current cost, increments level,
   * and applies the item's effect once.
   */
  buy(game) {
    if (!this.canAfford(game.cookie)) {
      return false;
    }

    game.cookie -= this.cost;
    this.level += 1;

    // Apply a single level of effect now.
    this.applyEffect(game);

    return true;
  }
}

/**
 * ClickUpgrade: increases cookies per click by a fixed amount per level.
 */
export class ClickUpgrade extends ShopItem {
  /**
   * @param {Object} opts
   * @param {number} opts.addPerClick - Amount added to CPC per level.
   */
  constructor(opts) {
    super(opts);
    this.addPerClick = opts.addPerClick;
  }

  applyEffect(game) {
    game.cookie_per_click += this.addPerClick;
  }
}

/**
 * AutoItem: increases cookies per second by a fixed amount per level.
 */
export class AutoItem extends ShopItem {
  /**
   * @param {Object} opts
   * @param {number} opts.addPerSecond - Amount added to CPS per level.
   */
  constructor(opts) {
    super(opts);
    this.addPerSecond = opts.addPerSecond;
  }

  applyEffect(game) {
    game.cookie_per_second += this.addPerSecond;
  }
}

/**
 * Rebuild derived stats (CPC/CPS) from the items you own.
 * Call this after loading from storage or after a full reset.
 */
export function recomputeFromItems(shop, game) {
  // Reset to base values before re-applying all owned levels.
  game.cookie_per_click = 1;
  game.cookie_per_second = 0;

  // For each item, apply its effect "level" times.
  shop.forEach((item) => {
    for (let i = 0; i < item.level; i += 1) {
      item.applyEffect(game);
    }
  });
}