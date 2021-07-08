const { ipcRenderer } = require("electron");

const paymentTable = document.getElementById("payment_table");
const cardTerminalTable = document.getElementById("card_terminal_table");
const bankTable = document.getElementById("bank_table");

function paymentMenu(evt, paymnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(paymnt).style.display = "block";
  evt.currentTarget.className += " active";
}

//payment method
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("PaymentMethod");
});
ipcRenderer.on("paymentMethodResultSent", (evt, paymentMethods) => {
  paymentMethods.map(function (pm, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var methodName = document.createElement("td");
    methodName.textContent = pm.payment_method;

    var status = document.createElement("td");
    status.textContent = pm.is_active == 1 ? "Active" : "Inactive";

    tr.append(si, methodName, status);
    paymentTable.appendChild(tr);
  });
});

//card terminal
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("cardTerminal");
});
ipcRenderer.on("cardTerminalResultSent", (evt, terminals) => {
  terminals.map(function (terminal, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var terminalName = document.createElement("td");
    terminalName.textContent = terminal.terminal_name;

    tr.append(si, terminalName);
    cardTerminalTable.appendChild(tr);
  });
});

//bank
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("bank");
});
ipcRenderer.on("bankResultSent", (evt, banks) => {
  banks.map(function (bank, index) {
    var tr = document.createElement("tr");
    var si = document.createElement("td");
    si.textContent = index + 1;

    var bankName = document.createElement("td");
    bankName.textContent = bank.bank_name;

    tr.append(si, bankName);
    bankTable.appendChild(tr);
  });
});
