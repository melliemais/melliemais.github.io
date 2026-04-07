
function buttons() {

    document.getElementById("reset-btn").addEventListener("click", reset);

    document.getElementById("export-btn").addEventListener("click", exportFunction);

    document.getElementById("import-btn").addEventListener("click", importFunction);

    document.getElementById("increment-btn").addEventListener("click", function () {
        increment("number", parseFloat(localStorage.getItem("click")));
    });

}

function exportFunction() {
    console.log(JSON.stringify(localStorage));
}

function importFunction() {
    let importFile = prompt("Insert your savefile here...");
    if (importFile == null || importFile == "") {
        alert("Import cannot be empty.")
    } else {
        try {
            importFile = JSON.parse(importFile);
            for (let attribute in localStorage) {
                if (importFile[attribute] != undefined){
                    localStorage.setItem(attribute, importFile[attribute]);
                } else{
                    console.warn(attribute + " is undefined.");
                }
            }
            //localStorage = importFile;
        }
        catch {
            alert("Not a valid file.");
        }
    }
}

/** The function responsible for displaying variables. */

function displayItem(item) {

    let float = parseFloat(localStorage.getItem(item));
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

/** Fixes the GUI based on what happens in-game. */

function refresh() {

    if (localStorage.totalNumber == null){
        reset();
    }

    setContent("number", displayItem("number"));
    setContent("velocity", displayItem("velocity") + " / sec");
    setContent("click", displayItem("click") + " / click");

    let newTime = new Date().getTime();

    let gap = newTime - localStorage.getItem("time");

    localStorage.setItem("time", newTime);

    if (gap > 60000){
        alert("You have been gone for " + Math.floor(gap / 1000) + " seconds\nYour number increased by " + displayNumber(gain(gap)));
    } else{
        gain(gap);
    }

    for (let i of ranks) {
        setContent(i + "Incrementor-quantity", displayItem(i + "Incrementor-quantity") + " owned");
        setContent(i + "Incrementor-cost", displayItem(i + "Incrementor-cost"));
        setContent(i + "Incrementor-production", displayItem(i + "Incrementor-production") + " / sec");

        setContent(i + "Clicker-quantity", displayItem(i + "Clicker-quantity") + " owned");
        setContent(i + "Clicker-cost", displayItem(i + "Clicker-cost"));
        setContent(i + "Clicker-production", displayItem(i + "Clicker-production") + " / click");
    }
    
    newsRender();
}

/** The function responsible for changing the text content of an element in the HTML. */

function setContent(id, toText) {
    document.getElementById(id).textContent = toText;
}

/** Resets the game. Useful for dealing with invalid files. */

function reset() {

    localStorage.clear();

    localStorage.setItem("number", 10);
    localStorage.setItem("totalNumber", 10);
    localStorage.setItem("velocity", 0);
    localStorage.setItem("click", 0);
    localStorage.setItem("news", news[0]);

    for (let i = 0; i < ranks.length; i++) {
        localStorage.setItem(ranks[i] + "Incrementor-quantity", 0);
        localStorage.setItem(ranks[i] + "Incrementor-cost", Math.pow(8, i) * 10);
        localStorage.setItem(ranks[i] + "Incrementor-production", Math.pow(5, i));

        localStorage.setItem(ranks[i] + "Clicker-quantity", 0);
        localStorage.setItem(ranks[i] + "Clicker-cost", Math.pow(10, i + 1));
        localStorage.setItem(ranks[i] + "Clicker-production", Math.pow(6, i));
    }

    localStorage.setItem("time", (new Date()).getTime());

}

/** Sets your velocity and click power according to what you purchased. */

function adjustVelocity() {
    let velocity = 0;
    let click = 0;
    for (let i of ranks) {
        velocity += parseFloat(localStorage.getItem(i + "Incrementor-production") * parseInt(localStorage.getItem(i + "Incrementor-quantity")));
        click += parseFloat(localStorage.getItem(i+"Clicker-production") * parseInt(localStorage.getItem(i+"Clicker-quantity")))
    }
    localStorage.setItem("velocity", velocity);
    localStorage.setItem("click", click);
}

/** Increases your number by your velocity, multiplied by time elapsed. */

function gain(elapsed) {
    if (localStorage.getItem("velocity") == 0) return;
    let gain = parseFloat(localStorage.getItem("velocity")) * (elapsed / 1000);
    increment("number", gain);

    return gain;
}

/** Occurs when clicking on a button or incrementor. Successful if your number >= its cost. */

function attemptBuy(item) {
    let cost = parseInt(localStorage.getItem(item + "-cost"));
    if (parseInt(localStorage.getItem("number")) >= cost) {
        increment(item + "-quantity", 1);
        localStorage.setItem(item + "-cost", Math.ceil(cost * 1.1));
        pay(cost);
    }
    adjustVelocity();
}

/** Decreases your number by the cost of an item. */

function pay(cost) {
    localStorage.setItem("number", parseInt(localStorage.getItem("number")) - cost);
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
    let totalNumber = localStorage.getItem("totalNumber");

    let newsNumber = Math.floor(Math.log10(totalNumber)) - 1;
    if (newsNumber <= 0 || totalNumber == 0){
        setContent("news", news[0]);
    } else if (newsNumber >= news.length){
        setContent("news", news[news.length-1]);
    } else{
        setContent("news", news[newsNumber]);
    }
    

}

/** Assembles the button GUI. */

function guiSetUp(){
    
    /** Incrementors */

    for (let r = 0; r < ranks.length; r++){

        let i = document.createElement("button");
        i.id = ranks[r]+"Incrementor";
        i.classList.add("inc");
        i.innerHTML = visualRanks[r];

        let cost = document.createElement("div");
        cost.id = ranks[r]+"Incrementor-cost";
        cost.innerHTML = "Cost: ?";

        let owned = document.createElement("div");
        owned.id = ranks[r]+"Incrementor-quantity";
        owned.innerHTML = "? owned";

        let production = document.createElement("div");
        production.id = ranks[r]+"Incrementor-production";
        production.innerHTML = "+? / sec";

        i.addEventListener("click", function () {
            attemptBuy(ranks[r]+"Incrementor");
        })

        incrementors.appendChild(i);
        i.appendChild(cost);
        i.appendChild(owned);
        i.appendChild(production);
    }

    /** Clickers */

    for (let r = 0; r < ranks.length; r++){
        let c = document.createElement("button");
        c.id = ranks[r]+"Clicker-btn";
        c.classList.add("cli");
        c.innerHTML = visualRanks[r];

        let cCost = document.createElement("div");
        cCost.id = ranks[r]+"Clicker-cost";
        cCost.innerHTML = "Cost: ?";

        let cOwned = document.createElement("div");
        cOwned.id = ranks[r]+"Clicker-quantity";
        cOwned.innerHTML = "? owned";

        let cProduction = document.createElement("div");
        cProduction.id = ranks[r]+"Clicker-production";
        cProduction.innerHTML = "+? / sec";

        c.addEventListener("click", function () {
            attemptBuy(ranks[r]+"Clicker");
        })

        clickers.appendChild(c);
        c.appendChild(cCost);
        c.appendChild(cOwned);
        c.appendChild(cProduction);
    }
    
}

let ranks = ["bg", "basic", "std", "int", "adv", "exp", "mas", "gm", "cha"];
let visualRanks = ["Beginner", "Basic", "Standard", "Intermediate", "Advanced", "Expert", "Master", "Grandmaster", "Champion"];
let amts = ["K", "M", "B", "T", "Qa", "Qt", "Sx"];
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

let INTERVAL = 33;
let refreshRate = setInterval(refresh, INTERVAL);

let incrementors = document.getElementById("incrementors");
let clickers = document.getElementById("clickers");

guiSetUp();
buttons();