const { ipcRenderer } = require("electron");
const invoiceDiv = document.getElementById("invoice_card");
const baseURL = "https://restaurant.bdtask.com/demo/";
var today = new Date();
ipcRenderer.on("InvoiceHeadSent", (e, invoiceHead) => {
  console.log("invoiceHead", invoiceHead);
  let div = document.createElement("div");
  div.className = "invoice-head";

  let img = document.createElement("IMG");
  img.setAttribute("src", baseURL + invoiceHead[0].logo);
  img.setAttribute("alt", "");
  console.log(img);

  let p1 = document.createElement("p");
  p1.className = " my-0";
  p1.textContent = invoiceHead[0].address;
  let p2 = document.createElement("p");
  p2.className = " my-0";
  p2.textContent = invoiceHead[0].phone;
  div.append(img, p1, p2);
  console.log(div);
  invoiceDiv.append(div);
});
ipcRenderer.on("customerInfoSent", (e, customerInfo) => {
  let div = document.createElement("div");
  div.className = "customer_info";

  let h3 = document.createElement("h3");
  h3.textContent = customerInfo[0].customer_name;

  let p2 = document.createElement("p");
  let orderDate =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let orderTime =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  p2.textContent = "Date:" + orderDate + " " + orderTime;
  div.append(h3, p2);
  console.log(div);
  invoiceDiv.append(div);
});

ipcRenderer.on("InvoiceDetailsSent", (e, orderDetails) => {
  let divInvoiceDetails = document.createElement("div");
  divInvoiceDetails.className = "invoice-details";

  let divInvoiceList = document.createElement("div");
  divInvoiceList.className = "invoice-list";

  let invoiceTable = document.createElement("table");
  invoiceTable.className = "table table-sm table-borderless";

  let tableHead = document.createElement("thead");
  let th1 = document.createElement("th");
  th1.textContent = "Q";

  let th2 = document.createElement("th");
  th2.textContent = "Item";

  let th3 = document.createElement("th");
  th3.textContent = "Size";

  let th4 = document.createElement("th");
  th4.textContent = "Price";

  let th5 = document.createElement("th");
  th5.textContent = "Total";
  th5.className = "total_price";

  tableHead.append(th1, th2, th3, th4, th5);

  let tableBody = document.createElement("tbody");
  tableBody.className = "invoice_table";
  tableBody.id = "invoiceTable";
  orderDetails.forEach((item) => {
    let tableTr = document.createElement("tr");

    let itemQty = document.createElement("td");
    itemQty.textContent = item.menuQty;

    let itemName = document.createElement("td");
    itemName.textContent = item.row.ProductName;

    let size = document.createElement("td");
    size.textContent = item.row.variantName;

    let price = document.createElement("td");
    price.textContent = item.row.price;

    let total = document.createElement("td");
    total.classList = "total_price";
    total.textContent = item.row.price * item.menuQty;

    tableTr.append(itemQty, itemName, size, price, total);
    tableBody.append(tableTr);
  });
  console.log(divInvoiceDetails);
  invoiceTable.append(tableHead, tableBody);
  divInvoiceList.append(invoiceTable);
  divInvoiceDetails.append(divInvoiceList);
  invoiceDiv.append(divInvoiceDetails);
  // let addonTr = document.createElement("tr");
  // let addonQty = document.createElement("td");
  // addonQty.textContent = element.addonQty;

  // let empty = document.createElement("td");
  // empty.textContent = "";

  // let addOnName = document.createElement("td");
  // addOnName.textContent = element.addOnName;

  // addonTr.append(addOnName, empty, addonQty);
  // tableBody.append(tableTr, addonTr);
});

// ipcRenderer.on("InvoiceDetailsSent", (e, orderDetails) => {
//   console.log("customerInfo", orderDetails);
//   let divInvoiceDetails = document.createElement("div");
//   divInvoiceDetails.className = "invoice-details";

//   let divInvoiceList = document.createElement("div");
//   divInvoiceList.className = "invoice-list";

//   let divInvoiceTitle = document.createElement("div");
//   divInvoiceTitle.className = "invoice-title";

//   let h1 = document.createElement("h4");
//   h1.className = "heading";
//   h1.textContent = "Item";

//   let h2 = document.createElement("h4");
//   h2.className = "heading heading-child";
//   h2.textContent = "Total";

//   divInvoiceTitle.append(h1, h2);
//   divInvoiceDetails.append(divInvoiceList);
//   divInvoiceList.append(divInvoiceTitle);

//   orderDetails.map((item) => {
//     console.log(typeof item.row.price);
//     let divInvoiceData = document.createElement("div");
//     divInvoiceData.className = "invoice-data";

