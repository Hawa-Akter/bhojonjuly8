const { ipcRenderer, ipcMain } = require("electron");
const { lchown } = require("original-fs");

var foodTable = document.getElementById("food_table");
var foodVarientTable = document.getElementById("food_varient_table");
var foodAvaibleTable = document.getElementById("fd_availability_table");

function foods(evt, checkingFood) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(checkingFood).style.display = "block";
  evt.currentTarget.className += " active";
}

//foods table result
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodListLoaded");
});
ipcRenderer.on("foodsResultSent", function (event, foods) {
  var tr;
  var baseURL = "https://restaurant.bdtask.com/demo/";
  foods.map((food, index) => {
    tr = document.createElement("tr");

    var si = document.createElement("td");
    si.textContent = index + 1;

    var foodImage = document.createElement("td");
    var fImage = document.createElement("IMG");
    fImage.setAttribute("src", baseURL + food.ProductImage);
    fImage.setAttribute("height", "30");
    fImage.setAttribute("width", "50");
    foodImage.appendChild(fImage);

    var categoryName = document.createElement("td");
    categoryName.textContent = food.Name;

    var foodName = document.createElement("td");
    foodName.textContent = food.ProductName;

    var foodComponent = document.createElement("td");
    foodComponent.textContent = food.component;

    var foodVat = document.createElement("td");
    foodVat.textContent = food.productvat;

    var foodStatus = document.createElement("td");
    foodStatus.textContent = food.ProductsIsActive == 1 ? "Active" : "Inactive";

    tr.append(
      si,
      foodImage,
      categoryName,
      foodName,
      foodComponent,
      foodVat,
      foodStatus
    );
    foodTable.appendChild(tr);
  });
  foodTable.style.fontSize = "12px";
});
//end of food table result

// food varient table
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("FoodVarient");
});
ipcRenderer.on("foodVarientResultSent", (evt, foodVarients) => {
  foodVarients.map((varient, index) => {
    var tr = document.createElement("tr");

    var si = document.createElement("td");
    si.textContent = index + 1;

    var varientName = document.createElement("td");
    varientName.textContent = varient.variantName;

    var foodName = document.createElement("td");
    foodName.textContent = varient.ProductName;
    tr.append(si, varientName, foodName);
    foodVarientTable.appendChild(tr);
  });
  foodVarientTable.style.fontSize = "12px";
});
//end of food varient table

// food availability table
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("FoodAvailability");
});
ipcRenderer.on("foodAvailabilityResultSent", (evt, foodAvailability) => {
  console.log(foodAvailability);
  foodAvailability.map((available, index) => {
    var tr = document.createElement("tr");

    var si = document.createElement("td");
    si.textContent = index + 1;

    var foodName = document.createElement("td");
    foodName.textContent = available.ProductName;

    var availDay = document.createElement("td");
    availDay.textContent = available.availday;

    var availTime = document.createElement("td");
    availTime.textContent = available.availtime;
    tr.append(si, foodName, availDay, availTime);
    foodAvaibleTable.appendChild(tr);
  });
  foodAvaibleTable.style.fontSize = "12px";
});
//end of food availability table
