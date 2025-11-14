// themes.js
import { game } from "./state.js";
import { saveGame } from "./storage.js";

class Theme {
  constructor({ id, name, vars, cookieImg, unlockAt = 0 }) {
    this.id = id;
    this.name = name;
    this.vars = vars;           // { "bg-color": "#...", "panel-bg": "#...", ... }
    this.cookieImg = cookieImg; // "img/cookie_light.png" etc.
    this.unlockAt = unlockAt;   // cookies required to unlock
  }

  /**
   * A theme is unlocked if:
   *  - it's in game.unlockedThemes, OR
   *  - unlockAt === 0, OR
   *  - cookieCount >= unlockAt (and then we permanently add it to unlockedThemes)
   */
  isUnlocked(cookieCount) {
    // make sure the structure exists
    if (!game.unlockedThemes) {
      game.unlockedThemes = { light: true, dark: true };
    }

    // already unlocked in save
    if (game.unlockedThemes[this.id]) {
      return true;
    }

    // themes with unlockAt 0 are always unlocked
    if (this.unlockAt === 0) {
      game.unlockedThemes[this.id] = true;
      saveGame();
      return true;
    }

    // newly unlocked because we reached required cookies
    if (cookieCount >= this.unlockAt) {
      game.unlockedThemes[this.id] = true;
      saveGame();
      return true;
    }

    // still locked
    return false;
  }

  apply() {
    const root = document.documentElement;

    // apply all CSS variables
    Object.entries(this.vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // swap cookie image if provided
    if (this.cookieImg) {
      const img = document.getElementById("cookie_img");
      if (img) img.src = this.cookieImg;
    }
  }
}

// ---- define all themes here ----
export const THEMES = [
  // always-available themes (unlockAt: 0)
  new Theme({
    id: "light",
    name: "Warm Light",
    unlockAt: 0,
    cookieImg: "img/light-theme.png",
    vars: {
      /* ==== Backgrounds ==== */
      "bg-color":        "#FFF9EF",   // soft cream (main background)
      "frame-bg":        "#FFEFD4",   // warm beige frame
      "box-bg":          "#FFE8C7",   // paige / soft vanilla box
      "panel-bg":        "#FFF3DD",   // butter-cream inner panels

      /* ==== Shop items ==== */
      "shop-bg":             "#FFE3BB",   // warm beige for shop cards
      "shop-bg-disabled":    "#EED5A6",   // darker beige (NOT grey)

      /* ==== Borders & Lines ==== */
      "border-color":    "#7A4A1A",   // real chocolate brown
      "scrollbar-thumb": "#D6B48A",   // soft toasted beige

      /* ==== Text ==== */
      "text-color":      "#4F2D12",   // readable warm brown
      "muted-text":      "#A37544",   // caramel (for cost / lvl)
      "text-strong":     "#3E200D",   // darker brown for titles
      "text-muted":      "#9B7043",   // supporting text

      /* ==== Accent ==== */
      "accent-color":    "#FFF9EF"
    }
  }),

  new Theme({
    id: "dark",
    name: "Cozy Dark Chocolate",
    unlockAt: 0,
    cookieImg: "img/cookie_dark.png",
    vars: {
      /* ==== Backgrounds ==== */
      "bg-color":        "#0C0908",   // near-black chocolate
      "frame-bg":        "#1A1412",   // deep cocoa brown
      "box-bg":          "#221A17",   // warm dark beige/brown (panels)
      "panel-bg":        "#2B211D",   // inner darker chocolate

      /* ==== Shop items ==== */
      "shop-bg":             "#2F2522",   // muted cocoa for shop cards
      "shop-bg-disabled":    "#3A2D29",   // slightly lighter chocolate

      /* ==== Borders ==== */
      "border-color":    "#7B4A33",   // caramel brown (soft)
      "scrollbar-thumb": "#5E3C2B",   // dark caramel

      /* ==== Text ==== */
      "text-color":      "#F4E2C6",   // light paige (VERY readable)
      "muted-text":      "#C7AB8F",   // softer light paige
      "text-strong":     "#FFEBD2",   // brightest text for titles
      "text-muted":      "#CBB49B",   // supporting caramel beige

      /* ==== Accent ==== */
      "accent-color":    "#0C0908"
    }
  }),

  new Theme({
    id: "boldCandy",
    name: "Bold Candy",
    unlockAt: 1_000,
    cookieImg: "img/pitbull-cookie.png",
    vars: {
      /* ===== BACKGROUNDS ===== */
      "bg-color":        "#FFE600",   // neon yellow (outer background)
      "frame-bg":        "#FF6A00",   // hot orange frame
      "box-bg":          "#005CFF",   // electric blue boxes
      "panel-bg":        "#FF008A",   // hot pink panels

      /* ===== SHOP BUTTONS ===== */
      "shop-bg":             "#FFE600",  // bright yellow enabled
      "shop-bg-disabled":    "#3AFF00",  // neon green disabled

      /* ===== BORDERS ===== */
      "border-color":    "#FF6A00",   // strong orange
      "scrollbar-thumb": "#FF6A00",

      /* ===== TEXT ===== */
      "text-color":      "#FFFFFF",
      "muted-text":      "#FCD9FF",
      "text-strong":     "#FFFFFF",
      "text-muted":      "#F7E3FF",

      /* ===== ACCENT ===== */
      "accent-color":    "#FF008A"
    }
  }),

  new Theme({
    id: "invert",
    name: "Negative",
    unlockAt: 5_000,
    cookieImg: "img/negative-cookie.png",
    vars: {
      "bg-color":          "#4B18A4",   // deep violet
      "frame-bg":          "#9FF5D3",   // minty frame
      "box-bg":            "#241A10",   // chocolate brown
      "panel-bg":          "#2E255E",   // royal purple
      "shop-bg":           "#2E255E",
      "shop-bg-disabled":  "#5B4A2A",

      "text-color":        "#FDF496",   // warm yellow
      "muted-text":        "#9FF5D3",   // mint green
      "border-color":      "#FDF496",
      "scrollbar-thumb":   "#FDF496",
      "accent-color":      "#5B4A2A"
    }
  }),

  new Theme({
    id: "zombie",
    name: "Zombie Mode",
    unlockAt: 10_000,
    cookieImg: "img/zombie-cookie.png",
    vars: {
      "bg-color":          "#1C1F1A",   // dark moss
      "frame-bg":          "#2A2E25",
      "box-bg":            "#3F3F3F",   // concrete
      "panel-bg":          "#283D24",   // dirty green-ish
      "shop-bg":           "#930717",   // bloody accent
      "shop-bg-disabled":  "#6B6B6B",

      "text-color":        "#D3C760",   // sick yellow
      "muted-text":        "#A8E57E",   // pale infected green
      "border-color":      "#2E5D34",   // swamp green
      "scrollbar-thumb":   "#6B6B6B",
      "accent-color":      "#2E5D34"
    }
  }),

  new Theme({
    id: "halloween",
    name: "Halloween",
    unlockAt: 15_000,
    cookieImg: "img/halloween-cookie.png",
    vars: {
      "bg-color":          "#0A0610",  // deep midnight
      "frame-bg":          "#1A0F24",
      "box-bg":            "#1A0F24",
      "panel-bg":          "#2A1638",
      "shop-bg":           "#26102E",
      "shop-bg-disabled":  "#3D2C42",

      "border-color":      "#FF7A1C",  // pumpkin orange
      "text-color":        "#FFE7C5",  // warm cream
      "muted-text":        "#D9A57B",
      "accent-color":      "#FF9B36",
      "scrollbar-thumb":   "#FF7A1C",
      "text-strong":       "#FFFFFF",
      "icon-border-color": "#FF7A1C"
    }
  }),
];

// ---- helpers ----

export function setTheme(id) {
  const fallback = THEMES[0];
  const theme = THEMES.find(t => t.id === id) || fallback;

  game.themeId = theme.id;
  theme.apply();
  saveGame();
}

/**
 * Draw theme buttons and show next unlock requirement
 */
export function renderThemes() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;