//     let divRawData = document.createElement("div");
//     divRawData.className = "row-data";

//     let subtotalHeading = document.createElement("h5");
//     subtotalHeading.className = "total_price";
//     subtotalHeading.textContent = item.row.price * item.menuQty;

//     let divItemInfo = document.createElement("div");
//     divItemInfo.className = "item-info";

//     let h5 = document.createElement("h5");
//     h5.className = "item-title";
//     h5.textContent = item.row.ProductName;

//     let pp1 = document.createElement("p");
//     pp1.className = "item-size";
//     pp1.textContent = item.row.variantName;

//     let pp2 = document.createElement("p");
//     pp2.className = "item-number";
//     pp2.textContent = item.row.price + " x " + item.menuQty;

//     divItemInfo.append(h5, pp1, pp2);
//     divRawData.append(divItemInfo, subtotalHeading);
//     divInvoiceData.append(divRawData);

//     divInvoiceList.append(divInvoiceData);
//   });

//   invoiceDiv.append(divInvoiceDetails);
// });
function gettingInvoiceTotal() {
  let itemContainer = document.getElementsByClassName("invoice_table")[0];
  let itemRows = itemContainer.querySelectorAll("#invoiceTable tr");
  var total = 0;
  for (var i = 0; i < itemRows.length; i++) {
    var itemRow = itemRows[i];
    const totalPriceElement = itemRow.getElementsByClassName("total_price")[0];

    let subTotalprice = parseInt(totalPriceElement?.textContent);
    total = total + subTotalprice;
    //console.log(total);
  }
  //rounding the total into 2 Decimal place
  total = Math.round((total + Number.EPSILON) * 100) / 100;

  return total;
}
setTimeout(() => {
  gettingInvoiceTotal();
}, 100);

