
function buttons() {

    document.getElementById("reset-btn").addEventListener("click", reset);

    document.getElementById("export-btn").addEventListener("click", exportFunction);

    document.getElementById("import-btn").addEventListener("click", importPrompt);

    document.getElementById("increment-btn").addEventListener("click", function () {
        increment("number", parseFloat(localStorage.getItem("click")));
    });

}

function exportFunction() {
    document.getElementById("export-result").value = (JSON.stringify(localStorage));
}

function importPrompt() {
    let importFile = document.getElementById("import-area").value;
    if (importFile == null || importFile == "") {
        alert("Import cannot be empty.")
    } else {
        importFunction(importFile);
    }
}

function importFunction(data){
    let importFile = JSON.parse(data);
    try {
            for (let attribute in localStorage) {
                if (isValid(importFile[attribute])){
                    localStorage.attribute = importFile[attribute];
                } else{
                    console.warn(attribute + " did not have a valid value.");
                }
            }
        }
        catch {
            alert("Not a valid file.");
        }
}

/** The function responsible for displaying values. */

function displayItem(item) {

    let float = parseFloat(localStorage.getItem(item));

    if (!Number.isFinite(float) && !isNaN(float)){
        return "∞";
    }

    let power = Math.floor(Math.floor(Math.log10(float)) / 3);

    let roundAmt = Math.floor(float * 10) / 10;
    let roundedFigs = Math.floor(float / Math.pow(1000, power) * 100) / 100;

    if (float >= 1000) {
        return roundedFigs + "" + amts[power - 1];
    } else {
        return roundAmt;
    }
}

/** The function responsible for displaying numbers. */

function displayNumber(amt) {

    let float = amt;
    let power = Math.floor(Math.floor(Math.log10(float)) / 3);

    let roundAmt = Math.floor(float * 10) / 10;
    let roundedFigs = Math.floor(float / Math.pow(1000, power) * 100) / 100;

    if (float >= 1000) {
        return roundedFigs + "" + amts[power - 1];
    } else {
        return roundAmt;
    }
}

/** The function responsible for displaying a length of time. */

function displayTime(ms){
    let s = Math.floor((ms / 1000) % 60);
    let m = Math.floor((ms / 60000) % 60);
    let h = Math.floor((ms / 3600000) % 24);
    let d = Math.floor((ms / 86400000) % 365);
    let y = Math.floor(ms / 31536000000);

    return ((y > 0) ? (y + " years, ") : ("")) +
    ((d > 0) ? (d + " days, ") : ("")) +
    ((h > 0) ? (h + " hours, ") : ("")) +
    ((m > 0) ? (m + " minutes, ") : ("")) + 
    s + " seconds";

}

/** Fixes the GUI based on what happens in-game. */

function refresh() {

    validate();

    setContent("number", displayItem("number"));
    setContent("velocity", displayItem("velocity") + " / sec");
    setContent("click", displayItem("click") + " / click");

    // Producers

    for (let i = 0; i < NUM_RANKS; i++) {
        setContent(i + "Incrementor-quantity", displayItem(i + "Incrementor-quantity") + " owned");
        setContent(i + "Incrementor-cost", displayItem(i + "Incrementor-cost"));
        setContent(i + "Incrementor-production", displayItem(i + "Incrementor-production") + " / sec");

        if (localStorage.number < parseFloat(localStorage[i+"Incrementor-cost"])){
            document.getElementById(i+"Incrementor").style = "background-color: gray";
        } else{
            document.getElementById(i+"Incrementor").style = "background-color: black";
        }

        setContent(i + "Clicker-quantity", displayItem(i + "Clicker-quantity") + " owned");
        setContent(i + "Clicker-cost", displayItem(i + "Clicker-cost"));
        setContent(i + "Clicker-production", displayItem(i + "Clicker-production") + " / click");

        if (localStorage.number < parseFloat(localStorage[i+"Clicker-cost"])){
            document.getElementById(i+"Clicker").style = "background-color: gray";
        } else{
            document.getElementById(i+"Clicker").style = "background-color: black";
        }
    }

    // Stats

    setContent("totalNumber", "Total Number: " + displayItem("totalNumber"));
    setContent("duration", "Time since inception: " + displayTime(localStorage.time - localStorage.inception));

    gain();
    
    newsRender();
}

