"use strict";

function init() {
  let btn = document.getElementById("fetch-btn");
  btn.addEventListener("click", fetchDog);

  let btn2 = document.getElementById("meal-btn");
  btn2.addEventListener("click", fetchMeal);

  let btn3 = document.getElementById("joke-btn");
  btn3.addEventListener("click", fetchJoke);

  let btn4 = document.getElementById("num-btn");
  btn4.addEventListener("click", fetchFact);

  let btn5 = document.getElementById("bad-btn");
  btn5.addEventListener("click", fetchBadURL);

  let btn6 = document.getElementById("no-btn");
  btn6.addEventListener("click", fetchNoServer);
}

function fetchDog() {
  let url = "https://dog.ceo/api/breeds/image/random";
  fetch(url)
    .then(statusCheck)
    .then(resp => resp.json())
    .then(showDog)
    .catch(handleError);
}

function showDog(data) {
  console.log("Dog data:", data);
  let img = document.createElement("img");
  img.src = data.meals;
  img.alt = "A random dog";
  document.getElementById("output").appendChild(img);
}

async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}

function fetchMeal() {
  let food = document.getElementById("food-input").value;
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + food;
  fetch(url)
    .then(statusCheck)
    .then(resp => resp.json())
    .then(showMeals)
    .catch(handleError);
}

function showMeals(data){
  document.getElementById("meal-output").innerHTML = "";
  console.log("Meal data: "+JSON.stringify(data));
  if (data.meals == null){
    handleError("Cannot find it!");
    return;
  }
  for (let meal = 0; meal < data.meals.length; meal++){
    let img = document.createElement("img");
    img.src = data.meals[meal]["strMealThumb"];
    img.alt = "Food";
    document.getElementById("meal-output").appendChild(img);
  }
  
}

function fetchJoke() {
  let url = "https://official-joke-api.appspot.com/random_joke";
  fetch(url)
    .then(statusCheck)
    .then(resp => resp.json())
    .then(showJoke)
    .catch(handleError);
}

function showJoke(data) {
  console.log("Joke:", JSON.stringify(data));
  let text = document.createElement("p");
  text.innerHTML = data["setup"];
  document.getElementById("joke-output").appendChild(text);
  setTimeout(function(){
    text.innerHTML += " <b>"+data["punchline"]+"</b>";
  }, 3000)
  
}

function fetchFact() {
  let number = document.getElementById("number-input").value;
  let url = "http://numbersapi.com/"+number;
  fetch(url)
    .then(statusCheck)
    .then(resp => resp.text())
    .then(showJoke)
    .catch(handleError);
}

function showFact(data) {
  let text = document.createElement("p");
  text.innerHTML = data;
  document.getElementById("num-output").appendChild(text);
}

function handleError(err) {
  console.error("Something went wrong:", err);
  document.getElementById("output").textContent =
    "The kitchen is closed! (Error loading data)";
  alert("THE KITCHEN IS ON FIRE AAAAAAAA");
}

function fetchBadURL() {
  // This URL doesn't exist!
  fetch("https://dog.ceo/api/breeds/image/DOESNOTEXIST")
    .then(statusCheck)
    .then(resp => resp.json())
    .then(data => console.log(data))
    .catch(handleError);
}

function fetchNoServer() {
  fetch("https://this.server.does.not.exist.xyz/api")
    .then(statusCheck)
    .then(resp => resp.json())
    .then(data => console.log(data))
    .catch(handleError);
}


init();
