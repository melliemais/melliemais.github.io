
function buttons() {

    document.getElementById("reset-btn").addEventListener("click", reset);

    document.getElementById("export-btn").addEventListener("click", exportFunction);

    document.getElementById("import-btn").addEventListener("click", importFunction);

    document.getElementById("increment-btn").addEventListener("click", function () {
        increment("number", 1);
    });

    for (let i of ranks) {
        document.getElementById(i + "Incrementor-btn").addEventListener("click", function () {
            attemptBuy(i+"Incrementor");
        })
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

    for (let i of ranks) {
        setContent(i + "Incrementor-quantity", "Owned: " + displayNumber(i + "Incrementor-quantity"));
        setContent(i + "Incrementor-cost", "Cost: " + displayNumber(i + "Incrementor-cost"));
        setContent(i + "Incrementor-production", "Produces: +" + displayNumber(i + "Incrementor-production") + " / sec");
    }

    let totalNumber = localStorage.getItem("totalNumber");

    if (totalNumber < 100) {
        setContent("totalNumber", "You have a feeling that you're missing something.");
    } else if (totalNumber < 1000) {
        setContent("totalNumber", "True, your number has increased, but the world around you still feels off.");
    } else if (totalNumber < 10000) {
        setContent("totalNumber", "You've started to figure things out. It's not here; it's the remainder of the web.");
    } else if (totalNumber < 100000) {
        setContent("totalNumber", "The outside world is a scary place. Are you willing to venture out into it?");
    }

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

    for (let i = 0; i < ranks.length; i++) {
        localStorage.setItem(ranks[i] + "Incrementor-quantity", 0);
        localStorage.setItem(ranks[i] + "Incrementor-cost", Math.pow(10, i + 1));
        localStorage.setItem(ranks[i] + "Incrementor-production", Math.pow(5, i));
    }

    localStorage.setItem("basicClicker-quantity", 0);
    localStorage.setItem("basicClicker-cost", 10);
    localStorage.setItem("basicClicker-production", 1);

    localStorage.setItem("stdClicker-quantity", 0);
    localStorage.setItem("stdClicker-cost", 100);
    localStorage.setItem("stdClicker-production", 5);

    localStorage.setItem("advClicker-quantity", 0);
    localStorage.setItem("advClicker-cost", 1000);
    localStorage.setItem("advClicker-production", 25);

    localStorage.setItem("expClicker-quantity", 0);
    localStorage.setItem("expClicker-cost", 10000);
    localStorage.setItem("expClicker-production", 125);

    localStorage.setItem("masClicker-quantity", 0);
    localStorage.setItem("masClicker-cost", 100000);
    localStorage.setItem("masClicker-production", 625);

}

function adjustVelocity() {
    let velocity = 0;
    for (let i of ranks) {
        velocity += parseFloat(localStorage.getItem(i + "Incrementor-production") * parseInt(localStorage.getItem(i + "Incrementor-quantity")));
    }
    localStorage.setItem("velocity", velocity);
}

let INTERVAL = 100;
let refreshRate = setInterval(refresh, 0);
let gainRate = setInterval(gain, INTERVAL);
let ranks = ["basic", "std", "adv", "exp", "mas"];
let amts = ["K", "M", "B", "T", "Qa", "Qt", "Sx"];

buttons();