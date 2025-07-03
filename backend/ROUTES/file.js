const express = require('express');
const { handleGetFile, handleGetResumeFile } = require('../CONTROLLERS/file');

const fileRouter = express.Router();

fileRouter.route('/')
.post(handleGetFile);

fileRouter.route('/resume')
.post(handleGetResumeFile);

module.exports = fileRouter;