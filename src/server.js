'use strict';

const express = require('express');
const { filter_by_datetime } = require('./filter/datetime');
const { filter_by_price } = require('./filter/price');
const { search_by_restaurant_name } = require('./search/restaurant_name');
const { search_by_dish_name } = require('./search/dish_name');
const { order } = require('./order/order');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// List all restaurants that are open at a certain datetime
app.post('/filter/datetime', filter_by_datetime);

// List top y restaurants that have more or less than x number of dishes within a price range
app.post('/filter/price', filter_by_price);

// Search for restaurants by name, ranked by relevance to search term
app.post('/search/restaurant', search_by_restaurant_name);

// Search for dishes by name, ranked by relevance to search term
app.post('/search/dish', search_by_dish_name);

// Process a user purchasing a dish from a restaurant
app.post('/order', order);



app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});