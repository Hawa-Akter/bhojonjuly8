const { ipcRenderer, ipcMain } = require("electron");

const categoryUl = document.getElementById("category_item");
const foodList = document.getElementById("foods");
const foodByAllCategory = document.getElementById("allCategory");
const cartData = document.getElementById("items_cart");
const cartTable = document.getElementById("itemsOnCart");
const cartImage = document.getElementById("myImg");
const customerTypeDropdown = document.getElementById("c_type_dropdown");
const waiterDropdown = document.querySelector("#waiter_dropdown");
const tableDropdown = document.querySelector("#table_dropdown");
const vatInput = document.querySelector("#vat_input");
const grandInput = document.querySelector("#grand_input");
const placeOrderBtn = document.querySelector("#place_order");
const cookingTimeElement = document.querySelector("#appt-time");
const cancelOrder = document.querySelector("#cancel_order");

var today = new Date();
const baseURL = "https://restaurant.bdtask.com/";
cancelOrder.addEventListener("click", () => {});
//different tabs
function pos(evt, posSytem) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(posSytem).style.display = "block";
  evt.currentTarget.className += " active";
}
//pos start here
function gettingTokenItems() {
  let trs = [...document.querySelectorAll("#items_cart tr")];
  let customerName =
    customerTypeDropdown.options[customerTypeDropdown.selectedIndex].value;
  let tokenItems = [];
  trs.map((tr) => {
    const tokenDetails = {
      itemName: tr.querySelector(".item")?.textContent,
      itemQty: tr.querySelector(".food-qty input")?.value,
      size: tr.querySelector(".varient")?.textContent,
      addOnName: tr.querySelector(".addOn")?.textContent,
      addonQty: tr.querySelector(".addon-qty input")?.value,
    };
    tokenItems.push(tokenDetails);
  });
  return tokenItems;
}
function gettingCartItems() {
  let trs = [...document.querySelectorAll("#items_cart tr")];

  let cartItems = [];
  trs.map((tr) => {
    const item = {
      menuId: tr.querySelector(".item")?.id,
      menuQty: tr.querySelector(".food-qty input")?.value,
      addOnId: tr.querySelector(".addOn")?.id,
      addonQty: tr.querySelector(".addon-qty input")?.value,
      varientId: tr.querySelector(".varient")?.id,
    };

    cartItems.push(item);
  });

  return cartItems;
}

//place order here
placeOrderBtn.addEventListener("click", () => {
  let customerId =
    customerTypeDropdown.options[customerTypeDropdown.selectedIndex].value;
  let waiterId = waiterDropdown.options[waiterDropdown.selectedIndex].value;
  let tableNo = tableDropdown.options[tableDropdown.selectedIndex].value;
  let cookingTime = cookingTimeElement.value;

  let orderDate =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let orderTime =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let totalAmount = grandInput.value;

  const orderDetails = JSON.stringify(gettingCartItems());
  const tokenDetails = gettingTokenItems();
  let posOrder = [];
  posOrder.push({
    customerId,
    waiterId,
    tableNo,
    cookingTime,
    orderDate,
    orderTime,
    totalAmount,
    orderDetails,
    tokenDetails,
  });
  console.log("POS order items are ", posOrder);
  ipcRenderer.send("PosOrderItems", posOrder);
  vatInput.value = "0.0";
  grandInput.value = "0.0";
  cartData.innerHTML = "";
  cartTable.style.display = "none";
  cartImage.style.display = "block";
});

