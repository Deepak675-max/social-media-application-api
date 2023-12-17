const { userPostModel } = require('../models/post.model');
const httpErrors = require('http-errors');
const joiUserPost = require('../helper/joi/post.joi_validation');
const { userModel } = require('../models/user.model');
const { postCommentModel } = require('../models/comment.model');

const createUserPost = async (req, res, next) => {
    try {
        const userPostDetails = await joiUserPost.createPostSchema.validateAsync(req.body);

        userPostDetails.userId = req.user._id;

        const user = await userModel.findOne({
            _id: userPostDetails.userId,
            isDeleted: false,
        });

        if (!user)
            throw httpErrors.NotFound(`User with userId: ${userPostDetails.userId} does not exist`);


        const newPost = new userPostModel(userPostDetails);

        const userPost = await newPost.save();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    userPost: userPost,
                    message: "User post created successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getUserPosts = async (req, res, next) => {
    try {
        const userDetails = await joiUserPost.getPostSchema.validateAsync(req.params);

        const { page = 1, pageSize = 10 } = req.query;

        const user = await userModel.findOne({
            _id: userDetails.userId,
            isDeleted: false,
        });

        if (!user)
            throw httpErrors.NotFound(`User with userId: ${userDetails.userId} does not exist`);

        const parsedPage = parseInt(page, 10);
        const parsedPageSize = parseInt(pageSize, 10);

        if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage < 1 || parsedPageSize < 1) {
            throw httpErrors[400]('Invalid page or pageSize parameters');
        }

        // Calculate the number of posts to skip based on the page and pageSize
        const skip = (parsedPage - 1) * parsedPageSize;

        // Query to retrieve posts for the specified user with pagination
        const userPosts = await userPostModel
            .find({ userId: userDetails.userId, isDeleted: false })
            .skip(skip)
            .limit(parsedPageSize)
            .sort({ _id: -1 }) // Sort in descending order based on _id (or your preferred sorting)
            .lean()

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    userPosts: userPosts,
                    message: "Posts fetched successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const updateUserPost = async (req, res, next) => {
    try {
        const userPostDetails = await joiUserPost.updatePostSchema.validateAsync(req.body);

        const userPost = await userPostModel.findOne({
            _id: userPostDetails.postId,
            isDeleted: false
        });

        if (!userPost)
            throw httpErrors.NotFound(`User post with id: ${userPostDetails.postId} does not exist`);

        if (userPost.userId !== (req.user._id).toString())
            throw httpErrors.Unauthorized(`Unauthorised user`);

        await userPost.updateOne(userPostDetails, { new: true });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "User post updated successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const deleteUserPost = async (req, res, next) => {
    try {
        const userPostDetails = await joiUserPost.deletePostSchema.validateAsync(req.params);

        const userPost = await userPostModel.findOne({
            _id: userPostDetails.postId,
            isDeleted: false,
        });

        if (!userPost)
            throw httpErrors.NotFound(`User post with id: ${userPostDetails.postId} does not exist`);

        if (userPost.userId !== (req.user._id).toString())
            throw httpErrors.Unauthorized(`Unauthorised user`);

        await userPost.updateOne({
            $set: {
                isDeleted: true
            }
        }, { new: true });

        await postCommentModel.updateMany(
            {
                postId: userPostDetails.postId,
                isDeleted: false
            },
            {
                $set: {
                    isDeleted: true
                }
            },
            {
                new: true
            }
        )

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "User post deleted successfully",
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
    createUserPost,
    getUserPosts,
    updateUserPost,
    deleteUserPost
}
