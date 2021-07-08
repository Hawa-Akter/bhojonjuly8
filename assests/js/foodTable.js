const { ipcRenderer } = require("electron");

var foodTable = document.getElementById("food_table");
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodTable");
});
ipcRenderer.on("foodTableResultSent", (evt, foodTables) => {
  foodTables.map(function (fTable, index) {
    var baseURL = "https://restaurant.bdtask.com/demo/";
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var icon = document.createElement("td");
    var img = document.createElement("IMG");
    img.setAttribute("src", baseURL + fTable.table_icon);
    img.setAttribute("alt", "No image");
    img.setAttribute("width", "60");
    img.setAttribute("height", "40");
    icon.appendChild(img);

    var tableName = document.createElement("td");
    tableName.textContent = fTable.tablename;

    var capacity = document.createElement("td");
    capacity.textContent = fTable.person_capicity;

    tr.append(si, tableName, capacity, icon);
    foodTable.appendChild(tr);
  });
  foodTable.style.fontSize = "12px";
});
