const express = require("express");
const bodyParser = require('body-parser')

//Load environment variables
require('dotenv').config()



//Import the mongoose module
const mongoose = require ("mongoose");
mongoose.set('strictQuery', false)

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/series";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error"));

//create webserver
const app = express();

//const seriesRoutes = require("./routers/seriesRoutes")

//use bodyparser middleware to parse x-form-www-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//use boyParser middleware to parse json data
app.use(bodyParser.json({type: 'application/json'}))

//req.body. {object met params}

//create endpoint and connect to notes router
app.use("/series/", require('./routers/seriesRoutes'))


app.use(bodyParser.json());


// const seriesRouter = require("./routers/seriesRoutes");

//create route
app.use("/series/", require ("./routers/seriesRoutes"));

//start webserver on port 8000
app.listen(8000, () => {
    console.log("server running");
})