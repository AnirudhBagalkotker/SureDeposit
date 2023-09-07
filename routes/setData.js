const express = require('express');
const dataController = require('../controllers/setData');

const app = express.Router();

//routes
app.post('/deposit', dataController.deposit);
app.post('/withdraw', dataController.withdraw);
app.post('/reinvest', dataController.reinvest);
app.post('/profile', dataController.profile);
app.post('/bank', dataController.bank);
app.post('/aadhar', dataController.aadhar);
app.post('/ticket', dataController.ticket);
app.post('/rewards', dataController.rewards);

module.exports = app;