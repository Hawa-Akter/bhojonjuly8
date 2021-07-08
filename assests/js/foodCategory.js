const { ipcRenderer } = require("electron");

var categoryTable = document.getElementById("food_category_table");
var baseURL = "https://restaurant.bdtask.com/demo/";

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodCategory");
});
ipcRenderer.on("foodCategoryresultSent", (evt, foodCategories) => {
  foodCategories.map(function (category, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var image = document.createElement("td");
    var img = document.createElement("IMG");
    var imgURL = category.CategoryImage;
    imgURL = imgURL.replace("./a", "a");
    img.setAttribute("src", baseURL.concat(imgURL));
    img.setAttribute("alt", "No image");
    img.setAttribute("width", "60");
    img.setAttribute("height", "40");
    image.appendChild(img);

    var categoryName = document.createElement("td");
    categoryName.textContent = category.Name;

    var parentMenu = document.createElement("td");
    parentMenu.textContent = category.parentid;

    var status = document.createElement("td");
    status.textContent = category.CategoryIsActive == 1 ? "Active" : "Inactive";

    tr.append(si, image, categoryName, parentMenu, status);
    categoryTable.appendChild(tr);
  });
  categoryTable.style.fontSize = "12px";
});
