const joi = require('joi');

const createUserProfileSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    gender: joi.string().trim().required(),
    dateOfBirth: joi.string().trim().required(),
    address: joi.string().trim().required(),
    city: joi.string().trim().required(),
    state: joi.string().trim().required(),
    country: joi.string().trim().required(),
    pincode: joi.string().trim().required(),
    profileImage: joi.string().trim().allow(null).default(null)
})

const getUserProfileSchema = joi.object({
    userId: joi.string().length(24).hex().required(),
})

const updateUserProfileSchema = joi.object({
    userProfileId: joi.string().length(24).hex().required(),
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    gender: joi.string().trim().required(),
    dateOfBirth: joi.string().trim().required(),
    address: joi.string().trim().required(),
    city: joi.string().trim().required(),
    state: joi.string().trim().required(),
    country: joi.string().trim().required(),
    pincode: joi.string().trim().required(),
    profileImage: joi.string().trim().allow(null).default(null)
})

module.exports = {
    createUserProfileSchema,
    getUserProfileSchema,
    updateUserProfileSchema
}

