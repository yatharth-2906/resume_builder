const express = require('express');
const { handleGetFile, handleGetResume, handleGetResumeFile } = require('../CONTROLLERS/file');

const fileRouter = express.Router();

fileRouter.route('/')
.post(handleGetFile);

fileRouter.route('/resume')
.post(handleGetResumeFile);

fileRouter.route('/resumeurl')
.post(handleGetResume);

module.exports = fileRouter;