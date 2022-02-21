# Buying Frenzy

You are building a backend service and a database for a food delivery platform, with the following 2 raw datasets:

1. **Restaurants data**

Link: https://gist.github.com/seahyc/b9ebbe264f8633a1bf167cc6a90d4b57

This dataset contains a list of restaurants with their menus and prices, as well as their cash balances. This cash balance is the amount of money the restaurants hold in their merchant accounts on this platform. It increases by the respective dish price whenever a user purchases a dish from them.

2. **Users data**

Link: https://gist.github.com/seahyc/de33162db680c3d595e955752178d57d

This dataset contains a list of users with their transaction history and cash balances. This cash balance is the amount of money the users hold in their wallets on this platform. It decreases by the dish price whenever they purchase a dish.

These are all raw data, which means that you are allowed to process and transform the data, before you load it into your database.

# The Task

The task is to build an **API server, with documentation and a backing relational database** that will allow a front-end client to navigate through that sea of data easily, and intuitively. The front-end team will later use that documentation to build the front-end clients. We'd much prefer you to use Node.js (Typescript is a bonus!), as that is what we use at Glints.

The operations the front-end team would need you to support are:

1. List all restaurants that are open at a certain datetime
2. List top y restaurants that have more or less than x number of dishes within a price range
3. Search for restaurants or dishes by name, ranked by relevance to search term
4. Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction

In your repository, you would need to **document the API interface**, the **commands to run the ETL** (extract, transform and load) script that takes in the raw data sets as input, and outputs to your database, and the **command to set up your server and database**. You may use docker to ensure a uniform setup across environments.

# Bonus
*This is optional, and serves as additional proof points. We will consider it complete even without this functionality*

Write appropriate tests with an appropriate coverage report.

# Deployment
It'd be great if you can deploy this on the free tier of any cloud hosting platform (eg. free dyno on Heroku), so that we can easily access the application via an url. 