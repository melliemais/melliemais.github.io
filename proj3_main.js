
function buttons() {

    document.getElementById("reset-btn").addEventListener("click", reset);

    document.getElementById("export-btn").addEventListener("click", exportFunction);

    document.getElementById("import-btn").addEventListener("click", importFunction);

    document.getElementById("increment-btn").addEventListener("click", function () {
        increment("number", parseFloat(localStorage.getItem("click")));
    });

    for (let i of ranks) {
        document.getElementById(i + "Incrementor-btn").addEventListener("click", function () {
            attemptBuy(i+"Incrementor");
        });
        document.getElementById(i + "Clicker-btn").addEventListener("click", function () {
            attemptBuy(i+"Clicker");
        });
    }
}

function increment(item, amt) {
    localStorage.setItem(item, parseFloat(localStorage.getItem(item)) + amt);
    if (item == "number") {
        increment("totalNumber", amt);
    }
}

function attemptBuy(item) {
    let cost = parseInt(localStorage.getItem(item + "-cost"));
    if (parseInt(localStorage.getItem("number")) >= cost) {
        increment(item + "-quantity", 1);
        localStorage.setItem(item + "-cost", Math.ceil(cost * 1.1));
        pay(cost);
    }
    adjustVelocity();
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
                localStorage.setItem(attribute, importFile[attribute]);
            }
            //localStorage = importFile;
        }
        catch {
            alert("Not a valid file.");
        }
    }
}

function pay(cost) {
    localStorage.setItem("number", parseInt(localStorage.getItem("number")) - cost);
}

function displayNumber(amt) {

    let float = localStorage.getItem(amt);
    let power = Math.floor(Math.floor(Math.log10(float)) / 3);

    let roundAmt = Math.floor(float * 10) / 10;
    let roundedFigs = Math.floor(float / Math.pow(1000, power) * 100) / 100;

    if (float >= 1000) {
        return roundedFigs + amts[power - 1];
    } else {
        return roundAmt;
    }
}

function refresh() {

    if (localStorage.getItem("velocity") === null) {
        reset();
    }

    setContent("number", displayNumber("number"));
    setContent("velocity", "+" + displayNumber("velocity") + " / sec");
    setContent("click", "+" + displayNumber("click") + " / click");

    for (let i of ranks) {
        setContent(i + "Incrementor-quantity", "Owned: " + displayNumber(i + "Incrementor-quantity"));
        setContent(i + "Incrementor-cost", "Cost: " + displayNumber(i + "Incrementor-cost"));
        setContent(i + "Incrementor-production", "+" + displayNumber(i + "Incrementor-production") + " / sec");

        setContent(i + "Clicker-quantity", "Owned: " + displayNumber(i + "Clicker-quantity"));
        setContent(i + "Clicker-cost", "Cost: " + displayNumber(i + "Clicker-cost"));
        setContent(i + "Clicker-production", "+" + displayNumber(i + "Clicker-production") + " / click");
    }
    
    newsRender();
}

function setContent(id, toText) {
    document.getElementById(id).textContent = toText;
}

function gain() {
    let gain = parseFloat(localStorage.getItem("velocity") / (1000 / INTERVAL));
    increment("number", gain);

    let exportFile = JSON.stringify(localStorage);
    refresh();
}

function reset() {

    localStorage.clear();

    localStorage.setItem("number", 0);
    localStorage.setItem("totalNumber", 0);
    localStorage.setItem("velocity", 0);
    localStorage.setItem("click", 1);
    localStorage.setItem("news", news[0]);

    for (let i = 0; i < ranks.length; i++) {
        localStorage.setItem(ranks[i] + "Incrementor-quantity", 0);
        localStorage.setItem(ranks[i] + "Incrementor-cost", Math.pow(9, i + 1));
        localStorage.setItem(ranks[i] + "Incrementor-production", Math.pow(6, i));
        localStorage.setItem(ranks[i] + "Clicker-quantity", 0);
        localStorage.setItem(ranks[i] + "Clicker-cost", Math.pow(10, i + 1));
        localStorage.setItem(ranks[i] + "Clicker-production", Math.pow(5, i));
    }

}

function adjustVelocity() {
    let velocity = 0;
    let click = 1;
    for (let i of ranks) {
        velocity += parseFloat(localStorage.getItem(i + "Incrementor-production") * parseInt(localStorage.getItem(i + "Incrementor-quantity")));
        click += parseFloat(localStorage.getItem(i+"Clicker-production") * parseInt(localStorage.getItem(i+"Clicker-quantity")))
    }
    localStorage.setItem("velocity", velocity);
    localStorage.setItem("click", click);
}

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

let ranks = ["basic", "std", "int", "adv", "exp", "mas"];
let amts = ["K", "M", "B", "T", "Qa", "Qt", "Sx"];
let news = [
    "You have a feeling that you're missing something.",
    "True, your number has increased, but the world around you still feels off.",
    "You've started to figure things out. It's not here; it's the remainder of the web.",
    "The outside world is a scary place. Are you willing to venture out into it?",
    "Perhaps that is not what you want. This game will be here for you.",
    "One million. If you were to count all the way to the number you've reached, it would take days.",
    "Your number approaches the population of the average country.",
    "You have crossed the myriad squared threshold. The \"myraid\" is a counting unit used by East Asian countries, which is equal to 10,000.",
    "If you were one in a billion, there would be about 7 others like you. It's hard to feel unique in that regard.",
    "Ten to the ten. You might be wondering how much longer this will go on for.",
    "If the human population on Earth reached this number, it would go down from there QUICKLY. Glad that's not the case.",
    "One trillion. That's quite the benchmark, but you fear others will reach it in units that actually matter.",
    "In the Indian numbering system, you have more than a nil. Who would ever use units that high in everyday life?",
    "You have a number that just eclipsed the GDP of the world in US dollars.",
    "One quadrillion. The number of references to comparable real-world values are dwindling. Will that be enough for you?"
]
let INTERVAL = 100;
let refreshRate = setInterval(refresh, 0);
let gainRate = setInterval(gain, INTERVAL);


buttons();