//Foods  on cart
ipcRenderer.on("ItemsOnBasketSent", (e, items) => {
  cartImage.style.display = "none";
  cartTable.style.display = "block";

  items.map((x) => {
    var tr = document.createElement("tr");

    tr.id = x.foodVarients[0].foodId;
    var itemName = document.createElement("td");
    itemName.id = x.foodVarients[0].foodId;
    itemName.classList.add("item");
    itemName.textContent = x.foodVarients[0].itemName;

    var varient = document.createElement("td");
    varient.id = x.foodVarients[0].varientId;
    varient.classList.add("varient");
    varient.textContent = x.foodVarients[0].varient;

    var price = document.createElement("td");
    price.textContent = x.foodVarients[0].foodPrice;

    var qty = document.createElement("td");
    qty.classList.add("food-qty");

    var inpt = document.createElement("input");
    inpt.id = "quantity_input";
    inpt.classList.add("cart-quantity-input");
    inpt.type = "number";
    inpt.value = x.foodVarients[0].quantity;
    inpt.onchange = (e) => updatePriceOnCart(e);
    inpt.style.width = "5em";
    inpt.style.border = "1px solid black";
    qty.appendChild(inpt);

    var total = document.createElement("td");
    total.textContent = x.foodVarients[0].foodTotal;
    total.classList = "foodTotal";

    var remove = document.createElement("td");
    var input = document.createElement("input");
    input.id = "remove_cart_item";
    input.classList.add("remove-cart-quantity");
    input.type = "button";
    input.value = "X";
    input.onclick = () => removeCartItem(x.foodVarients[0].foodId);

    remove.appendChild(input);

    tr.append(itemName, varient, price, qty, total, remove);
    cartData.appendChild(tr);
  });

  const addonsArr = items[0].addonItems;
  const foodName = "addOnName";
  const foodAddons = [
    ...new Map(addonsArr.map((item) => [item[foodName], item])).values(),
  ];
  foodAddons &&
    foodAddons.length !== 0 &&
    foodAddons.map((addOnItem) => {
      let trV = document.createElement("tr");
      trV.id = addOnItem.foodId;

      let addOnName = document.createElement("td");
      addOnName.textContent = addOnItem.addOnName;
      addOnName.id = addOnItem.addOnId;
      addOnName.className = "addOn";

      let emp = document.createElement("td");
      emp.textContent = "";

      let priceVarient = document.createElement("td");
      priceVarient.textContent = addOnItem.price;

      let qtyV = document.createElement("td");
      qtyV.classList.add("addon-qty");
      let inpt = document.createElement("input");
      inpt.id = "quantity_input";
      inpt.classList.add("cart-quantity-input");
      inpt.type = "number";
      inpt.value = addOnItem.addsOnquantity;
      inpt.onchange = (e) => updatePriceOnCart(e);
      inpt.style.width = "5em";
      inpt.style.border = "1px solid black";
      qtyV.appendChild(inpt);

      let totalV = document.createElement("td");
      totalV.textContent = addOnItem.addOntotal;
      totalV.classList = "foodTotal";
      let removeV = document.createElement("td");
      removeV.textContent = "";

      trV.append(addOnName, emp, priceVarient, qtyV, totalV, removeV);
      cartData.append(trV);
    });
});

ipcRenderer.on("ItemsOnBasketSent", (e, r) => {
  let cartTotal = updateCartTotal();
  let vat = parseFloat((cartTotal / 100) * 15).toFixed(2);
  vatInput.value = vat;
  let grand = cartTotal * ((100 + 15) / 100);
  let grandWithTax = parseFloat(grand).toFixed(2);
  grandInput.value = grandWithTax;
});

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart_container")[0];
  let cartRows = cartItemContainer.querySelectorAll("#items_cart tr");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    const totalPriceElement = cartRow.getElementsByClassName("foodTotal")[0];
    let subTotalprice = parseInt(totalPriceElement?.textContent);
    total = total + subTotalprice;
  }
  //rounding the total into 2 Decimal place
  total = Math.round((total + Number.EPSILON) * 100) / 100;

  return total;
}

//table dropdown
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("tableSent");
});
ipcRenderer.on("tableReplySent", (e, tableList) => {
  var option;
  tableList.map((table) => {
    option += ` <option value="${table.tableid}">${table.tablename}</option>`;
  });
  tableDropdown.innerHTML += option;
});
//table dropdown end here

//waiter dropdown
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("waiterDropdown");
});
ipcRenderer.on("waiterListSent", (e, waiterDropdownList) => {
  var option;
  waiterDropdownList.map((waiter) => {
    option += ` <option value="${waiter.emp_his_id}">${waiter.first_name}</option>`;
  });
  waiterDropdown.innerHTML += option;
});
//waiter dropdown end here

//customer type dropdown
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("customerTypeDropdownLoaded");
});
ipcRenderer.on("customerTypeDropdownLoadedSent", (e, customerTypeList) => {
  var option;
  customerTypeList.map((customerType) => {
    option += ` <option value="${customerType.customer_type_id}">${customerType.customer_type}</option>`;
  });
  customerTypeDropdown.innerHTML += option;
});
//customer type dropdown end here
function removeCartItem(id) {
  let fID = id;
  let trs = [...document.querySelectorAll("#items_cart tr")];

  if (trs.length == 1) {
    cartTable.style.display = "none";
    cartImage.style.display = "block";
  }
  trs.map((tr) => {
    if (tr.id == fID) {
      tr.remove();
      updateCartTotal();

      var cartTotal = updateCartTotal();

      let vat = parseFloat((cartTotal / 100) * 15).toFixed(2);
      vatInput.value = vat;
      var grand = cartTotal * ((100 + 15) / 100);
      var grandWithTax = parseFloat(grand).toFixed(2);
      grandInput.value = grandWithTax;
    }
  });
}

