require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");

const cors = require("cors");

const version1 = require("./helper/common/route_versions/v1");
const User = require('./models/user.model');
const expenseTrackerBackendApp = express();

expenseTrackerBackendApp.use(cors({
    origin: "*"
}));

const sequelize = require('./helper/common/init_mongodb');

expenseTrackerBackendApp.use(express.json());
expenseTrackerBackendApp.use(express.urlencoded({ extended: true }));

expenseTrackerBackendApp.use("/v1", version1);

expenseTrackerBackendApp.use(async (req, _res, next) => {
    console.log(req, _res);
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
expenseTrackerBackendApp.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});

const port = process.env.APP_PORT;

expenseTrackerBackendApp.listen(port, () => {
    console.log(`server is listening on the port of ${port}`);
})

process.on('SIGINT', () => {
    // Perform cleanup operations here
    console.log('Received SIGINT signal. application terminated successfully.');

    // Exit the application
    process.exit(0);
});

process.on("uncaughtException", (error) => {
    console.error(`Uncaught Exception Occured\n${error}`);
});