/** The function responsible for changing the text content of an element in the HTML. */

function setContent(id, toText) {
    document.getElementById(id).textContent = toText;
}

/** Resets the game. Useful for dealing with invalid files. */

function reset() {

    localStorage.clear();

    localStorage.number = 10;
    localStorage.totalNumber = 10;
    localStorage.velocity = 0;
    localStorage.click = 0;
    localStorage.news = news[0];

    for (let i = 0; i < NUM_RANKS; i++) {
        localStorage[i + "Incrementor-quantity"] = 0;
        localStorage[i + "Incrementor-cost"] =  Math.pow(8, i) * 10;
        localStorage[i + "Incrementor-production"] = Math.pow(5, i);

        localStorage[i + "Clicker-quantity"] = 0;
        localStorage[i + "Clicker-cost"] = Math.pow(10, i + 1);
        localStorage[i + "Clicker-production"] = Math.pow(6, i);
    }

    localStorage.inception = newDate().getTime();
    localStorage.time = new Date().getTime();

}

function validate(){

    if (!isValid(localStorage.number)){
        localStorage.number = 10;
    }
    if (!isValid(localStorage.totalNumber)){
        localStorage.totalNumber = 10;
    }
    if (!isValid(localStorage.velocity)){
        localStorage.velocity = 0;
    } else if (!isValid(localStorage.click)){
        localStorage.click = 0;
    }
    if (!isValid(localStorage.time)){
        localStorage.time = new Date().getTime();
    }
    if (!isValid(localStorage.inception)){
        localStorage.inception = new Date().getTime();
    }

    for (let i = 0; i < NUM_RANKS; i++){
        if (!isValid(localStorage[i+"Incrementor-quantity"]))
        {
            localStorage[i + "Incrementor-quantity"] = 0;
            localStorage[i + "Incrementor-cost"] =  Math.pow(8, i) * 10;
            localStorage[i + "Incrementor-production"] = Math.pow(5, i);
        }
        if (!isValid(localStorage[i+"Clicker-quantity"]))
        {
            localStorage[i + "Clicker-quantity"] = 0;
            localStorage[i + "Clicker-cost"] =  Math.pow(10, i + 1);
            localStorage[i + "Clicker-production"] = Math.pow(6, i);
        }
    }

}

function isValid(value){
    return !(value === null || isNaN(value) || value === undefined);
}

/** Sets your velocity and click power according to what you purchased. */

function adjustVelocity() {
    let velocity = 0;
    let click = 0;
    for (let i = 0; i < NUM_RANKS; i++) {
        velocity += localStorage[i + "Incrementor-production"] * localStorage[i + "Incrementor-quantity"];
        click += localStorage[i+"Clicker-production"] * localStorage[i+"Clicker-quantity"];
    }
    localStorage.setItem("velocity", velocity);
    localStorage.setItem("click", click);
}

/** Increases your number by your velocity, multiplied by time elapsed. */

function gain() {

    let newTime = new Date().getTime();

    let gap = newTime - localStorage.time;

    if (gap < 0 || localStorage.time < localStorage.inception){
        alert("I noticed that you did something.");
        localStorage.time = newTime;
        return 0;
    }

    localStorage.time = newTime;

    let gain = localStorage.velocity * (gap / 1000);
    increment("number", gain);

    if (gap > 60000){
        alert("You have been gone for " + displayTime(gap) + "\nYour number increased by " + displayNumber(gain));
    }

    return gain;
}

/** Occurs when clicking on a button or incrementor. Successful if your number >= its cost. */

