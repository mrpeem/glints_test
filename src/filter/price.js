const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('src/database/data.db');
const { checkSqlError } = require('../helpers/check_sql_error');

// List top y restaurants that have more or less than x number of dishes
// within a price range
const filter_by_price = (req, res) => {
  const top = req.body.top;
  const moreOrLess = (req.body.moreOrLess == "more")? ">=" : "<=";
  const numDishes = req.body.numDishes;
  const min = req.body.min;
  const max = req.body.max;

  // group dishes into one column that associates with restaurant name
  const query = `
    SELECT restaurantName, 
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'dishName', dishName,
          'price', price
        )
      ) AS menu, 
      COUNT(*) AS count
    FROM dishes 
    WHERE price >= ? and price <= ?
    GROUP BY restaurantName
    HAVING COUNT(*) ` + moreOrLess + ` ?
    LIMIT ?`;

  db.all(query, [min, max, numDishes, top], (err, rows) => {
    checkSqlError(err, res);

    // returns just the restaurant name
    const restaurants = rows.map(x => x.restaurantName);
    res.status(200).json( {
      numRestaurants: restaurants.length,
      restaurants
    } );
  })

}

module.exports = {filter_by_price};