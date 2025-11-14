// state.js

export class Game {
  constructor() {
    /** Total number of cookies currently owned */
    this.cookie = 0;

    /** Cookies gained per click */
    this.cookie_per_click = 1;

    /** Cookies gained automatically per second */
    this.cookie_per_second = 0;

    this.clickMultiplier= 1,
    this.cpsBoost= 1,

    /** Current theme id */
    this.themeId = "dark";

  
    this.unlockedThemes = {
      light: true,
      dark: true,

    };
  }
}

// Create a single shared instance
export const game = new Game();

/**
 * Format large numbers into short readable strings.
 */
export function shortNum(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export const SAVE_KEY = "cookieClickerSave_v1";
