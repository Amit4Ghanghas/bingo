const express = require('express');
const app = express();
var bodyParser = require('body-parser');



// Importing routes
const gameRoutes = require('./src/app/controllers/gameController');
const ticketRoutes = require('./src/app/controllers/ticketController');



app.use(express.static('public'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


// Calling routes
app.use('/api/game', gameRoutes);
app.use('/api/game', ticketRoutes);
app.use('/ticket', ticketRoutes);






module.exports = app;


