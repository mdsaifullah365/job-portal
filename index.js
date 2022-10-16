const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors');

const app = require('./app');

// DB Connect
mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log('Database connected'.blue.bold);
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.white.bold);
});
