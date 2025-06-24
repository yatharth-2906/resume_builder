const express = require('express');
const { handleGetFile } = require('../CONTROLLERS/file');

const fileRouter = express.Router();

fileRouter.route('/')
.post(handleGetFile);

module.exports = fileRouter;