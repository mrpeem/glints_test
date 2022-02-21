// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');
const request = require('request');


db.serialize(() => {
  
  // create database table for restaurants
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      cashBalance DECIMAL(10,2),
      id INTEGER PRIMARY KEY,
      name TEXT
    );`
  );

  // create database table for dishes
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dishName TEXT NOT NULL,
      restaurantName TEXT,
      transactionAmount DECIMAL (10,2),
      transactionDate TEXT,
      userId INTEGER,
      userName TEXT,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(userName) REFERENCES users(name)
    );`
  );


  // fetch data 
  const url = "https://gist.githubusercontent.com/seahyc/de33162db680c3d595e955752178d57d/raw/785007bc91c543f847b87d705499e86e16961379/users_with_purchase_history.json";
  request(url, {json:true}, function (error, response, body) {
    
    body.forEach(user => {

      // insert user data into database
      const userQuery = `
        INSERT INTO users (cashBalance, id, name) 
        VALUES (?, ?, ?)`;
      db.run( userQuery, [user.cashBalance, user.id, user.name] );

      // insert purchase history data into database
      const historyQuery = `
        INSERT INTO history (dishName, restaurantName, transactionAmount, transactionDate, userId, userName) 
        VALUES (?, ?, ?, ?, ?, ?)`;
      user.purchaseHistory.forEach(purchase => {
        db.run( historyQuery, [purchase.dishName, purchase.restaurantName, purchase.transactionAmount, purchase.transactionDate, user.id, user.name] );
      })
      
    });
    

    db.close();


  });  
});

