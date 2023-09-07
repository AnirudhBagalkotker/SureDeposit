const express = require('express');
const dataController = require('../controllers/getData');

const app = express.Router();

//routes
app.get('/profile', dataController.profile);
app.get('/bank', dataController.bank);
app.get('/summary', dataController.summary);
app.get('/help', dataController.help);
app.get('/rewards', dataController.rewards);
app.get('/referral', dataController.referral);


module.exports = app;