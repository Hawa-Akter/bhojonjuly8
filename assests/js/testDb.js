function insertionPosOrder(
    customerId,
    waiterId,
    tableNo,
    cookingTime,
    orderDate,
    orderTime,
    totalAmount,
    orderDetails
  ) {
    const db = new sqlite3.Database("./database.sqlite");
    db.all(`SELECT PosOrder.saleinvoice FROM PosOrder`, [], (err, rows) => {
     
      if (err) {
        throw err;
      } else {
        if (rows.length === 0) {
          db.run(
            `INSERT INTO PosOrder (saleinvoice, customer_id, customer_type,isthirdparty, waiter_id, kitchen, order_date, order_time, table_no,tokenno,totalamount,customer_note,order_status,cookingtime,order_details) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              "0001",
              1,
              customerId,
              0,
              waiterId,
              0,
              orderDate,
              orderTime,
              tableNo,
              "01",
              totalAmount,
              "",
              2,
              cookingTime,
              orderDetails,
            ],
            function (err) {
              if (err) {
                return console.log("Error message", err.message);
              }
              console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
          );
        } else {
          db.all(
            `SELECT PosOrder.saleinvoice,PosOrder.tokenno,PosOrder.order_date from PosOrder ORDER BY PosOrder.saleinvoice DESC LIMIT 1`,
            [],
            (err, rows) => {
              if (err) {
                throw err;
              } else {
                let newDate = new Date().toLocaleDateString("sv-SE");
                let lastDateFromDb = rows[0].order_date;
                if (newDate === lastDateFromDb) {
                  let lastInvoiceNo = rows[0].saleinvoice;
                  let lastTokenNo = rows[0].tokenno;
  
                  let lastTokenNoToInt = parseInt(lastTokenNo);
                  let lastInvoiceToInt = parseInt(lastInvoiceNo);
  
                  let convertInvoiceToStr = (lastInvoiceToInt + 1).toString();
                  let convertTokenToStr = (lastTokenNoToInt + 1).toString();
  
                  let invoice = counter(convertInvoiceToStr);
                  let tokenNo = tokenCounter(convertTokenToStr);
                  db.run(
                    `INSERT INTO PosOrder (saleinvoice, customer_id, customer_type,isthirdparty, waiter_id, kitchen, order_date, order_time, table_no,tokenno,totalamount,customer_note,order_status,cookingtime,order_details) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      invoice,
                      1,
                      customerId,
                      0,
                      waiterId,
                      0,
                      orderDate,
                      orderTime,
                      tableNo,
                      tokenNo,
                      totalAmount,
                      "",
                      2,
                      cookingTime,
                      orderDetails,
                    ],
                    function (err) {
                      if (err) {
                        return console.log("Error message", err.message);
                      }
                      console.log(
                        `A row has been inserted with rowid ${this.lastID}`
                      );
                    }
                  );
                } else {
                  db.all(
                    `SELECT PosOrder.saleinvoice from PosOrder ORDER BY PosOrder.saleinvoice DESC LIMIT 1`,
                    [],
                    (err, rows) => {
                      if (err) {
                        throw err;
                      } else {
                        if(rows.length !== 0){
                          let lastInvoiceNo = rows[0].saleinvoice;
                          let lastDigit = parseInt(lastInvoiceNo);
                          let convertToStr = (lastDigit + 1).toString();
                          let saleInvoice = counter(convertToStr);
                          db.run(
                            `INSERT INTO PosOrder (saleinvoice, customer_id, customer_type,isthirdparty, waiter_id, kitchen, order_date, order_time, table_no,tokenno,totalamount,customer_note,order_status,cookingtime,order_details) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                              saleInvoice,
                              1,
                              customerId,
                              0,
                              waiterId,
                              0,
                              orderDate,
                              orderTime,
                              tableNo,
                              "01",
                              totalAmount,
                              "",
                              2,
                              cookingTime,
                              orderDetails,
                            ],
                            function (err) {
                              if (err) {
                                return console.log("Error message", err.message);
                              }
                              console.log(
                                `A row has been inserted with rowid ${this.lastID}`
                              );
                            }
                          );
                        }
  
                 
                }
              }
            }
        });
        }
      }
    });
  
    db.close();
  }