const upgrade = document.getElementById("upgrade_button");
const cookie_button = document.getElementById("cookie_button");
const total_cookies = document.getElementById("total_cookies");
const per_click = document.getElementById("cookie_per_click");
const upgrade_cost_display= document.getElementById("upgrade_cost");
const auto_button = document.getElementById("auto_button");
const items_counter = document.getElementById("auto_units");
const auto_cost = document.getElementById("auto_cost");
const cookie_per_second_display = document.getElementById("cookie_per_second");
const SAVE_KEY = "cookieClickerSave_v1";

let cookie = 0
let cookie_per_click = 1
let cookie_per_second = 0
let upgrade_cost = 10
let auto_click_cost = 50
let auto_units = 0;


function saveGame() {
  const state = {
    cookie,
    cookie_per_click,
    cookie_per_second,
    upgrade_cost,
    auto_click_cost,
    auto_units
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return; // nothing saved yet

  try {
    const state = JSON.parse(saved);
    cookie = Number(state.cookie) || 0;
    cookie_per_click = Number(state.cookie_per_click) || 1;
    cookie_per_second = Number(state.cookie_per_second) || 0;
    upgrade_cost = Number(state.upgrade_cost) || 10;
    auto_click_cost = Number(state.auto_click_cost) || 50;
    auto_units = Number(state.auto_units) || 0;
  } catch (e) {
    console.error("Save file corrupted, resetting...", e);
    localStorage.removeItem(SAVE_KEY);
  }
}

loadGame();
updateUI();




function shortNum(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}


function updateUI(){
    total_cookies.textContent = shortNum(cookie);
    per_click.textContent = shortNum(cookie_per_click);
    upgrade.disabled = cookie < upgrade_cost;
    upgrade_cost_display.textContent = shortNum(upgrade_cost);
    auto_button.disabled = cookie < auto_click_cost;
    auto_cost.textContent = shortNum(auto_click_cost);
    items_counter.textContent = shortNum(auto_units);
    cookie_per_second_display.textContent = shortNum(cookie_per_second);
  }

updateUI();


cookie_button.onclick = function() {
    cookie += cookie_per_click;
    updateUI();
    saveGame();
  }



upgrade.onclick = function() {
    
    if (cookie >= upgrade_cost) {
        cookie -= upgrade_cost;
        cookie_per_click += 1;
        upgrade_cost = Math.floor(upgrade_cost * 1.5);

        updateUI();
        saveGame();
      }
    }
    auto_button.onclick = function() {
        if (cookie >= auto_click_cost) {
            cookie -= auto_click_cost;
            cookie_per_second += 1;
            auto_units += 1;
            auto_click_cost = Math.floor(auto_click_cost * 1.5);
        updateUI();
        saveGame();
      }
    }
    setInterval(function() {
        cookie += cookie_per_second;
        updateUI();
    }, 1000);

    setInterval(saveGame, 1000);


    function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  cookie = 0;
  cookie_per_click = 1;
  cookie_per_second = 0;
  upgrade_cost = 10;
  auto_click_cost = 50;
  auto_units = 0;
  updateUI();
}

    
   
