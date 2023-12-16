const express = require("express");

const userPostRouter = express.Router();

const authMiddleWare = require('../middlewares/auth.middlewares');

const userPostController = require('../controllers/post.controller');

userPostRouter.post('/post', authMiddleWare.verifyAccessToken, userPostController.createUserPost);

userPostRouter.get('/:userId/posts', authMiddleWare.verifyAccessToken, userPostController.getUserPosts);

userPostRouter.put('/post', authMiddleWare.verifyAccessToken, userPostController.updateUserPost);

userPostRouter.delete('/post/:postId', authMiddleWare.verifyAccessToken, userPostController.deleteUserPost);

module.exports = userPostRouter;