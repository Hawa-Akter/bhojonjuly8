const { ipcRenderer } = require("electron");

const thirdPartyTable = document.getElementById("third_party_customer_table");
const customerTypeTable = document.getElementById("customer_type_table");

function customer(event, cmr) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cmr).style.display = "block";
  event.currentTarget.className += " active";
}

// third party customer
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("thirdPartyCustomer");
});
ipcRenderer.on("thirdPartyCustomerResultSent", (evt, thirdPartyCustomers) => {
  thirdPartyCustomers.map(function (customer, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var companyName = document.createElement("td");
    companyName.textContent = customer.company_name;

    var comission = document.createElement("td");
    comission.textContent = customer.commision;

    var address = document.createElement("td");
    address.textContent = customer.address;

    tr.append(si, companyName, comission, address);
    thirdPartyTable.appendChild(tr);
  });
  thirdPartyTable.style.fontSize = "12px";
});

// customer type tab
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("CustomerType");
});
ipcRenderer.on("customerTypeResultSent", (evt, customerTypes) => {
  customerTypes.map(function (ct, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var typeName = document.createElement("td");
    typeName.textContent = ct.customer_type;

    tr.append(si, typeName);
    customerTypeTable.appendChild(tr);
  });
  customerTypeTable.style.fontSize = "12px";
});
