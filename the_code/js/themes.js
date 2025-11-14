// themes.js
import { game } from "./state.js";

/**
 * Theme class:
 * - id: internal name
 * - name: label shown in UI
 * - vars: CSS variable values (keys without the leading "--")
 * - cookieImg: path to cookie image for this theme
 * - unlockAt: min cookies required to use this theme
 */
class Theme {
  constructor({ id, name, vars, cookieImg, unlockAt = 0 }) {
    this.id = id;
    this.name = name;
    this.vars = vars;
    this.cookieImg = cookieImg;
    this.unlockAt = unlockAt;
  }

  isUnlocked(cookieCount) {
    return cookieCount >= this.unlockAt;
  }

  apply() {
    const root = document.documentElement;

    // Apply all CSS variables (we add the leading `--` here)
    Object.entries(this.vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Swap cookie image if provided
    if (this.cookieImg) {
      const img = document.getElementById("cookie_img");
      if (img) {
        img.src = this.cookieImg;
      }
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
    cookieImg: "img/light-theme.png", // placeholder
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
      /* ==== Accent (sprinkles hint) ==== */
      "accent-color":    "#FFF9EF"    // light sprinkle pink (used VERY lightly)

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
      "text-color":      "#F4E2C6",   // ✨ light paige (VERY readable)
      "muted-text":      "#C7AB8F",   // softer light paige
      "text-strong":     "#FFEBD2",   // brightest text for titles
      "text-muted":      "#CBB49B",   // supporting caramel beige

      /* ==== Accent (hot pink flavour) ==== */
      "accent-color":    "#0C0908"    // hot pink (small UI hints)
    }
  }),

  new Theme({
    id: "boldCandy",
    name: "Bold Candy",
    unlockAt: 0,   // always available
    cookieImg: "img/pitbull-cookie.png",  // placeholder until we generate the cookie

    vars: {
      /* ===== BACKGROUNDS ===== */
      "bg-color":        "#FFE600",   // ⚡ neon yellow (outer background)
      "frame-bg":        "#FF6A00",   // 💗 hot pink (inner frame)
      "box-bg":          "#005CFF",   // 💙 electric blue boxes
      "panel-bg":        "#FF008A",   // deeper electric blue inside

      /* ===== SHOP BUTTONS ===== */
      "shop-bg":             "#FF6A00",  // bright yellow enabled
      "shop-bg-disabled":    "#3AFF00",  // neon green disabled (visible af)

      /* ===== BORDERS ===== */
      "border-color":    "#FF6A00",   // 🔥 strong orange (contrast)
      "scrollbar-thumb": "#FF6A00",   // same orange for unity

      /* ===== TEXT ===== */
      "text-color":      "#FFFFFF",   // white (best for neon combos)
      "muted-text":      "#FCD9FF",   // soft pinkish-white
      "text-strong":     "#FFFFFF",   // strong readable white
      "text-muted":      "#F7E3FF",   // subtle pastel for details

      /* ===== ACCENT ===== */
      "accent-color":    "#FF008A"    // hot pink for highlights
    }
  }),
  new Theme({
    id: "invert",
    name: "Negative",
    unlockAt: 0,
    cookieImg: "img/negative-cookie.png",
    vars: {
        "bg-color": "#4b18a4ff",           // deep dark blue background
        "frame-bg": "#9FF5D3",          // muted purple frame
        "box-bg": "#241A10",            // chocolate brown box background
        "panel-bg": "#2E255E",          // deeper royal-purple for panels
        "shop-bg": "#2E255E",           // same as panel (consistent)
        "shop-bg-disabled": "#5B4A2A",  // muted brown-yellow (readable)
        "text-color": "#FDF496",        // warm yellow for maximum readability
        "shop-text-color": "#FDF496",   // same as text-color
        "muted-text": "#9FF5D3",        // mint green highlights
        "border-color": "#FDF496",      // vibrant purple border
        "icon-border-color": "#6E45CF", // same as border
        "scrollbar-thumb": "#FDF496",   // purple scrollbar
        "accent-color": "#4b18a4ff"       // mint green accent pop
    }
  }),

  // ---- locked themes (examples) ----
  new Theme({
    id: "zombie",
    name: "Zombie Mode",
    unlockAt: 0,           // needs 5K cookies
    cookieImg: "img/cookie_zombie.png",
    vars: {
      "bg-color": "#1C1F1A",          // dark moss background
      "frame-bg": "#2A2E25",         // deeper swamp green-gray
      "box-bg": "#3F3F3F",           // concrete panel
      "panel-bg": "#2E3A2C",         // dirty green-ish panel
      "shop-bg": "#4A7A42",          // rotten green
      "shop-bg-disabled": "#6B6B6B", // dusty cement disabled state
      "text-color": "#D3C760",       // sick yellow
      "muted-text": "#A8E57E",       // pale infected highlight
      "border-color": "#2E5D34",     // swamp dark green
      "scrollbar-thumb": "#6B6B6B",  // cement gray
      "shop-text-color": "#D3C760",  // readable sick yellow
      "shop-muted-color": "#A8E57E", // pale green
      "accent-color": "#5D4A6A"      // bruised purple (optional)
    }
  }),

  new Theme({
    id: "win7",
    name: "Purple Place",
    unlockAt: 0,
    cookieImg: "img/cookie_win7.png",
    vars: {
      "bg-color": "#140326",
      "panel-bg": "#2c0a57",
      "shop-bg": "#3a1172",
      "border-color": "#6c35c7",
      "text-color": "#f3e5ff",
      "muted-text": "#c6a4ff",
      "accent-color": "#ffb347"
    }
  }),

  // later you can add: crumble cookie, demon, hunter, halloween, christmas...
];

// ---- helpers ----

// apply theme by id (does NOT save by itself to avoid circular imports)
export function setTheme(id) {
  const theme = THEMES.find(t => t.id === id) ?? THEMES[0];
  game.themeId = theme.id;
  theme.apply();
}

// render swatches in #theme-grid
export function renderThemes() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;

  grid.innerHTML = "";
  THEMES.forEach(theme => {
    const btn = document.createElement("button");
    btn.className = "theme-swatch";
    btn.dataset.themeId = theme.id;

    // use accent or panel color as preview
    const previewColor =
      theme.vars["accent-color"] || theme.vars["panel-bg"] || "#888";
    btn.style.background = previewColor;

    const unlocked = theme.isUnlocked(game.cookie);
    btn.disabled = !unlocked;
    btn.title = unlocked
      ? theme.name
      : `${theme.name} (unlocks at ${theme.unlockAt.toLocaleString()} cookies)`;

    grid.appendChild(btn);
  });
}

// one listener for all swatches
export function wireThemeClicks() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-swatch");
    if (!btn) return;

    const theme = THEMES.find(t => t.id === btn.dataset.themeId);
    if (!theme || !theme.isUnlocked(game.cookie)) return;

    setTheme(theme.id);
    renderThemes(); // refresh locked/unlocked states
  });
}
