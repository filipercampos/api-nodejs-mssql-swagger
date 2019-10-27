'use strict'
/** Enum dos status e code de requisições http */
const httpEnum = {
    requestHttp: {
        success: {
            STATUS: "success",
            CODE: 200
        },
        error: {
            STATUS: "error",
            CODE: 400
        },
        falha:  {
            STATUS: "fail",
            CODE: 500
        }
    }
}

module.exports = httpEnum;