function updatePriceOnCart(e) {
  var quantity = e.target.value;
  var price = e.target.parentElement.previousElementSibling.textContent;
  var subTotal = quantity * price;
  var total = e.target.parentElement.nextElementSibling;
  total.textContent = subTotal;
  updateCartTotal();
  var cartTotal = updateCartTotal();

  let vat = parseFloat((cartTotal / 100) * 15).toFixed(2);
  vatInput.value = vat;
  var grand = cartTotal * ((100 + 15) / 100);
  var grandWithTax = parseFloat(grand).toFixed(2);
  grandInput.value = grandWithTax;
}

function getFoodId(id) {
  ipcRenderer.send("foodIdSent", id);
}

//sending category id to fetch foods by specific category
function getCategoryId(id) {
  console.log("Catgory Id", id);
  ipcRenderer.send("categoryId", id);
}

//creating dynamic category on pos page
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("categoryNamesLoaded");
});

ipcRenderer.on("categoryNamesReplySent", function (event, results) {
  results.forEach(function (result) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.textContent = result.Name;
    li.appendChild(a);
    li.onclick = () => getCategoryId(result.CategoryID);
    categoryUl.appendChild(li);
  });
});
//end of dynamic category on pos page

// displaying food by category
ipcRenderer.on("foodsByCategoryReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";

  foods.forEach((food) => {
    div += `
    <div class=" col-lg-3 col-sm-4 col-6">
    <a href="#" class="card text-decoration-none food-item" id=${food.ProductsID} onclick = {getFoodId(${food.ProductsID})}>
    <img src="${baseURL}${food.ProductImage}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><h3 class="item-details-title"> 
      ${food.ProductName}
        </h3>
      </div>
      </a>
      </div>`;
  });

  foodList.innerHTML += div;
});

// displaying food by all  category
foodByAllCategory.addEventListener("click", () => {
  ipcRenderer.send("foodByALlCategory");
});
ipcRenderer.on("foodsByAllCategoryReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";
  foods.forEach((food) => {
    div += `
    <div class="col-lg-3 col-sm-4 col-6">
    <a href="#" class="card text-decoration-none food-item" id=${food.ProductsID} onclick = {getFoodId(${food.ProductsID})}>
    <img src="${baseURL}${food.ProductImage}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><h3 class="item-details-title">
      ${food.ProductName}
       </h3>
      </div>
      </a>
    </div>`;
  });
  foodList.innerHTML += div;
});
// end of displaying food by all category

// displaying the foods when the page loaded
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("foodOnPageLoaded");
});
ipcRenderer.on("foodOnPageLoadedReplySent", (evt, foods) => {
  foodList.innerHTML = "";
  var div = "";
  foods.forEach((food) => {
    div += `
    <div class=" col-lg-3 col-sm-4 col-6" >
    <a href="#" class="card text-decoration-none food-item" id=${food.ProductsID} onclick = {getFoodId(${food.ProductsID})}>
      <img src="${baseURL}${food.ProductImage}" height="100" width="206" class="card-img-top">
      <div class="food_items" style="text-align: center;"><h3 class="item-details-title">${food.ProductName}</h3>
      </div>
      </a>
    </div>`;
  });
  foodList.innerHTML += div;
});

//pos ends here

