const { ipcRenderer } = require("electron");

const addOnTable = document.getElementById("addons_table");
const aaddOnAssignTable = document.getElementById("add_on_assign_table");

function foodAddsOn(event, addsOn) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(addsOn).style.display = "block";
  event.currentTarget.className += " active";
}
//add ons
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodAddOns");
});
ipcRenderer.on("foodAddOnsResultSent", (evt, addOns) => {
  addOns.map(function (addOn, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var addOnName = document.createElement("td");
    addOnName.textContent = addOn.add_on_name;

    var price = document.createElement("td");
    price.textContent = addOn.price;

    var status = document.createElement("td");
    status.textContent = addOn.is_active == 1 ? "Active" : "Inactive";

    tr.append(si, addOnName, price, status);
    addOnTable.appendChild(tr);
  });
});

//add ons assign
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodAddOnsAssign");
});
ipcRenderer.on("foodAddOnsAsssignResultSent", (evt, addOnAssign) => {
  addOnAssign.map(function (addOnAssign, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var addOnName = document.createElement("td");
    addOnName.textContent = addOnAssign.add_on_name;

    var foodName = document.createElement("td");
    foodName.textContent = addOnAssign.ProductName;

    tr.append(si, addOnName, foodName);
    aaddOnAssignTable.appendChild(tr);
  });
});
