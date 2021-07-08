const { ipcRenderer } = require("electron");
const printPageDiv = document.getElementById("printToken");
const closeBtn = document.getElementById("close_btn");
var today = new Date();

function hidePrintToken() {
  printPageDiv.style.visibility = "hidden";
}

ipcRenderer.on("placedOrderItemsForToken", (e, result) => {
  console.log("result", result);

  result.map((item) => {
    let date = document.createElement("h6");
    date.textContent =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let tokenDiv = document.createElement("div");
    tokenDiv.className = "text-center";

    let tokenHeading = document.createElement("h4");
    tokenHeading.textContent = "Token No:" + item.tkenItems[0].tokenNo;

    let customerNameHeading = document.createElement("h6");
    customerNameHeading.textContent = "Walkin";
    tokenDiv.append(tokenHeading, customerNameHeading);

    let tokenTable = document.createElement("table");
    tokenTable.className = "table table-sm table-borderless";

    let tableHead = document.createElement("thead");
    let th1 = document.createElement("th");
    th1.textContent = "Q";

    let th2 = document.createElement("th");
    th2.textContent = "Item";

    let th3 = document.createElement("th");
    th3.textContent = "Size";

    tableHead.append(th1, th2, th3);

    let tableBody = document.createElement("tbody");
    item.tokenItems.forEach((element) => {
      let tableTr = document.createElement("tr");

      let itemQty = document.createElement("td");
      itemQty.textContent = element.itemQty;

      let itemName = document.createElement("td");
      itemName.textContent = element.itemName;

      let size = document.createElement("td");
      size.textContent = element.size;
      tableTr.append(itemQty, itemName, size);
      let addonTr = document.createElement("tr");
      let addonQty = document.createElement("td");
      addonQty.textContent = element.addonQty;

      let empty = document.createElement("td");
      empty.textContent = "";

      let addOnName = document.createElement("td");
      addOnName.textContent = element.addOnName;

      addonTr.append(addOnName, empty, addonQty);
      tableBody.append(tableTr, addonTr);
    });

    tokenTable.append(tableHead, tableBody);

    let invoiceDiv = document.createElement("div");
    invoiceDiv.className = "text-center";
    invoiceDiv.textContent = "|Order NO.:" + item.tkenItems[0].invoice;

    printPageDiv.append(date, tokenDiv, tokenTable, invoiceDiv);
  });

  //   <h3>Token No: ${item.tkenItems[0].tokenNo} </h3>
  //   <h3>Cusomer type</h3>
  // </div>

  // <table class="table table-sm table-borderless">
  //   <thead>
  //     <tr>
  //       <th>Q</th>
  //       <th>Item</th>
  //       <th>Size</th>
  //     </tr>
  //   </thead>
  //   <tbody id="tbletr">`;

  //   var items = "<tr>";
  //   item.tokenItems.forEach((element) => {
  //     console.log("Inside tr", element.itemName);
  //     items += `<td>${element.itemQty}</td>
  //   <td>${element.itemName}</td>
  //   <td>${element.size}</td>`;
  //   });
  //   items += "</tr>";
  //   document.getElementById("tbletr").innerHTML = items`</tbody>
  // </table>
  // <div class="text-center">|Order NO.: ${item.tkenItems[0].invoice}</div>`;
  // });
  // printPageDiv.innerHTML = printingToken;
});

function printPage() {
  //Get the print button and put it into a variable
  const printTokenDiv = document.getElementById("printToken");
  const closeBtn = document.getElementById("close_btn");
  const printButton = document.getElementById("print_token_btn");
  const orderLabel = document.getElementById("order_label");

  //Set the button visibility to 'hidden'
  printButton.style.visibility = "hidden";
  closeBtn.style.visibility = "hidden";
  orderLabel.style.visibility = "hidden";
  printTokenDiv.style.visibility = "visible";
  //Print the page content
  window.print();

  //Restore button visibility
  printButton.style.visibility = "visible";
  closeBtn.style.visibility = "visible";
  orderLabel.style.visibility = "visible";
  printTokenDiv.style.visibility = "hidden";
}
//close the current window
closeBtn.addEventListener("click", () => {
  window.close();
});
