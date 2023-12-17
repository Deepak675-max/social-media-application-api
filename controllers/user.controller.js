const { userProfileModel, userModel } = require('../models/user.model');
const httpErrors = require('http-errors');
const joiUserProfile = require('../helper/joi/user.joi_validation');

const createUserProfile = async (req, res, next) => {
    try {
        const userProfileDetails = await joiUserProfile.createUserProfileSchema.validateAsync(req.body);

        userProfileDetails.userId = req.user._id;

        const doesUserExist = await userModel.findOne({
            _id: req.user._id,
            isDeleted: false,
        });

        if (!doesUserExist)
            throw httpErrors.NotFound(`User with userId: ${userProfileDetails.userId} does not exist`);

        const doesUserProfileExist = await userProfileModel.findOne({
            userId: req.user._id,
            isDeleted: false,
        });

        if (doesUserProfileExist)
            throw httpErrors.Conflict(`User profile with userId: ${userProfileDetails.userId} already exist`);


        const newProfile = new userProfileModel(userProfileDetails);

        const userProfile = await newProfile.save();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    userProfile: userProfile,
                    message: "User profile created successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const userDetails = await joiUserProfile.getUserProfileSchema.validateAsync(req.params);

        const doesUserExist = await userModel.findOne({
            _id: userDetails.userId,
            isDeleted: false,
        });

        if (!doesUserExist)
            throw httpErrors.NotFound(`User with userId: ${userDetails.userId} does not exist`);

        const userProfile = await userProfileModel.findOne({
            userId: userDetails.userId,
            isDeleted: false,
        }).lean();

        if (!userProfile)
            throw httpErrors.NotFound(`User profile with userId: ${userDetails.userId} does not exist`);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    userProfile: userProfile,
                    message: "User profile fetched successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        const parsedPage = parseInt(page, 10);
        const parsedPageSize = parseInt(pageSize, 10);

        if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage < 1 || parsedPageSize < 1) {
            throw httpErrors[400]('Invalid page or pageSize parameters');
        }

        // Calculate the number of posts to skip based on the page and pageSize
        const skip = (parsedPage - 1) * parsedPageSize;

        // Query to retrieve users with pagination
        const users = await userModel
            .find({ isDeleted: false })
            .skip(skip)
            .limit(parsedPageSize)
            .sort({ _id: -1 }) // Sort in descending order based on _id (or your preferred sorting)
            .lean()


        await Promise.all(
            users.map(async (user) => {
                delete user.password;
                return user;
            })
        )

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    users: users,
                    message: "Users fetched successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
        const userProfileDetails = await joiUserProfile.updateUserProfileSchema.validateAsync(req.body);

        userProfileDetails.userId = req.user._id;

        const doesUserExist = await userModel.findOne({
            _id: userProfileDetails.userId,
            isDeleted: false,
        });

        if (!doesUserExist)
            throw httpErrors.Conflict(`User with id: ${userProfileDetails.userId} does not exist`);

        const userProfile = await userProfileModel.findOne({
            _id: userProfileDetails.userProfileId,
            userId: userProfileDetails.userId,
            isDeleted: false
        });

        if (!userProfile)
            throw httpErrors.Conflict(`User profile with id: ${userProfileDetails.userProfileId} does not exist`);

        await userProfile.updateOne(userProfileDetails, { new: true });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "User profile updated successfully",
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
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    getUsers
}
