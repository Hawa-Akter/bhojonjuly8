const { ipcRenderer } = require("electron");

const pendingOrderTable = document.getElementById("p_order_table");
const orderDetailsBtn = document.getElementById("details_btn");
const invoiceBtn = document.getElementById("invoice_btn");

function checkingOrderStatus(evt, checkingOrder) {
  let tabContent, tabLinks;
  tabContent = [...document.getElementsByClassName("tabcontent")];

  tabContent.forEach((element) => {
    element.style.display = "none";
  });

  tabLinks = [...document.getElementsByClassName("tablinks")];
  tabLinks.forEach((element) => {
    element.className = element.className.replace("active", "");
  });

  document.getElementById(checkingOrder).style.display = "block";
  evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("order:pending");
});

ipcRenderer.on("Order:pendingOrderList", (e, pendingOrderList) => {
  pendingOrderList.map((pendingOrder, index) => {
    let tr = document.createElement("tr");

    let si = document.createElement("td");
    si.textContent = index + 1;

    let invoiceId = document.createElement("td");
    invoiceId.textContent = pendingOrder.saleinvoice;

    let onlineId = document.createElement("td");
    onlineId.textContent = "";

    let customerName = document.createElement("td");
    customerName.textContent = pendingOrder.customer_name;

    let customerType = document.createElement("td");
    customerType.textContent = pendingOrder.customer_type;

    let waiter = document.createElement("td");
    waiter.textContent = pendingOrder.first_name;

    let table = document.createElement("td");
    table.textContent = pendingOrder.tablename;

    let orderDate = document.createElement("td");
    orderDate.textContent = pendingOrder.order_date;

    let amount = document.createElement("td");
    amount.textContent = pendingOrder.totalamount;

    let action = document.createElement("td");

    let icon = document.createElement("i");
    icon.className = "fa fa-eye";
    icon.setAttribute("aria-hidden", "true");

    let detailsBtn = document.createElement("button");
    detailsBtn.id = "details_btn";
    detailsBtn.className = "btn me-2";
    detailsBtn.onclick = () => orderDetails(pendingOrder.id);
    detailsBtn.append(icon);

    let invoiceIcon = document.createElement("i");
    invoiceIcon.className = "fa fa-window-restore ";
    invoiceIcon.setAttribute("aria-hidden", "true");
    invoiceIcon.setAttribute("style", "color:white");

    let invoiceBtn = document.createElement("button");
    invoiceBtn.id = "invoice_btn";
    invoiceBtn.className = "btn";
    invoiceBtn.onclick = () => invoiceBtnClicked(pendingOrder.id);
    invoiceBtn.append(invoiceIcon);
    // invoiceBtn.setAttribute("style", "background-color:green");
    //invoiceBtn.setAttribute("style", "color:white");
    action.append(detailsBtn, invoiceBtn);

    tr.append(
      si,
      invoiceId,
      onlineId,
      customerName,
      customerType,
      waiter,
      table,
      orderDate,
      amount,
      action
    );
    pendingOrderTable.append(tr);
  });
});

function orderDetails(id) {
  console.log("Orde detials btn id", id);
  ipcRenderer.send("OrderDetailsBtnClicked:OrderId", id);
}

function invoiceBtnClicked(id) {
  ipcRenderer.send("InvoiceBtnClicked:OrderId", id);
}
