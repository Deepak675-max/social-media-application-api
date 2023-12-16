const express = require("express");

const authRouter = express.Router();

const authMiddleWare = require('../middlewares/auth.middlewares');

const authController = require('../controllers/auth.controller');

authRouter.post('/signup', authController.signupUser);

authRouter.post('/login', authController.loginUser);

authRouter.post('/logout', authMiddleWare.verifyAccessToken, authController.logoutUser);




module.exports = authRouter;