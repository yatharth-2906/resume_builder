const express = require('express');
const { handleHomeGet, handleHealth } = require('../CONTROLLERS/home');

const homeRouter = express.Router();

homeRouter.route('/')
.get(handleHomeGet);

homeRouter.route('/health')
.get(handleHealth);

module.exports = homeRouter;