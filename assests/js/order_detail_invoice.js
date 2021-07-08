const { ipcRenderer } = require("electron");

const settingDetailsDiv = document.getElementById("setting_details");
const billingToDiv = document.getElementById("billing_to");
const invoiceDiv = document.getElementById("invoice_div_id");
const itemDetailsTable = document.getElementById("itemDetails");
const canvas = document.getElementById("sig-canvas");

const sigImage = document.getElementById("sig-image");
const clearBtn = document.getElementById("sig-clearBtn");
const submitBtn = document.getElementById("sig-submitBtn");
const printBtn = document.getElementById("print_order_details_btn");
const baseURL = "https://restaurant.bdtask.com/demo/";
const signImg = document.getElementById("sig-image");
function hideSignatureImg() {
  signImg.style.visibility = "hidden";
}
ipcRenderer.on("setting:billingFromSent", (e, settingDetails) => {
  settingDetails.forEach((setting) => {
    let logo = document.createElement("img");
    logo.setAttribute("src", baseURL + setting.logo);

    let billingFromBtn = document.createElement("button");
    billingFromBtn.textContent = "Billing From";
    billingFromBtn.disabled = true;
    billingFromBtn.id = "billingFromId";

    let title = document.createElement("p");
    title.textContent = setting.title;
    title.className = "company_settings";
    title.id = "setting_title";

    let address = document.createElement("p");
    address.textContent = setting.address;
    address.className = "company_settings";

    let phone = document.createElement("p");
    phone.textContent = setting.phone;
    phone.className = "company_settings";

    let email = document.createElement("p");
    email.textContent = setting.email;
    email.className = "company_settings";
    // addressElement.textContent = setting.address;

    settingDetailsDiv.append(
      logo,
      billingFromBtn,
      title,
      address,
      phone,
      email
    );
  });
});

billingToDiv.addEventListener("click", () => {});
ipcRenderer.on("Posorder:invoiceInfo", (e, invoiceInfo) => {
  invoiceInfo.map((info) => {
    let invoiceHeading = document.createElement("h4");
    invoiceHeading.textContent = "Invoice";

    let invoiceNo = document.createElement("p");
    invoiceNo.textContent = "Invoice no: " + info.saleinvoice;
    invoiceNo.className = "invoice_info";
    invoiceNo.id = "invoice_info_id";

    let orderStatus = document.createElement("p");
    orderStatus.textContent =
      "Order status: " + (info.order_status == 2 ? "Pending" : "");
    orderStatus.className = "invoice_info";

    let billingDate = document.createElement("p");
    billingDate.textContent = "Billing data: " + info.order_date;
    billingDate.className = "invoice_info";
    invoiceDiv.append(invoiceHeading, invoiceNo, orderStatus, billingDate);
  });
});

ipcRenderer.on("Posorder:billingToInfo", (e, billingToInfo) => {
  billingToInfo.map((billingTo) => {
    let billingToBtn = document.createElement("button");
    billingToBtn.textContent = "Billing To";
    billingToBtn.disabled = true;
    billingToBtn.id = "billingToId";

    let customerName = document.createElement("p");
    customerName.textContent = billingTo.customer_name;
    customerName.style.fontWeight = "Bold";
    customerName.className = "billing_to";
    customerName.id = "billing_to_id";

    let customerAddress = document.createElement("p");
    customerAddress.textContent = "Address: " + billingTo.customer_address;
    customerAddress.className = "billing_to";

    let customerPhone = document.createElement("p");
    customerPhone.textContent = "Billing data: " + billingTo.customer_phone;
    customerPhone.className = "billing_to";
    billingToDiv.append(
      billingToBtn,
      customerName,
      customerAddress,
      customerPhone
    );
  });
});
ipcRenderer.on("Posorder:orderItemInfo", (e, orderItem) => {
  orderItem.map((i) => {
    let itemDetails = i.order_details;
    let jsonData = JSON.parse(itemDetails);
    ipcRenderer.send("PosOrder:orderDetailsData", jsonData);
  });
});

