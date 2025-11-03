// Core game numbers in one place
export const game = {
  cookie: 0,
  cookie_per_click: 1,
  cookie_per_second: 0,
};

// Small number formatter
export function shortNum(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

// One place for the save key
export const SAVE_KEY = "cookieClickerSave_v1";