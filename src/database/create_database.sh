#!/bin/bash

echo "loading restaurants data..."
node create_restaurants_database.js

echo "loading users data..."
node create_users_database.js