let pendingOrders = [];

ipcRenderer.on("OrderDetailInvoice:ItemsSent", (e, result) => {
  console.log();
  pendingOrders.push(...result);
});

const displayPendingOrder = () => {
  pendingOrders.map((item) => {
    console.log(item);
    let tr = document.createElement("tr");

    let itemName = document.createElement("td");
    itemName.textContent = item.row.ProductName;

    let varientSize = document.createElement("td");
    varientSize.textContent = item.row.variantName;

    let unitPrice = document.createElement("td");
    unitPrice.textContent = item.row.price;
    let unitPriceInt = parseInt(unitPrice.textContent);

    let qty = document.createElement("td");
    qty.textContent = item.qty;
    let qtyInt = parseInt(qty.textContent);

    let totalPrice = document.createElement("td");
    totalPrice.className = "item_total_price";
    totalPrice.textContent = unitPriceInt * qtyInt;
    tr.append(itemName, varientSize, unitPrice, qty, totalPrice);
    itemDetailsTable.append(tr);
  });
};

setTimeout(() => {
  displayPendingOrder();
}, 100);

function gettingInvoiceTotal() {
  let itemContainer = document.getElementsByClassName("order_items")[0];
  let itemRows = itemContainer.querySelectorAll("#itemDetails tr");
  var total = 0;
  for (var i = 0; i < itemRows.length; i++) {
    var itemRow = itemRows[i];
    const totalPriceElement =
      itemRow.getElementsByClassName("item_total_price")[0];
    let subTotalprice = parseInt(totalPriceElement?.textContent);
    total = total + subTotalprice;
  }
  //rounding the total into 2 Decimal place
  total = Math.round((total + Number.EPSILON) * 100) / 100;

  return total;
}

const displaySubTotalOrder = () => {
  let trSubTotal = document.createElement("tr");
  let subTotal = document.createElement("td");
  subTotal.colSpan = "4";
  subTotal.style.textAlign = "right";
  subTotal.textContent = "Subtotal ";
  let subTotalAmount = document.createElement("td");
  subTotalAmount.textContent = gettingInvoiceTotal();

  let trDiscount = document.createElement("tr");
  let discount = document.createElement("td");
  discount.colSpan = "4";
  discount.style.textAlign = "right";
  discount.textContent = "Discount ";
  let discountAmount = document.createElement("td");
  discountAmount.textContent = "0.0";

  let trServiceCharge = document.createElement("tr");
  let serviceCharge = document.createElement("td");
  serviceCharge.colSpan = "4";
  serviceCharge.style.textAlign = "right";
  serviceCharge.textContent = "Service charge ";
  let serviceChargeAmount = document.createElement("td");
  serviceChargeAmount.textContent = "0.0";

  let trVat = document.createElement("tr");
  let vat = document.createElement("td");
  vat.colSpan = "4";
  vat.style.textAlign = "right";
  vat.textContent = "Vat(15%) ";
  let vatAmount = document.createElement("td");
  let vatInt = parseFloat((subTotalAmount.textContent / 100) * 15).toFixed(2);
  console.log(vatInt);
  vatAmount.textContent = vatInt;

  let trGrand = document.createElement("tr");
  let grandTotal = document.createElement("td");
  grandTotal.colSpan = "4";
  grandTotal.style.textAlign = "right";
  grandTotal.textContent = "Grand Total";
  let grandTotalAmount = document.createElement("td");
  let grand = subTotalAmount.textContent * ((100 + 15) / 100);
  let grandWithTax = parseFloat(grand).toFixed(2);
  grandTotalAmount.textContent = grandWithTax;

  let trTotalDue = document.createElement("tr");
  let totalDue = document.createElement("td");
  totalDue.colSpan = "4";
  totalDue.style.textAlign = "right";
  totalDue.textContent = "Total due";
  let totalDueAmount = document.createElement("td");
  totalDueAmount.textContent = grandWithTax;

  let trChangeDue = document.createElement("tr");
  let changeDue = document.createElement("td");
  changeDue.colSpan = "4";
  changeDue.style.textAlign = "right";
  changeDue.textContent = "Change due";
  let changeDueAmount = document.createElement("td");
  changeDueAmount.textContent = "0.0";

  trSubTotal.append(subTotal, subTotalAmount);
  trDiscount.append(discount, discountAmount);
  trServiceCharge.append(serviceCharge, serviceChargeAmount);
  trVat.append(vat, vatAmount);
  trGrand.append(grandTotal, grandTotalAmount);
  trTotalDue.append(totalDue, totalDueAmount);
  trChangeDue.append(changeDue, changeDueAmount);
  // itemDetailsTable.append(trSubTotal)
  itemDetailsTable.append(
    trSubTotal,
    trDiscount,
    trServiceCharge,
    trVat,
    trGrand,
    trTotalDue,
    trChangeDue
  );
};

