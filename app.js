const express = require('express');
const app = express();
const cors = require('cors');

//middlewares
app.use(express.json());
app.use(cors());

//routes
const userRoute = require('./routes/v1/user.route');
const jobRoute = require('./routes/v1/job.route');

app.use('/api/v1/user', userRoute);
app.use('/api/v1', jobRoute);

module.exports = app;
