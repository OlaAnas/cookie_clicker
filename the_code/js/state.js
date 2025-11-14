// ============================
// Small Game Class (Light OOP)
// ============================

export class Game {
  constructor() {
    /** Total cookies owned */
    this.cookie = 0;

    /** Cookies gained by clicking */
    this.cookie_per_click = 1;

    /** Cookies gained automatically per second */
    this.cookie_per_second = 0;

    /** Which theme is active */
    this.themeId = "dark";
  }

  // ===== Optional Helper Methods =====
  addCookies(n) {
    this.cookie += n;
  }

  addCPS() {
    this.cookie += this.cookie_per_second;
  }
}

// Create ONE global instance for the whole app
export const game = new Game();


// ============================
// Helper: Short Number Format
// ============================

export function shortNum(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}


// ============================
// LocalStorage Key
// ============================

export const SAVE_KEY = "cookieClickerSave_v1";