//ongoing order start here
const ongoingContainer = document.getElementById("ongoing_container");
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("ongoingOrderLoaded");
});
ipcRenderer.on("OngoingOrderListSent", (e, ongoingOrderList) => {
  let ongoingContents = "";
  ongoingContainer.innerHTML = "";
  ongoingOrderList.map((ongoingOrder) => {
    ongoingContents += `
    <div class="col-sm-4 col-md-3 col-xs-6 col-xlg-2 mb-2">
        <div class="hero-widget well well-md height-auto">
            <div class="mdjc">
                <label><strong>Table: ${ongoingOrder.tablename}</strong></label>
                <div class="d-flex align-items-center">
                    <div class=""><a href="#" onclick="editposorder(11499,1)"
                            class="btn btn-xs btn-success btn-sm mr-1 pdmr" data-toggle="tooltip"
                            data-placement="left" title="" data-original-title="Update Order"
                            id="table-11499"><i class="ti-pencil"></i></a></div>
                    <div class="kitchen-tab bd-pd-overflow">
                        <input id="chkbox-11499" type="checkbox" class="individual"
                            name="margeorder" value="11499">

                    </div>
                </div>
            </div>
            <p class="mb-0">
                <label>Order Number: ${ongoingOrder.saleinvoice}</label>
            </p>
            <p class="mb-0">
                <label>Waiter : ${ongoingOrder.first_name}</label>
            </p>
           
            <div>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0" onclick="completeBtnClicked(${ongoingOrder.id})">Complete</a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0">Split</a>
                <a href="#" class="btn btn-xs btn-danger btn-sm mx-0 cancelorder"
                    data-toggle="tooltip" data-placement="left" title=""
                    data-original-title="Cancel Order" onclick="cancelOngoingOrder(${ongoingOrder.id})"><i class="ti-close"></i></a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0" data-toggle="tooltip"
                    data-placement="left" title="" data-original-title="Pos Invoice" onclick="orderDetails(${ongoingOrder.id})"><i
                        class="ti-fullscreen"></i></a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0 due_print"
                    data-toggle="tooltip" data-placement="left" title=""
                    data-url="https://restaurant.bdtask.com/demo/ordermanage/order/dueinvoice/11499"
                    data-original-title="Due Invoice" onclick="invoiceBtnClicked(${ongoingOrder.id})"><i class="ti-save"></i></a>
            </div>
        </div>
    
</div>`;
  });
  ongoingContainer.innerHTML += ongoingContents;
});

ipcRenderer.on("CancelOngoingOrder", (e, cancelOngoingOrderList) => {
  let ongoingContents = "";
  ongoingContainer.innerHTML = "";
  cancelOngoingOrderList.map((ongoingOrder) => {
    ongoingContents += `
    <div class="col-sm-4 col-md-3 col-xs-6 col-xlg-2 mb-2">
        <div class="hero-widget well well-md height-auto">
            <div class="mdjc">
                <label><strong>Table: ${ongoingOrder.tablename}</strong></label>
                <div class="d-flex align-items-center">
                    <div class=""><a href="#" onclick="editposorder(11499,1)"
                            class="btn btn-xs btn-success btn-sm mr-1 pdmr" data-toggle="tooltip"
                            data-placement="left" title="" data-original-title="Update Order"
                            id="table-11499"><i class="ti-pencil"></i></a></div>
                    <div class="kitchen-tab bd-pd-overflow">
                        <input id="chkbox-11499" type="checkbox" class="individual"
                            name="margeorder" value="11499">

                    </div>
                </div>
            </div>
            <p class="mb-0">
                <label>Order Number: ${ongoingOrder.saleinvoice}</label>
            </p>
            <p class="mb-0">
                <label>Waiter : ${ongoingOrder.first_name}</label>
            </p>                            

            <div>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0 " onclick="completeBtnClicked(${ongoingOrder.id})">Complete</a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0">Split</a>
                <a href="#" class="btn btn-xs btn-danger btn-sm mx-0 cancelorder"
                    data-toggle="tooltip" data-placement="left" title=""
                    data-original-title="Cancel Order" onclick="cancelOngoingOrder(${ongoingOrder.id})"><i class="ti-close"></i></a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0" data-toggle="tooltip"
                    data-placement="left" title="" data-original-title="Pos Invoice"><i
                        class="ti-fullscreen" onclick="orderDetails(${ongoingOrder.id})"></i></a>
                <a href="#" class="btn btn-xs btn-success btn-sm mx-0 due_print"
                    data-toggle="tooltip" data-placement="left" title=""
                    data-url="https://restaurant.bdtask.com/demo/ordermanage/order/dueinvoice/11499"
                    data-original-title="Due Invoice" onclick="invoiceBtnClicked(${ongoingOrder.id})"><i class="ti-save"></i></a>
            </div>
        </div>

</div>`;
  });
  ongoingContainer.innerHTML += ongoingContents;
});

function completeBtnClicked(id) {
  ipcRenderer.send("CompleteOngoingOrder:orderIdSent", id);
}
function cancelOngoingOrder(orderId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          ipcRenderer.send("CancelOngoingOrder:OrderIdSent", orderId),
          "Your file has been deleted.",
          "success"
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your  file is safe :)",
          "error"
        );
      }
    });
}
function orderDetails(id) {
  ipcRenderer.send("OrderDetailsBtnClicked:OrderId", id);
}
function invoiceBtnClicked(id) {
  ipcRenderer.send("InvoiceBtnClicked:OrderId", id);
}

//ongoing order end here