  // make sure unlockedThemes exists
  if (!game.unlockedThemes) {
    game.unlockedThemes = { light: true, dark: true };
  }

  grid.innerHTML = "";

  let nextLocked = null;

  THEMES.forEach(theme => {
    const btn = document.createElement("button");
    btn.className = "theme-swatch";
    btn.dataset.themeId = theme.id;

    const previewColor =
      theme.vars["accent-color"] ||
      theme.vars["panel-bg"] ||
      theme.vars["box-bg"] ||
      "#888";

    btn.style.background = previewColor;

    const unlocked = theme.isUnlocked(game.cookie);

    if (!unlocked) {
      btn.disabled = true;
      btn.classList.add("locked");
      btn.title = `${theme.name} — unlocks at ${theme.unlockAt.toLocaleString()} cookies`;

      // track the *closest* future unlock
      if (!nextLocked || theme.unlockAt < nextLocked.unlockAt) {
        nextLocked = theme;
      }
    } else {
      btn.disabled = false;
      btn.title = theme.name;
    }

    if (theme.id === game.themeId) {
      btn.classList.add("active");
    }

    grid.appendChild(btn);
  });

  // Small text under the swatches: “Next theme unlock…”
  const hint = document.getElementById("theme-locked-hint");
  if (hint) {
    if (nextLocked) {
      hint.textContent =
        `Next theme unlock: ${nextLocked.name} at ` +
        `${nextLocked.unlockAt.toLocaleString()} cookies.`;
    } else {
      hint.textContent = "All special themes are unlocked 🎉";
    }
  }
}

/**
 * Single click handler for all swatches
 */
export function wireThemeClicks() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-swatch");
    if (!btn) return;

    const theme = THEMES.find(t => t.id === btn.dataset.themeId);
    if (!theme) return;

    // Only allow clicking if it's really unlocked (based on saved state)
    if (!theme.isUnlocked(game.cookie)) return;

    setTheme(theme.id);
    renderThemes(); // refresh active/locked states + next-unlock text
  });
}
