
function buttons(){

    let resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener("click", reset);

    let exportButton = document.getElementById("export-btn");
    exportButton.addEventListener("click", exportFunction);

    let importButton = document.getElementById("import-btn");
    importButton.addEventListener("click", importFunction);
    
    let incrementButton = document.getElementById("increment-btn");
    incrementButton.addEventListener("click", function(){
        increment("number", 1);
    });

    for (let i of incrementors){
        document.getElementById(i+"-btn").addEventListener("click", function(){
            attemptBuy(i);
        })
    }
}

function increment(item, amt){
    localStorage.setItem(item, parseInt(localStorage.getItem(item)) + amt);
}

function attemptBuy(item){
    let cost = parseInt(localStorage.getItem(item+"-cost"));
    if (parseInt(localStorage.getItem("number")) >= cost){
        increment(item+"-quantity", 1);
        localStorage.setItem(item+"-cost", Math.ceil(cost*1.1));
        pay(cost);
    }
    adjustVelocity();
}

function exportFunction(){
    console.log(JSON.stringify(localStorage));
}

function importFunction(){
    let importFile = prompt("Insert your savefile here...");
    if (importFile == null || importFile == ""){
        alert("Import cannot be empty.")
    }else{
        try{
        importFile = JSON.parse(importFile);
        for (let attribute in localStorage){
            localStorage.setItem(attribute, importFile[attribute]);
        }
        //localStorage = importFile;
        }
        catch{
            alert("Not a valid file.");
        }
    }
}

function pay(cost){
    localStorage.setItem("number", parseInt(localStorage.getItem("number")) - cost);
}

function numberFormat(float){
    let power = Math.round(Math.log10(float));
    if (float > Math.pow(10, 6)){
    return Math.round(float)/Math.pow(10,power) + "e" + power;
    }
    else{
        return Math.floor(float*10)/10;
    }
}

function refresh(){

    if (localStorage.getItem("velocity") === null){
        reset();
    }

    document.getElementById("number").textContent = numberFormat(localStorage.getItem("number"));
    document.getElementById("velocity").textContent = "+"+localStorage.getItem("velocity")+" / sec";

    for (let i of incrementors){
        document.getElementById(i+"-quantity").textContent = "Owned: " + localStorage.getItem(i+"-quantity");
        document.getElementById(i+"-cost").textContent = "Cost: " + localStorage.getItem(i+"-cost");
        document.getElementById(i+"-production").textContent = "Produces: +" + localStorage.getItem(i+"-production") + " / sec";
    }

}

function gain(){
    localStorage.setItem("number", parseFloat(localStorage.getItem("number")) + parseFloat(localStorage.getItem("velocity") / (1000 / INTERVAL)));
    
    let exportFile = JSON.stringify(localStorage);
    refresh();
}

function reset(){

    localStorage.clear();

    localStorage.setItem("number", 0);
    localStorage.setItem("velocity", 0);

    localStorage.setItem("basicIncrementor-quantity", 0);
    localStorage.setItem("basicIncrementor-cost", 10);
    localStorage.setItem("basicIncrementor-production", 1);

    localStorage.setItem("advIncrementor-quantity", 0);
    localStorage.setItem("advIncrementor-cost", 100);
    localStorage.setItem("advIncrementor-production", 5);

    localStorage.setItem("expIncrementor-quantity", 0);
    localStorage.setItem("expIncrementor-cost", 1000);
    localStorage.setItem("expIncrementor-production", 25);

}

function adjustVelocity(){
    let velocity = 0;
    for (let i of incrementors){
        velocity += parseFloat(localStorage.getItem(i+"-production") * parseInt(localStorage.getItem(i+"-quantity")));
    }
    localStorage.setItem("velocity", velocity);
}

let INTERVAL = 100;
let refreshRate = setInterval(refresh, 0);
let gainRate = setInterval(gain, INTERVAL);
let incrementors = ["basicIncrementor", "advIncrementor", "expIncrementor"];

buttons();