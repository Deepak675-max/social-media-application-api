const express = require("express");

const userRouter = express.Router();

const authMiddleWare = require('../middlewares/auth.middlewares');

const userController = require('../controllers/user.controller');

userRouter.post('/profile', authMiddleWare.verifyAccessToken, userController.createUserProfile);

userRouter.get('/:userId/profile', authMiddleWare.verifyAccessToken, userController.getUserProfile);

userRouter.get('/', authMiddleWare.verifyAccessToken, userController.getUsers);

userRouter.put('/profile', authMiddleWare.verifyAccessToken, userController.updateUserProfile);

module.exports = userRouter;