const express = require("express");

const commentRouter = express.Router();

const authMiddleWare = require('../middlewares/auth.middlewares');

const commentController = require('../controllers/comment.controller');

commentRouter.post('/comment', authMiddleWare.verifyAccessToken, commentController.addComment);

commentRouter.put('/comment', authMiddleWare.verifyAccessToken, commentController.updateComment);

commentRouter.get('/:postId/comments', authMiddleWare.verifyAccessToken, commentController.getComments)

commentRouter.delete('/:postId/comments/:commentId', authMiddleWare.verifyAccessToken, commentController.deleteComment);

module.exports = commentRouter;