# glints_test

To run set up and run locally: 
1) Start by creating the database. From this directory, do the following commands <br>
  <code> $ cd src/database/ </code><br>
  <code> $ ./create_database.sh </code><br>
  To do a clean start, simply remove the db and create it again by doing: <br>
    <code> $ rm data.db; ./create_database.sh </code>
2) Once the script finishes running, go back to the main directory with <br>
  <code> $ cd ../.. </code> 
3) Run the server with <br>
  <code> $ npm start </code>
4) Server runs on port 3000 and can be accessed at <a href> localhost:3000 </a>

The program has 5 endpoints and they can be accessed with a POST request:
  1) /filter/datetime
  2) /filter/price
  3) /search/restaurant
  4) /search/dish
  5) /order
Tools like cURL or Postman can be used to access the backend API

Here is how to test each of the functionalities specified in the requirements: 
<br>
1) List all restaurants that are open at a certain datetime
    - use /filter/datetime
    - expected parameters: [datetime]
    - returns: { "numRestaurantsOpen": int, "restaurants": [ { "restaurantName": string, "openingHours": string } ... ]} <br>
      Where "numRestaurantsOpen" is a number specifying the amount of restaurants that are open and "restaurants" is an array of all restaurants that are open during the specified time
    - example cURL command: <br>
      <code>$ curl -X POST "http://localhost:3000/filter/datetime" -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{ "datetime": "Mon 5 am" }' </code>
    - Input must be in the format of &lt;day&gt;&lt;space&gt;&lt;12-hour time&gt;&lt;space&gt;&lt;am/pm designation&gt; <br>
      - Where the days are ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"]
      - The time can be formatted as either only hours or hours:mins. Ex. 12 or 12:05
      - Designation in lowercase
      - Ex. [Mon 5 pm], [Mon 5:55 pm], [Thurs 12 am]

<br><br>
2) List [top] y restaurants that have [more or less than] x [number of dishes] within a [price range]
  - use /filter/price
  - expected parameters: [top], [moreOrLess], [numDishes], [min], [max] where:
    - [top] = integer. the top y restaurants that matches the requirements
    - [moreOrLess] = string. Either "more" or "less"
    - [numDishes] = integer. Baseline number of dishes to return
    - [min] = integer. Lower end of price range
    - [max] = integer. Upper end of price range
  - returns: { "numRestaurants": int, "restaurants": [ string, ... ] <br>
      Where "numRestaurants" is a number specifying the amount of restaurants that meet the requirements and "restaurants" is an array of all restaurants returned by the query
  - example cURL command: <br>
    <code> $ curl -X POST "http://localhost:3000/filter/price" -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{ "top": 100, "moreOrLess": "more", "numDishes": 5, "min": 10.59, "max": 100}' </code>

<br><br>
3) Search for restaurants or dishes by name, ranked by relevance to search term
  - use /search/restaurant
  - expected parameters: [term] where: <br>
    - [term] = string. The term to search for.
  - returns a string array of restaurants with restaurants that contain the term as part of its substring. The result will be sorted by relevance using npm's <code>string-similarity</code> package, which uses Dice's Coefficient to determine similarity
  - example cURL command: <br>
    - <code>$ curl -X POST "http://localhost:3000/search/restaurant" -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{"term": "bird"}'</code>

<br><br>
4) Search for dishes by name, ranked by relevance to search term
  - use /search/dish
  - expected parameters: [term] where: <br>
    - [term] = string. The term to search for.
  - returns a string array of dishes with dishes that contain the term as part of its substring. The result will be sorted by relevance using npm's <code>string-similarity</code> package, which uses Dice's Coefficient to determine similarity
  - example cURL command: <br>
    - <code>$ curl -X POST "http://localhost:3000/search/dish" -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{"term": "bird"}'</code>

<br><br>
5) Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction
  - use /order
  - expected parameters: [dishName], [restaurantName], [id], [transactionDate (optional)] where: <br>
    - [dishName] = string. The name of the dish the user wishes to order.
    - [restaurantName] = string. The name of the restaurant the user wishes to order from
    - [id] = integer. The id of the user making the order
    - [transactionDate] = string. Optional argument. Specify the date to make the purchase. Makes it easier for testing purposes since some restaurants may not be open if using real time. The date will be in the format of &lt;month (0-filled)&gt;/&lt;date (0-filled)&gt;/&lt;year&gt;&lt;space&gt;&lt;12-hour time&gt;&lt;space&gt;&lt;am/pm designation&gt;. However, if this is not specified, then the current date and time from JS's Date class will be used
  - returns: { "message": string, "user": {}, "receipt": {} } where: <br>
    - [message] will specify whether the purchase was successful
    - [user] is an object that contains the information about the user and the updated cash balance
    - [receipt] is an object that contains the transaction history of the order
  - example cURL command: <br>
    - if manually specifying date: <code>$ curl -X POST "http://localhost:3000/order" -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{ "dishName": "Chocoladen Crem","restaurantName": "Sullivan'\''s Steakhouse - Leawood", "id": 13, "transactionDate": "02/21/2022 12 AM" }'</code>
    - not specifying date: <code>curl -X POST "http://localhost:3000/ype: application/json' -d '{ "dishName": "Boiled Fowl","restaurantName": "8th Street at the Ivy", "id": 25 }'</code>
  - possible error return values:
    - Message notifying that the restaurant is not open
    - Message notifying that the user's cash balance is inadequate to make the purchase
    - Message notifying that the restaurant does not serve that dish (incorrect dishName/restaurantName combination)
<br>