const express = require('express');
const app = express();
const cors = require('cors');

//middlewares
app.use(express.json());
app.use(cors());

//routes

module.exports = app;
