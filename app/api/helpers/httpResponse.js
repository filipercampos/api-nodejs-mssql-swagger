"use strict";

const LogBO = require("./logBO");

module.exports.responseAPI = {

    success: function (res, data, statusCode) {
        res.status(statusCode).send({ data: data });
    },

    error: async function (res, statusCode, errorMsg, known_error = false) {
        let logBO = new LogBO();
        if (known_error) {
            res.status(statusCode).send({ message: errorMsg });
        }
        else {
            try {
                await logBO.register(errorMsg);
                res.status(statusCode).send({ message: errorMsg });
            }
            catch (err) {
                res.status(statusCode).send({ message: errorMsg });
            }
        }
    }
}