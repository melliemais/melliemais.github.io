let a = "Hello";
console.log("Hello World");
const resetButton = document.querySelector("#reset");
const submitButton = document.querySelector("#submit");

function Reset(){
    resetButton.textContent = "Reset!";
    setTimeout(unClick, 1500);
}
function Submit(){
    submitButton.textContent = "Submitted!";
    setTimeout(unClick, 1500);
}
function unClick(){
    resetButton.textContent = "Reset";
    submitButton.textContent = "Submit";
}