// console.log({ newItems });
setTimeout(() => {
  displaySubTotalOrder();
}, 200);
(function () {
  window.requestAnimFrame = (function (callback) {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimaitonFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 4;

  var drawing = false;
  var mousePos = {
    x: 0,
    y: 0,
  };
  var lastPos = mousePos;

  canvas.addEventListener(
    "mousedown",
    function (e) {
      drawing = true;
      lastPos = getMousePos(canvas, e);
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (e) {
      drawing = false;
    },
    false
  );

  canvas.addEventListener(
    "mousemove",
    function (e) {
      mousePos = getMousePos(canvas, e);
    },
    false
  );

  // Add touch event support for mobile
  canvas.addEventListener("touchstart", function (e) {}, false);

  canvas.addEventListener(
    "touchmove",
    function (e) {
      var touch = e.touches[0];
      var me = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(me);
    },
    false
  );

  canvas.addEventListener(
    "touchstart",
    function (e) {
      mousePos = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var me = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(me);
    },
    false
  );

  canvas.addEventListener(
    "touchend",
    function (e) {
      var me = new MouseEvent("mouseup", {});
      var dataUrl = canvas.toDataURL();
      //sigText.innerHTML = dataUrl;
      sigImage.setAttribute("src", dataUrl);
      canvas.dispatchEvent(me);
    },
    false
  );

  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }

  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  }

  function renderCanvas() {
    if (drawing) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }

  // Prevent scrolling when touching the canvas
  document.body.addEventListener(
    "touchstart",
    function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    },
    false
  );
  document.body.addEventListener(
    "touchend",
    function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    },
    false
  );
  document.body.addEventListener(
    "touchmove",
    function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    },
    false
  );

  (function drawLoop() {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

  function clearCanvas() {
    canvas.width = canvas.width;
  }

  // Set up the UI

  clearBtn.addEventListener(
    "click",
    (e) => {
      clearCanvas();
      signImg.style.visibility = "hidden";
      //sigText.innerHTML = "Data URL for your signature will go here!";
      sigImage.setAttribute("src", "");
    },
    false
  );

  submitBtn.addEventListener(
    "click",
    (e) => {
      signImg.style.visibility = "visible";
      var dataUrl = canvas.toDataURL();
      //sigText.innerHTML = dataUrl;
      sigImage.setAttribute("src", dataUrl);
    },
    false
  );
})();

function printOderDetails() {
  //Get the print button and put it into a variable

  //Set the button visibility to 'hidden'
  canvas.style.visibility = "hidden";
  submitBtn.style.visibility = "hidden";
  clearBtn.style.visibility = "hidden";
  printBtn.style.visibility = "hidden";
  //Print the page content
  window.print();

  //Restore button visibility
  canvas.style.visibility = "visible";
  submitBtn.style.visibility = "visible";
  clearBtn.style.visibility = "visible";
  printBtn.style.visibility = "visible";
}