function attemptBuy(item) {
    let cost = localStorage[item + "-cost"];
    if (parseFloat(localStorage.number) >= cost) {
        localStorage[item + "-quantity"]++;
        localStorage[item + "-cost"] = Math.ceil(cost * 1.1);
        localStorage.number -= cost;
        adjustVelocity();
    }
    
}

/** The function responsible for increasing numbers of any kind. */

function increment(item, amt) {
    localStorage.setItem(item, parseFloat(localStorage.getItem(item)) + amt);
    if (item == "number") {
        increment("totalNumber", amt);
    }
}

/** Adjusts the news GUI to your total number. */

function newsRender(){
    let tot = parseFloat(localStorage.totalNumber);

    let newsNumber = Math.floor(Math.log10(tot)) - 1;
    if (newsNumber <= 0 || tot == 0){
        localStorage.news = news[0];
    } else if (newsNumber >= news.length){
        localStorage.news = news[news.length - 1];
    } else{
        localStorage.news = news[newsNumber];
    }

    setContent("news", localStorage.news);

}

/** Assembles the button GUI. */

function guiSetUp(){
    
    /** Incrementors */

    for (let r = 0; r < NUM_RANKS; r++){

        let i = document.createElement("button");
        i.id = r+"Incrementor";
        i.classList.add("inc");
        i.innerHTML = "Tier " + r;

        let cost = document.createElement("div");
        cost.id = r+"Incrementor-cost";
        cost.innerHTML = "?";

        let owned = document.createElement("div");
        owned.id = r+"Incrementor-quantity";
        owned.innerHTML = "? owned";

        let production = document.createElement("div");
        production.id = r+"Incrementor-production";
        production.innerHTML = "? / sec";

        i.addEventListener("click", function () {
            attemptBuy(r+"Incrementor");
        })

        incrementors.appendChild(i);
        i.appendChild(cost);
        i.appendChild(owned);
        i.appendChild(production);
        
    }

    /** Clickers */

    for (let r = 0; r < NUM_RANKS; r++){
        let c = document.createElement("button");
        c.id = r+"Clicker";
        c.classList.add("cli");
        c.innerHTML = "Tier " + r;

        let cCost = document.createElement("div");
        cCost.id = r+"Clicker-cost";
        cCost.innerHTML = "Cost: ?";

        let cOwned = document.createElement("div");
        cOwned.id = r+"Clicker-quantity";
        cOwned.innerHTML = "? owned";

        let cProduction = document.createElement("div");
        cProduction.id = r+"Clicker-production";
        cProduction.innerHTML = "+? / sec";

        c.addEventListener("click", function () {
            attemptBuy(r+"Clicker");
        })

        clickers.appendChild(c);
        c.appendChild(cCost);
        c.appendChild(cOwned);
        c.appendChild(cProduction);
    }
    
}

/** Variables that are important to store elsewhere. */

const NUM_RANKS = 10;

const INTERVAL = 30;

let amts = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", 
    "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
    "V", "Uv", "Dv", "Tv", "Qav", "Qiv", "Sxv", "Spv", "Ocv", "Nov" ];

let news = [
    "You have a feeling that you're missing something.",
    "The increase of this number has delivered a sense of satisfaction, but not a major one.",
    "As you further ascend, you start to wonder if this game will satisfy that missing sensation.",
    "Maybe something can be found outside of this game.",
    "Maybe that is not what you want. Regardless, this game will be here for you.",
    "Your number climbs further, and you start to realize something. This is getting pretty repetitive.",
    "Your number approaches the population of the average country. It took long enough to the point where the outside world doesn't look so bad.",
    "You begin to analyze the cost to risk ratio of playing this game and comparing it to doing anything else.",
    "Will you stick around, or are you going to soak in the light that is reality?"
]

let refreshRate = setInterval(refresh, INTERVAL);

let incrementors = document.getElementById("incrementors");
let clickers = document.getElementById("clickers");

guiSetUp();
buttons();