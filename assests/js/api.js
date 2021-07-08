const fetch = require('node-fetch');
const FormData = require('form-data');

const form = new FormData();
form.append("android", 123);

fetch('https://soft14.bdtask.com/bhojonapp/app/categorylist',
    {
        method: 'POST',
        body: form

    })

    .then((response) => response.json())


    .then((data) => {
        data.data.categoryfo.map(({ CategoryID, Name, CategoryImage, parentid, CategoryIsActive, DateInserted, DateLocked, DateUpdated, Position, UserIDInserted, UserIDLocked, UserIDUpdated, isoffer, offerendate, offerstartdate }) => {
            insertingFoodCategory(CategoryID, Name, CategoryImage, parentid, CategoryIsActive, DateInserted, DateLocked, DateUpdated, Position, UserIDInserted, UserIDLocked, UserIDUpdated, isoffer, offerendate, offerstartdate)
        })
    })
    .catch((response) => { console.log(response) })



function insertingFoodCategory(CategoryID, Name, CategoryImage, parentid, CategoryIsActive, DateInserted, DateLocked, DateUpdated, Position, UserIDInserted, UserIDLocked, UserIDUpdated, isoffer, offerendate, offerstartdate) {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database("./database.sqlite")

    

    db.run(INSERT INTO CategoryList (CategoryID, Name, CategoryImage, parentid, CategoryIsActive, DateInserted, DateLocked, DateUpdated, Position, UserIDInserted, UserIDLocked, UserIDUpdated, isoffer, offerendate, offerstartdate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?), [CategoryID, Name, CategoryImage, parentid, CategoryIsActive, DateInserted, DateLocked, DateUpdated, Position, UserIDInserted, UserIDLocked, UserIDUpdated, isoffer, offerendate, offerstartdate], function (err){
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`)
    })
    db.close()
}