const express = require('express');
const { handleHomeGet } = require('../CONTROLLERS/home');

const homeRouter = express.Router();

homeRouter.route('/')
.get(handleHomeGet);

module.exports = homeRouter;