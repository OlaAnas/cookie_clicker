const upgrade = document.getElementById("upgrade_button");
const cookie_button = document.getElementById("cookie_button");
const total_cookies = document.getElementById("total_cookies");
const per_click = document.getElementById("cookie_per_click");
const upgrade_cost_display= document.getElementById("upgrade_cost");
const auto_button = document.getElementById("auto_button");
const items_counter = document.getElementById("items");
const auto_cost = document.getElementById("auto_cost");
const cookie_per_second_display = document.getElementById("cookie_per_second");


let cookie = 0
let cookie_per_click = 1
let cookie_per_second = 0
let upgrade_cost = 10
let auto_click_level = 0
let auto_click_cost = 50
let items = 0;


function updateUI(){
    total_cookies.textContent = cookie;
    per_click.textContent = cookie_per_click;
    upgrade.disabled = cookie < upgrade_cost;
    upgrade_cost_display.textContent = upgrade_cost;
    auto_button.disabled = cookie < auto_click_cost;
    auto_cost.textContent = auto_click_cost;
    items_counter.textContent = items;
    cookie_per_second_display.textContent = cookie_per_second;



    

}

updateUI();


cookie_button.onclick = function() {
    cookie += cookie_per_click;
    updateUI();
}



upgrade.onclick = function() {
    
    if (cookie >= upgrade_cost) {
        cookie -= upgrade_cost;
        cookie_per_click += 1;
        upgrade_cost = Math.floor(upgrade_cost * 1.5);

        updateUI();
    }
}
    auto_button.onclick = function() {
        if (cookie >= auto_click_cost) {
            cookie -= auto_click_cost;
            cookie_per_second += 1;
            items += 1;
            auto_click_cost = Math.floor(auto_click_cost * 1.5);
        updateUI();

    }
}
    setInterval(function() {
        cookie += cookie_per_second;
        updateUI();
    }, 1000);

    updateUI();


   
