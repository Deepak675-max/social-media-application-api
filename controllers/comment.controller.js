const httpErrors = require('http-errors');
const { postCommentModel } = require('../models/comment.model');
const { userPostModel } = require('../models/post.model');
const joiPostComment = require('../helper/joi/comment.joi_validation');
const { userModel } = require('../models/user.model');

const addComment = async (req, res, next) => {
    try {
        const commentDetails = await joiPostComment.createCommentSchema.validateAsync(req.body);
        commentDetails.userId = req.user._id;

        const userPost = await userPostModel.findOne({
            _id: commentDetails.postId,
            isDeleted: false,
        });

        if (!userPost)
            throw httpErrors.NotFound(`User post with id: ${commentDetails.postId} does not exist`);

        const newComment = new postCommentModel(commentDetails)

        await newComment.save();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    newComment: newComment,
                    message: "comment in post added successfully.",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getComments = async (req, res, next) => {
    try {
        const commentDetails = await joiPostComment.getCommentSchema.validateAsync(req.params);

        const { page = 1, pageSize = 10 } = req.query;

        const userPost = await userPostModel.findOne({
            _id: commentDetails.postId,
            isDeleted: false,
        });

        if (!userPost)
            throw httpErrors.NotFound(`User post with id: ${commentDetails.postId} does not exist`);

        const parsedPage = parseInt(page, 10);
        const parsedPageSize = parseInt(pageSize, 10);

        if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage < 1 || parsedPageSize < 1) {
            throw httpErrors[400]('Invalid page or pageSize parameters');
        }

        // Calculate the number of comments to skip based on the page and pageSize
        const skip = (parsedPage - 1) * parsedPageSize;

        // Query to retrieve comments for the specified post with pagination
        const postComments = await postCommentModel
            .find({ postId: commentDetails.postId, isDeleted: false })
            .skip(skip)
            .limit(parsedPageSize)
            .sort({ _id: -1 }) // Sort in descending order based on _id (or your preferred sorting)
            .lean()

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    postComments: postComments,
                    message: "Comments fetched successfully.",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const updateComment = async (req, res, next) => {
    try {
        const commentDetails = await joiPostComment.updateCommentSchema.validateAsync(req.body);

        const userPost = await userPostModel.findOne({
            _id: commentDetails.postId,
            isDeleted: false,
        });

        if (!userPost)
            throw httpErrors.Conflict(`User post with id: ${commentDetails.postId} does not exist`);


        const postComment = await postCommentModel.findOne({
            _id: commentDetails.commentId,
            postId: commentDetails.postId,
            isDeleted: false
        });

        if (!postComment)
            throw httpErrors.NotFound(`comment not found for id: ${commentDetails.commentId}`);

        if (userPost.userId !== (req.user._id).toString() && postComment.userId !== (req.user._id).toString())
            throw httpErrors.Unauthorized(`Unauthorised user`);


        await postComment.updateOne(
            {
                $set: {
                    text: commentDetails.text,
                }
            },
            { new: true }
        );

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "comment updated successfully.",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const commentDetails = await joiPostComment.deleteCommentSchema.validateAsync(req.params);

        const userPost = await userPostModel.findOne({
            _id: commentDetails.postId,
            isDeleted: false
        });

        if (!userPost)
            throw httpErrors.NotFound(`User post with id: ${commentDetails.postId} does not exist`);

        const postComment = await postCommentModel.findOne({
            _id: commentDetails.commentId,
            postId: commentDetails.postId,
            isDeleted: false
        });

        if (!postComment)
            throw httpErrors.NotFound(`comment not found for id: ${commentDetails.commentId}`);

        if (userPost.userId !== (req.user._id).toString() && postComment.userId !== (req.user._id).toString())
            throw httpErrors.Unauthorized(`Unauthorised user`);


        await postComment.updateOne(
            {
                $set: {
                    isDeleted: true,
                }
            },
            { new: true }
        );

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "comment deleted successfully.",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

module.exports = {
    addComment,
    getComments,
    updateComment,
    deleteComment
}