ipcRenderer.on("InvoiceFooter", (e, result) => {
  let div1 = document.createElement("div");
  div1.className = "invoice-footer mb-15";

  let div2 = document.createElement("div");
  div2.className = "row-data";

  let div3 = document.createElement("div");
  div3.className = "item-info";

  let hh5 = document.createElement("h5");
  hh5.className = "my-5";
  hh5.textContent = gettingInvoiceTotal();

  let h5 = document.createElement("h5");
  h5.className = "item-title";
  h5.textContent = "Subtotal";

  div3.append(h5);
  div2.append(div3, hh5);
  div1.append(div2);

  let divVat = document.createElement("div");
  divVat.className = "row-data";

  let d1 = document.createElement("div");
  d1.className = "item-info";

  let hhh5 = document.createElement("h5");
  hhh5.className = "my-5";
  let vatInt = parseFloat((hh5.textContent / 100) * 15).toFixed(2);
  hhh5.textContent = vatInt;

  let hhhhh5 = document.createElement("h5");
  hhhhh5.className = "item-title";
  hhhhh5.textContent = "Vat(15.00%)";
  d1.append(hhhhh5);
  divVat.append(d1, hhh5);
  div1.append(divVat);

  let divServiceCharge = document.createElement("div");
  divServiceCharge.className = "row-data";

  let d11 = document.createElement("div");
  d11.className = "item-info";

  let hhh55 = document.createElement("h5");
  hhh55.className = "my-5";
  hhh55.textContent = "0.0";

  let hhhhh55 = document.createElement("h5");
  hhhhh55.className = "item-title";
  hhhhh55.textContent = "Service Charge";
  d11.append(hhhhh55);
  divServiceCharge.append(d11, hhh55);
  div1.append(divServiceCharge);

  let divDiscount = document.createElement("div");
  divDiscount.className = "row-data";

  let dItemInfo = document.createElement("div");
  dItemInfo.className = "item-info";

  let hValue = document.createElement("h5");
  hValue.className = "my-5";
  hValue.textContent = "0.0";

  let hService = document.createElement("h5");
  hService.className = "item-title";
  hService.textContent = "Discount";
  dItemInfo.append(hService);
  divDiscount.append(dItemInfo, hValue);
  div1.append(divDiscount);

  let divGrandTotal = document.createElement("div");
  divGrandTotal.className = "row-data border-top";

  let gItemInfo = document.createElement("div");
  gItemInfo.className = "item-info";

  let gValue = document.createElement("h5");
  gValue.className = "my-5";
  let grand = hh5.textContent * ((100 + 15) / 100);
  let grandWithTax = parseFloat(grand).toFixed(2);
  gValue.textContent = grandWithTax;

  let hGrandTotal = document.createElement("h5");
  hGrandTotal.className = "item-title";
  hGrandTotal.style.fontWeight = "bold";
  hGrandTotal.textContent = "Grand Total";
  gItemInfo.append(hGrandTotal);
  divGrandTotal.append(gItemInfo, gValue);
  div1.append(divGrandTotal);

  let divTotalDue = document.createElement("div");
  divTotalDue.className = "row-data";

  let tDueItemInfo = document.createElement("div");
  tDueItemInfo.className = "item-info";

  let tdValue = document.createElement("h5");
  tdValue.className = "my-5";
  tdValue.textContent = grandWithTax;

  let hTotalDue = document.createElement("h5");
  hTotalDue.className = "item-title";
  hTotalDue.textContent = "Total Due";
  tDueItemInfo.append(hTotalDue);
  divTotalDue.append(tDueItemInfo, tdValue);
  div1.append(divTotalDue);

  let divChangeDue = document.createElement("div");
  divChangeDue.className = "row-data";

  let cDueItemInfo = document.createElement("div");
  cDueItemInfo.className = "item-info";

  let cDueValue = document.createElement("h5");
  cDueValue.className = "my-5";
  cDueValue.textContent = "0.0";

  let hChangeDue = document.createElement("h5");
  hChangeDue.className = "item-title";
  hChangeDue.textContent = "Change Due";
  cDueItemInfo.append(hChangeDue);
  divChangeDue.append(cDueItemInfo, cDueValue);
  div1.append(divChangeDue);

  let divTotalPayment = document.createElement("div");
  divTotalPayment.className = "row-data";

  let tPaymentInfo = document.createElement("div");
  tPaymentInfo.className = "item-info";

  let totalPaymentValue = document.createElement("h5");
  totalPaymentValue.className = "my-5";
  totalPaymentValue.textContent = "0.0";

  let hTotalPayment = document.createElement("h5");
  hTotalPayment.className = "item-title";
  hTotalPayment.textContent = "Total payment";
  tPaymentInfo.append(hTotalPayment);
  divTotalPayment.append(tPaymentInfo, totalPaymentValue);
  div1.append(divTotalPayment);

  invoiceDiv.append(div1);

  let invoiceAddressDiv;
  result.map((order) => {
    invoiceAddressDiv = document.createElement("div");
    invoiceAddressDiv.className = "invoice_address";

    let row = document.createElement("row");
    row.className = "invoiceFooter1";
    row.style.display = "flex";

    let tokenNo = document.createElement("div");
    tokenNo.className = "col-md-4 token_no";
    tokenNo.textContent = "Receipt no: " + order.orderInfo[0].tokenno;

    let saleInVoice = document.createElement("div");
    saleInVoice.className = "col-md-4 saleinvoice";
    saleInVoice.textContent = "|Order: " + order.orderInfo[0].saleinvoice;

    let username = document.createElement("div");
    username.className = "col-md-4 user_name";
    username.textContent = "User: " + "Fernando";

    let row2 = document.createElement("row");
    row2.className = "col-md-12";
    // row2.style.borderBottom = " border-top: 0.5px dashed #747272;";/

    let poweredBy = document.createElement("h6");
    poweredBy.className = "";
    poweredBy.textContent = order.companyUrl[0].powerbytxt;

    row2.append(poweredBy);
    row.append(tokenNo, saleInVoice, username);
    invoiceAddressDiv.append(row, row2);
    invoiceDiv.append(invoiceAddressDiv);
  });
  let printDiv = document.createElement("div");
  printDiv.className = "printDIv";
  let printBtn = document.createElement("button");
  printBtn.className = "print_button";
  printBtn.id = "printBtn";
  printBtn.onclick = () => printOderDetails();

  let icon = document.createElement("i");
  icon.className = "fa fa-print";
  icon.style.color = "white";
  icon.setAttribute("aria-hidden", "true");

  printBtn.append(icon);
  printDiv.append(printBtn);
  invoiceDiv.append(printDiv);
});
function printOderDetails() {
  //Get the print button and put it into a variable
  setTimeout(() => {
    const printBtn = document.getElementById("printBtn");
    //Set the button visibility to 'hidden'
    printBtn.style.visibility = "hidden";
    //Print the page content
    window.print();

    //Restore button visibility

    printBtn.style.visibility = "visible";
  }, 250);
}
{
  /* <div class="col-md-3">
    <div class="d-flex justify-content-end">
      <button
        class=" btn btn-primary"
        id="print_order_details_btn"
        onclick="printOderDetails()"
      >
        <i class="fa fa-print" aria-hidden="true"></i>
      </button>
    </div>
  </div>; */
}
