const express = require('express');
const { handleUserLogin, handleUserSignup, verifyUserLogin } = require('../CONTROLLERS/auth');

const authRouter = express.Router();

authRouter.route('/login')
.post(handleUserLogin);

authRouter.route('/signup')
.post(handleUserSignup);

authRouter.route('/verifylogin')
.post(verifyUserLogin);

module.exports = authRouter;