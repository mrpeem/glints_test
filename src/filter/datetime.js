const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('src/database/data.db');
const { checkRestaurantOpen } = require('../helpers/time_helper')
const { checkSqlError } = require('../helpers/check_sql_error');


const filter_by_datetime = (req, res) => {
  db.all("SELECT * FROM restaurants", (err, restaurants) => {
    checkSqlError(err, res);

    // use checkRestaurantOpen to filter out get only restaurants that are open
    // then use map to only return restaurant name
    const filteredList = restaurants
      .filter(restaurant => checkRestaurantOpen(restaurant.openingHours, req.body.datetime)) 
      .map(restaurant => {
        return {restaurantName: restaurant.restaurantName, openingHours: restaurant.openingHours}
      });

      res.status(200).json({
        numRestaurantsOpen: filteredList.length,
        restaurants: filteredList
      });
  });
}

module.exports = {filter_by_datetime};