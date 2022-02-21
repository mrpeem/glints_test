const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('src/database/data.db');
const stringSimilarity = require("string-similarity");
const { checkSqlError } = require('../helpers/check_sql_error');


//Search for restaurants by name, ranked by relevance to search term
const search_by_restaurant_name = (req, res) => {

  const query = `
    SELECT JSON_GROUP_ARRAY(restaurantName) AS restaurantNames
    FROM restaurants 
    WHERE LOWER(restaurantName) LIKE LOWER('%`+req.body.term+`%')
  `
  db.all(query, (err, rows) => {
    checkSqlError(err, res);

    const restaurants = JSON.parse(rows[0].restaurantNames);
    
    // found restaurants with names containing the search term
    if (restaurants.length > 0) {

      // sort output by relevance according to npm's string-similarity package
      const result = stringSimilarity.findBestMatch(req.body.term, restaurants);
      result.ratings.sort((a, b) => b.rating - a.rating);

      res.status(200).json( result.ratings.map(x => x.target) );
    }
    else { // no restaurants with names containing the search term
      res.status(200).json("No relevant restaurants found with that search term")
    }
  })
}

module.exports = {search_by_restaurant_name};