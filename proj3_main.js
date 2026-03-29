
function buttons(){

    let incrementButton = document.getElementById("increment-btn");
    incrementButton.addEventListener("click", increment);

    let resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener("click", reset);

    let basicIncrementorButton = document.getElementById("basicIncrementor-btn");
    basicIncrementorButton.addEventListener("click", function(){
        attemptBuy("basicIncrementor");
    });

}

function increment(){
    localStorage.setItem("number", parseInt(localStorage.getItem("number")) + 1);
}

function incrementVelocity(){
    localStorage.setItem("velocity", parseInt(localStorage.getItem("velocity")) + 1);
}

function attemptBuy(item){
    let cost;
    switch(item){
        case "basicIncrementor":
            cost = parseInt(localStorage.getItem("basicIncrementor-cost"));
            if (parseInt(localStorage.getItem("number")) >= cost){
                
                localStorage.setItem("basicIncrementor-quantity", parseInt(localStorage.getItem("basicIncrementor-quantity"))+1);
                localStorage.setItem("basicIncrementor-cost", formatTenth(cost*1.1));
                pay(cost);
                
            }
    }
    adjustVelocity();
}

function pay(cost){
    localStorage.setItem("number", parseInt(localStorage.getItem("number")) - cost);
}

function formatTenth(float){
    return Math.round(float*10)/10;
}

function refresh(){

    if (localStorage.getItem("velocity") === null){
        reset();
    }

    document.getElementById("number").textContent = Math.round(localStorage.getItem("number")*10) / 10;
    document.getElementById("velocity").textContent = "+"+localStorage.getItem("velocity")+" / sec";

    document.getElementById("basicIncrementor-quantity").textContent = "Owned: "+localStorage.getItem("basicIncrementor-quantity");
    document.getElementById("basicIncrementor-cost").textContent = "Cost: "+localStorage.getItem("basicIncrementor-cost");
}

function gain(){
    console.log("gain");
    localStorage.setItem("number", parseFloat(localStorage.getItem("number")) + parseFloat(localStorage.getItem("velocity") / (1000 / INTERVAL)));
    refresh();
}

function reset(){

    localStorage.clear();

    localStorage.setItem("number", 0);
    localStorage.setItem("velocity", 0);

    localStorage.setItem("basicIncrementor-quantity", 0);
    localStorage.setItem("basicIncrementor-cost", 10);
    localStorage.setItem("basicIncrementor-production", 1);

}

function adjustVelocity(){
    localStorage.setItem("velocity",
        parseFloat(localStorage.getItem("basicIncrementor-production"))*parseInt(localStorage.getItem("basicIncrementor-quantity"))
    )
}

let INTERVAL = 100;
let refreshRate = setInterval(refresh, 0);
let gainRate = setInterval(gain, INTERVAL);

buttons();