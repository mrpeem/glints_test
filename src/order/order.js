const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('src/database/data.db');
const { checkRestaurantOpen, datetimeCustom, datetimeCurrent } = require('../helpers/time_helper');
const { checkSqlError } = require('../helpers/check_sql_error');

// Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction
const order = (req, res) => {
  const dishName = req.body.dishName;
  const restaurantName = req.body.restaurantName;
  const id = req.body.id;
  const date = req.body.transactionDate;

  // check if inputted data is correct (whether restaurant serves that dish)
  const checkInputQuery = `
    SELECT *
    FROM restaurants
    INNER JOIN dishes ON dishes.restaurantName=restaurants.restaurantName
    WHERE dishes.dishName=? AND dishes.restaurantName=?`
  db.all(checkInputQuery, [dishName, restaurantName], (err, rows) => {
    checkSqlError(err, res);

    if (rows.length == 0) {
      res.status(400).json({message: "Restaurant '"+restaurantName+"' does not serve '"+dishName+"'"});
    }
    else {
      // check if restaurant is open at time of ordering
      const datetime = (date)? datetimeCustom(date) : datetimeCurrent();
      const open = checkRestaurantOpen(rows[0].openingHours, datetime.openingHoursFormat);
      
      if (open) { // restaurant is open
        // check if user has enough money to place order
        db.all(`SELECT * FROM users WHERE id=?`, [id], (err, users) => {
          checkSqlError(err, res);

          if(users[0].cashBalance < rows[0].price) {
            res.status(400).json({message: "Insufficinet funds"});
          }
          else {
            processOrder(rows[0].price, datetime, req, res);
          }
        })
      }
      else { // restaurant is not open
        res.status(400).json({message: "Restaurant is not open at this time"});
      }
    } 
  });
}

const processOrder = (price, datetime, req, res) => {
  const dishName = req.body.dishName;
  const restaurantName = req.body.restaurantName;
  const id = req.body.id;
  const date = req.body.transactionDate;

  // update user's cash balance after making purchase
  const updateCashBalanceQuery = `
    UPDATE users SET cashBalance=cashBalance-? WHERE id=?; SELECT * FROM users WHERE id=?`
  db.all(updateCashBalanceQuery, [price, id], (err, rows) => {
    checkSqlError(err, res);

    // creates new history associated with the user
    const createHistoryQuery = `
      INSERT INTO history
      (dishName, restaurantName, transactionAmount, transactionDate, userId)
      VALUES (?, ?, ?, ?, ?)
    `;
    const data = [dishName, restaurantName, price, datetime.transactionDate, id];

    db.all(createHistoryQuery, data, (err, row) => {
      checkSqlError(err, res);
      
      // get order summary of the order
      orderSummary(id, res);
    });
  });

}

const orderSummary = (id, res) => {
  // get information about the user who made the order
  db.all(`SELECT * FROM users WHERE id=?`, id, (err, user) => {
    checkSqlError(err, res);

    // get last transaction made by the user (order receipt)
    const lastTransactionHistoryQuery = `
      SELECT dishName, restaurantName, transactionAmount, transactionDate
      FROM history 
      WHERE userId=? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    db.all(lastTransactionHistoryQuery, id, (err, history) => {
      checkSqlError(err, res);

      res.status(200).json({
        "message": "Order success",
        "user": user[0],
        "recepit": history[0]       
      });
    });
  });
}

module.exports = {order};