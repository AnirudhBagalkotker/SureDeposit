const express = require('express');
const authController = require('../controllers/auth');

const app = express.Router();

//routes
app.post('/signup1', authController.signup1);
// app.post('/signin', authController.signin);
app.get('/auth/signout', authController.signout);

module.exports = app;