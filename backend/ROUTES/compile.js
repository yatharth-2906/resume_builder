const express = require('express');
const { handleCompilation } = require('../CONTROLLERS/compile');

const compileRouter = express.Router();

compileRouter.route('/')
.post(handleCompilation);

module.exports = compileRouter;