let a = "Hello";
console.log("Hello World");
const resetButton = document.querySelector("#reset");

function onClick(){
    resetButton.textContent = "Reset!";
    setTimeout(unClick, 1500);
}
function unClick(){
    resetButton.textContent = "Reset";
}