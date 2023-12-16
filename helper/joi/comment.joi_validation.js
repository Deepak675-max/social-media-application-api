const joi = require('joi');

const createCommentSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
    text: joi.string().trim().required()
});

const getCommentSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
});

const updateCommentSchema = joi.object({
    commentId: joi.string().length(24).hex().required(),
    postId: joi.string().length(24).hex().required(),
    text: joi.string().trim().required(),
});

const deleteCommentSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
    commentId: joi.string().length(24).hex().required(),
});

module.exports = {
    createCommentSchema,
    getCommentSchema,
    updateCommentSchema,
    deleteCommentSchema
}