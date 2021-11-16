const express = require("express");
const dotenv = require("dotenv");
const indexRoute = require("./routes/index");
const cors = require('cors');

//------------------------Pets WS Server------------------------------------------//
dotenv.config();
var app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Allowing get requests (access) from any unknown domains 
app.use(cors());

// setup route path
app.use('/api', indexRoute);

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`===== Server is running on port ${process.env.PORT}! =====`);
});

module.exports = app;
