const joi = require('joi');

const createPostSchema = joi.object({
    title: joi.string().trim().required(),
    content: joi.string().trim().required(),
})

const getPostSchema = joi.object({
    userId: joi.string().length(24).hex().required(),
})

const updatePostSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
    title: joi.string().trim().required(),
    content: joi.string().trim().required(),
})

const deletePostSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
})

module.exports = {
    createPostSchema,
    getPostSchema,
    updatePostSchema,
    deletePostSchema,
}

