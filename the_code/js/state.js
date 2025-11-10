export const game = {
  /** Total number of cookies currently owned */
  cookie: 0,

  /** Cookies gained per click */
  cookie_per_click: 1,

  /** Cookies gained automatically per second */
  cookie_per_second: 0,
};

/**
 * Format large numbers into short readable strings.
 * Examples:
 *   1_500   → "1.5K"
 *   2_000_000 → "2.00M"
 *   1_200_000_000 → "1.20B"
 *
 * @param {number} num - The number to format
 * @returns {string} - A shortened string representation
 */
export function shortNum(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Constant key used for saving and loading from localStorage.
 * Changing this will reset saved data.
 */
export const SAVE_KEY = "cookieClickerSave_v1";