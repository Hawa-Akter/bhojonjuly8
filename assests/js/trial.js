console.log(counter("00011"));
function counter(val) {
  let len = val.length;
  let saleInvoice;
  if (len == 1) {
    saleInvoice = "000" + val;
    // return "000" + val
  } else if (len == 2) {
    saleInvoice = "00" + val;
    // return "00" + val
  } else if (len == 3) {
    saleInvoice = "0" + val;
    // return "0" + val
  } else {
    saleInvoice = val;
  }
  return saleInvoice;
}

