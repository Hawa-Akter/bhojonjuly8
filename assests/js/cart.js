const { ipcRenderer } = require("electron");

const foodVarientTable = document.getElementById("f_varient_table");
const varientTable = document.querySelector("#varient_table");
const addOnTable = document.getElementById("add_on_table");
const addsTable = document.getElementById("addOnTable");
const addToCartBtn = document.querySelector("#addToCartBtn");

var addonItems = [];
var foodVarients = [];
var itemsOnCart = [];

ipcRenderer.on("checkProductInfoSend", (e, r) => {
  console.log("Food", e, r);
});

// fetching the adds on items from select food and addon window
var cart = document.querySelector("#carts");
cart.addEventListener("click", (e) => {
  var addOnName, price, addsOnquantity, addOntotal, foodId;
  var targetEl = e.target;
  //console.log(targetEl.parentElement.id);

  if (
    targetEl.classList.contains("cart-quantity-input") &&
    targetEl.value > 0
  ) {
    addOnName = targetEl.parentElement.previousElementSibling.textContent;
    addOnId = targetEl.parentElement.previousElementSibling.id;

    price =
      targetEl.parentElement.nextElementSibling.nextElementSibling.textContent;
    addsOnquantity = targetEl.value;

    addOntotal =
      targetEl.parentElement.parentElement.lastElementChild.textContent;
    foodId = document.getElementsByClassName("foodAId")[0].id;
    addonItems.push({
      addOnName,
      addOnId,
      price,
      addsOnquantity,
      addOntotal,
      foodId,
    });
  }
});
//end of fetching addsOn items
let foodIDS = [];
addToCartBtn.addEventListener("click", () => {
  var foodId = document.querySelector(".foodId").id;
  foodIDS.push(foodId);
  var itemName = document.querySelector("#food_name").textContent;
  let v_dropdown = document.querySelector(".dropdown");
  let varientId = v_dropdown.id;
  var v = document.querySelector("#mySelect");

  var varient = v.options[v.selectedIndex].text;
  var quantity = document.querySelector("#quantity_input").value;
  var quantity2 = document.querySelector("#quantity_input");
  var foodPrice = document.querySelector("#net_price").textContent;
  var foodTotal = document.querySelector("#total_price").textContent;

  foodVarients.push({
    itemName,
    varient,
    varientId,
    quantity,
    foodPrice,
    foodTotal,
    foodId,
  });
  itemsOnCart.push({ foodVarients, addonItems });
  ipcRenderer.send("itemsOnBasket", itemsOnCart);
});
console.log("FoodID", foodIDS);
//changing the total price based on addson quantity
addOnTable.addEventListener("click", (e) => {
  const targetEl = e.target;
  if (targetEl.classList.contains("cart-quantity-input")) {
    const addOnName = targetEl.parentElement.previousElementSibling.textContent;

    const price =
      targetEl.parentElement.nextElementSibling.nextElementSibling.textContent;

    let quantity = targetEl.value;

    totalPrice = price * quantity;

    let lastChild =
      (targetEl.parentElement.parentElement.lastElementChild.innerHTML =
        totalPrice);
  }
});

//calculating price and  quantity on food table
function calculatePriceQty() {
  const priceElement = document.querySelector("#f_varient_table #net_price");
  const quantityElement = document.querySelector(
    "#f_varient_table #quantity_input"
  );
  const total_price = document.querySelector("#f_varient_table #total_price");

  let price = parseInt(priceElement?.textContent);
  let quantity = parseInt(quantityElement?.value);
  let total = price * quantity;

  total_price.innerHTML = total;
}

//getting price based on the varient name on food table
function getPriceByVarient() {
  var optionPrice = document.getElementById("mySelect").value;
  var price = document.getElementById("net_price");
  if (optionPrice == "1:1") {
    price.innerHTML = optionPrice;
  } else if (optionPrice == "1:3") {
    price.innerHTML = optionPrice;
  } else {
    price.innerHTML = optionPrice;
  }

  calculatePriceQty();
}

ipcRenderer.on("foodsOnCartSent", (e, foods) => {
  var index = foods.length;
  console.log(foods);
  if (index == 0) {
    varientTable.style.display = "none";
  } else {
    var tr = document.createElement("tr");
    tr.className = "foodId";
    tr.id = foods[0].ProductsID;

    var itemName = document.createElement("td");
    itemName.textContent = foods[0].ProductName;
    itemName.id = "food_name";

    var quantity = document.createElement("td");
    var input = document.createElement("input");
    input.id = "quantity_input";
    input.classList.add("cart-quantity");
    input.type = "number";
    input.value = "1";
    input.min = "1";
    input.onchange = () => calculatePriceQty();
    quantity.appendChild(input);

    var varientSize = document.createElement("td");
    varientSize.id = foods[0].variantid;
    varientSize.classList.add("dropdown");
    var select = document.createElement("select");
    select.setAttribute("class", "form-select");
    select.setAttribute("id", "mySelect");
    select.setAttribute("aria-label", "Default select example");
    select.onchange = () => getPriceByVarient();

    for (const val of foods) {
      var option = document.createElement("option");
      option.value = val.price;
      option.text = val.variantName;
      select.appendChild(option);
    }
    varientSize.appendChild(select);

    var varientPrice = document.createElement("td");
    varientPrice.id = "net_price";
    varientPrice.textContent = foods[0].price;

    var totalPrice = document.createElement("td");
    totalPrice.id = "total_price";
    totalPrice.textContent = foods[0].price;

    tr.append(itemName, quantity, varientSize, varientPrice, totalPrice);
    foodVarientTable.appendChild(tr);
  }
});

ipcRenderer.on("addOnCartSent", (evt, addons) => {
  if (addons.length != 0) {
    addons.map((addOn) => {
      var tr = document.createElement("tr");
      tr.className = "foodAId";
      tr.id = addOn.ProductsID;

      var addOnName = document.createElement("td");
      addOnName.textContent = addOn.add_on_name;
      addOnName.id = addOn.add_on_id;

      var quantity = document.createElement("td");
      var input = document.createElement("input");
      input.id = "quantity";
      input.classList.add("cart-quantity-input");
      input.type = "number";
      input.value = "0";
      quantity.appendChild(input);

      var empty = document.createElement("td");
      empty.textContent = "";

      var addOnPrice = document.createElement("td");
      addOnPrice.id = "add_on_price";
      addOnPrice.textContent = addOn.price;

      var totalPrice = document.createElement("td");
      totalPrice.id = "total_price";
      totalPrice.textContent = 0;

      tr.append(addOnName, quantity, empty, addOnPrice, totalPrice);
      addOnTable.appendChild(tr);
    });
  } else {
    addsTable.style.display = "none";
  }
});
