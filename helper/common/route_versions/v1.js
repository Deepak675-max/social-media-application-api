const express = require("express");
const v1 = express.Router();

const authRoutes = require('../../../routes/auth.route');
v1.use('/auth', authRoutes);

const userProfileRoutes = require('../../../routes/user.route');
v1.use('/users', userProfileRoutes);

const userPostRoutes = require('../../../routes/post.route');
v1.use('/users', userPostRoutes);

const postCommentRoutes = require('../../../routes/comment.route');
v1.use('/posts', postCommentRoutes);


module.exports = v1;
