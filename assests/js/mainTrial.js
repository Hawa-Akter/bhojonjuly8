const { ipcMain, BrowserWindow, app, Menu } = require("electron");
const path = require("path");
const url = require("url");

//database connection
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let mainWin;
function createMainWindow() {
  mainWin = new BrowserWindow({
    resizable: true,
    title: "Login - Dhaka Restaurant",
    minimizable: true,
    fullscreenable: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWin.loadFile("assests/html/index.html");
  mainWin.maximize();
  mainWin.setMenuBarVisibility(false);
}

function createChildWindow() {
  childWindow = new BrowserWindow({
    width: 820,
    height: 400,
    modal: true,
    show: false,
    parent: mainWin, // Make sure to add parent window here

    // Make sure to add webPreferences with below configuration
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Child window loads settings.html file
  childWindow.loadFile("assests/html/cart.html");
  childWindow.setMenuBarVisibility(false);
  childWindow.webContents.openDevTools();

  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

//Getting selected food items
ipcMain.on("FoodIdSent", (evt, result) => {
  var fId = result;
  const food = displayingCartItems(fId);
  console.log(food);

  //createChildWindow();
});

async function displayingCartItems(foodId) {
  const db = new sqlite3.Database("./database.sqlite");
  let foods = [];
  const cartItems = `SELECT DISTINCT foods.product_name, varient.name, varient.price, add_on.add_on_name, add_on.price FROM foods, varient, add_on, add_on_assign
  WHERE foods.id = varient.food_id
  AND add_on_assign.add_on_id= add_on.id
  AND foods.id = ? `;

  var r = await db.all(cartItems, [foodId], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows) foods.push(rows);
    console.log("clickedFood", foods);
    //childWindow.webContents.send("foodsIncartSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  return foods;
}

//Login page start here
ipcMain.on("authenticated", (event, result) => {
  var data = result;
  var userEmail = data.email;
  var password = data.password;
  validateUser(userEmail, password);
});

function validateUser(userEmail, pass) {
  const db = new sqlite3.Database("./database.sqlite");
  const users = `SELECT email, password FROM user WHERE  email=? AND password=?`;
  db.all(users, [userEmail, pass], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.email == userEmail && row.password == pass) {
        mainWin.setMenuBarVisibility(true);
        mainWin.webContents.openDevTools();
        return mainWin.loadURL(`file://${__dirname}/assests/html/pos.html`);
      }
    });
    var incorrect = "Password or email is incorrect";
    mainWin.webContents.send("unauthenticatedReply", incorrect);
  });
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
// end of login page

//start of POS page

ipcMain.on("categoryNamesLoaded", () => {
  gettingCategoryByNames();
});

function gettingCategoryByNames() {
  const db = new sqlite3.Database("./database.sqlite");
  const categories = `SELECT * FROM food_category`;
  db.all(categories, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("categoryNamesReplySent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

ipcMain.on("categoryId", (evt, result) => {
  var categoryId = result;
  gettingfoodByCategory(categoryId);
});

function gettingfoodByCategory(cId) {
  const db = new sqlite3.Database("./database.sqlite");

  const foodsByCategory = `SELECT * FROM foods, food_category
	WHERE foods.category_id= food_category.id
  AND food_category.id = ?`;

  db.all(foodsByCategory, [cId], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodsByCategoryReplySent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

ipcMain.on("foodByALlCategory", () => {
  gettingFoodByAllCategory();
});
function gettingFoodByAllCategory() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodsByCategory = `SELECT * FROM foods`;

  db.all(foodsByCategory, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodsByAllCategoryReplySent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

ipcMain.on("foodOnPageLoaded", () => {
  gettingFoodOnPageLoad();
});
function gettingFoodOnPageLoad() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodsOnPageLoad = `SELECT * FROM foods`;

  db.all(foodsOnPageLoad, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodOnPageLoadedReplySent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//POS page end here

//food page start here
//foods
ipcMain.on("foodListLoaded", () => {
  gettingFoodList();
});
function gettingFoodList() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodList = `SELECT foods.id, food_category.name, foods.product_image,foods.product_name, foods.component, foods.product_vat, foods.products_is_active  FROM foods, food_category
	WHERE foods.category_id = food_category.id`;

  db.all(foodList, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodsResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//food varient
ipcMain.on("FoodVarient", () => {
  gettingFoodVarientList();
});
function gettingFoodVarientList() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodVarientList = `SELECT foods.id,varient.name, foods.product_name FROM varient, foods
	WHERE varient.food_id = foods.id`;

  db.all(foodVarientList, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodVarientResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//food availability
ipcMain.on("FoodAvailability", () => {
  gettingFoodAvailabilityList();
});
function gettingFoodAvailabilityList() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodAvailabilityList = `SELECT foods.id, foods.product_name, food_availability.avail_day, food_availability.avail_time 
  FROM foods, food_availability
	WHERE food_availability.food_id = foods.id`;

  db.all(foodAvailabilityList, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodAvailabilityResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
//end of food page

//start of food addson page
ipcMain.on("foodAddOns", () => {
  gettingFoodAddOns();
});
function gettingFoodAddOns() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodAddOns = `SELECT * FROM add_on`;

  db.all(foodAddOns, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodAddOnsResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
//food addson assign
ipcMain.on("foodAddOnsAssign", () => {
  gettingFoodAddOnsAssign();
});
function gettingFoodAddOnsAssign() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodAddOnsAssign = `SELECT  DISTINCT add_on.add_on_name,foods.product_name 
  FROM add_on,add_on_assign, foods
	WHERE  add_on_assign.food_id = foods.id
	AND add_on.id = add_on_assign.add_on_id`;

  db.all(foodAddOnsAssign, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodAddOnsAsssignResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
//end of food addson page

// food category page
ipcMain.on("foodCategory", () => {
  gettingFoodCategoryI();
});
function gettingFoodCategoryI() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodAddOnsAssign = `SELECT food_category.name, food_category.category_image, food_category.parent_menu,food_category.is_offer 
  FROM food_category`;

  db.all(foodAddOnsAssign, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodCategoryresultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
//food table page
ipcMain.on("foodCategory", () => {
  gettingFoodTable();
});
function gettingFoodTable() {
  const db = new sqlite3.Database("./database.sqlite");

  const foodTable = `SELECT food_tables.table_name, food_tables.person_capacity, food_tables.table_icon
  	FROM food_tables`;

  db.all(foodTable, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("foodTableResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

// Customer type page
//third party customer

ipcMain.on("thirdPartyCustomer", () => {
  gettingThirdPartyCustomer();
});
function gettingThirdPartyCustomer() {
  const db = new sqlite3.Database("./database.sqlite");

  const thirdPartyCustomer = `	SELECT  third_party_customer.company_name, third_party_customer.comission, third_party_customer.address 
  FROM third_party_customer`;

  db.all(thirdPartyCustomer, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("thirdPartyCustomerResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}
//customer type
ipcMain.on("CustomerType", () => {
  gettingCustomerTypeData();
});
function gettingCustomerTypeData() {
  const db = new sqlite3.Database("./database.sqlite");

  const thirdPartyCustomerTable = `SELECT customer_type.type_name FROM customer_type`;

  db.all(thirdPartyCustomerTable, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("customerTypeResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//Payment page
ipcMain.on("PaymentMethod", () => {
  gettingPaymentMethodData();
});
function gettingPaymentMethodData() {
  const db = new sqlite3.Database("./database.sqlite");

  const paymentMethod = `SELECT payment_method.payment_method_type, payment_method.status FROM payment_method`;

  db.all(paymentMethod, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("paymentMethodResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//card terminal page
ipcMain.on("cardTerminal", () => {
  gettingCardTerminalData();
});
function gettingCardTerminalData() {
  const db = new sqlite3.Database("./database.sqlite");

  const paymentMethod = `SELECT card_terminal.terminal_name FROM card_terminal`;

  db.all(paymentMethod, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("cardTerminalResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//bank page
ipcMain.on("bank", () => {
  gettingBankData();
});
function gettingBankData() {
  const db = new sqlite3.Database("./database.sqlite");

  const bankData = `SELECT bank_name FROM bank`;

  db.all(bankData, [], (err, rows) => {
    if (err) {
      throw err;
    }
    mainWin.webContents.send("bankResultSent", rows);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

// start of menu
const menuTemplate = [
  //start of view menu
  {
    label: "View",
    submenu: [
      {
        label: "Foods...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/food.html`);
        },
      },

      {
        label: "Food Add-ons...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/food_addsOn.html`);
        },
      },

      {
        label: "Food Category...",
        click: () => {
          mainWin.loadURL(
            `file://${__dirname}/assests/html/food_category.html`
          );
        },
      },

      {
        label: "Tables...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/food_table.html`);
        },
      },

      {
        label: "Customer Type...",
        click: () => {
          mainWin.loadURL(
            `file://${__dirname}/assests/html/customer_type.html`
          );
        },
      },

      {
        label: "Payment...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/payment.html`);
        },
      },
      {
        label: "Trial...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/trial.html`);
        },
      },
    ],
  },

  //Start of manage order menu
  {
    label: "Manage Order",
    submenu: [
      {
        label: "Order...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/order.html`);
        },
      },
      {
        label: "POS...",
        click: () => {
          mainWin.loadURL(`file://${__dirname}/assests/html/pos.html`);
        },
      },
    ],
  },

  //Start of setting menu
  {
    label: "Setting",
    submenu: [
      {
        label: "Application Setting...",
        role: "Application Setting...",
      },
      {
        label: "Synchronization...",
        role: "Synchronization...",
      },
    ],
  },

  //Help
  {
    label: "Help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },

  //start of the development menu
  {
    label: "DevToolswithReload",
    submenu: [
      {
        label: "DEV tools",
        role: "toggleDevTools",
      },
      {
        label: "Reload",
        role: "reload",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
