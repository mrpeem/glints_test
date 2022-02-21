// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');
const request = require('request');
const time_helper = require('../helpers/time_helper')


db.serialize(() => {
  
  // create database table for restaurants
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurantName TEXT NOT NULL,
      cashBalance DECIMAL(10,2),
      openingHours TEXT,
      hoursMon TEXT,
      hoursTues TEXT,
      hoursWeds TEXT,
      hoursThurs TEXT,
      hoursFri TEXT,
      hoursSat TEXT,
      hoursSun TEXT
    );`
  );

  // create database table for dishes
  db.run(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dishName TEXT NOT NULL,
      price DECIMAL (10,2),
      restaurantName TEXT,
      restaurantId INTEGER,
      FOREIGN KEY(restaurantName) REFERENCES restaurants(restaurantName),
      FOREIGN KEY(restaurantId) REFERENCES restaurants(id)
    );`
  );


  // // test: insert test restaurants
  // db.run(`
  //   INSERT OR IGNORE INTO restaurants (restaurantName, cashBalance, openingHours) VALUES
  //     ('restaurant1', 1.11, "hours"),('restaurant2', 22222222.22, "hours"),('restaurant3', 3.33, "hours"),
  //     ('restaurant4', 4.44, "hours"),('restaurant5', 5.55, "hours"),('restaurant6', 6.66, "hours");
  // `);

  // // test: insert test dishes
  // db.run(`
  //   INSERT OR IGNORE INTO dishes (dishName, restaurantName, price) VALUES
  //     ('dish1', 'restaurant1', 1.11),('dish2', 'restaurant1', 2.22), ('dish1', 'restaurant2', 3.33);
  // `);


  // fetch data 
  const url = "https://gist.githubusercontent.com/seahyc/b9ebbe264f8633a1bf167cc6a90d4b57/raw/021d2e0d2c56217bad524119d1c31419b2938505/restaurant_with_menu.json";
  request(url, {json:true}, function (error, response, body) {
    
    body.forEach(restaurant => {

      let parseHours = async () => {
        return await Promise.resolve(time_helper.parseOpeningHours(restaurant.openingHours));
      }
      parseHours().then(openingHours => {
        const mon =(!openingHours[0].length)? "" : openingHours[0][0] + "|" + openingHours[0][1];
        const tue = (!openingHours[1].length)? "" : openingHours[1][0] + "|" + openingHours[1][1];
        const wed = (!openingHours[2].length)? "" : openingHours[2][0] + "|" + openingHours[2][1];
        const thu = (!openingHours[3].length)? "" : openingHours[3][0] + "|" + openingHours[3][1];
        const fri = (!openingHours[4].length)? "" : openingHours[4][0] + "|" + openingHours[4][1];
        const sat = (!openingHours[5].length)? "" : openingHours[5][0] + "|" + openingHours[5][1];
        const sun = (!openingHours[6].length)? "" : openingHours[6][0] + "|" + openingHours[6][1];

        
        // insert restaurant data into database
        const restaurantQuery = `
          INSERT INTO restaurants (
            restaurantName, cashBalance, openingHours,
            hoursMon, hoursTues, hoursWeds, hoursThurs,
            hoursFri, hoursSat, hoursSun
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run( 
          restaurantQuery, [
            restaurant.restaurantName, 
            restaurant.cashBalance,
            restaurant.openingHours,
            mon, tue, wed, thu, fri, sat, sun
          ], (err, rows) => {

            // db.all("SELECT id FROM restaurants WHERE restaurantName=?", restaurant.restaurantName, (err, id) => {
            //   console.log(id);

            //   restaurant.menu.forEach(dish => {
            //     db.run( dishQuery, [dish.dishName, restaurant.restaurantName, id[0].id, dish.price] );
            //   })
            // });
        });

        // insert dish data into database
        const dishQuery = `
          INSERT INTO dishes (dishName, restaurantName, price) 
          VALUES (?, ?, ?)`;

        restaurant.menu.forEach(dish => {
          db.run( dishQuery, [dish.dishName, restaurant.restaurantName, dish.price] );
        })

        
        
      })


      
      
    });
    
    


  });  
});

module.exports = this;
