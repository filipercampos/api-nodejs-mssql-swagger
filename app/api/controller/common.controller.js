'use strict';

const Response = require('../helpers/httpResponse');
const HttpStatusCode = require('../helpers/httpStatusCode');
const ErroException = require('../exception/httpError.exception');
const ConflictException = require('../exception/conflict.exception');
const ProcedureException = require('../exception/procedure.exception');

/**
 * Request service HTTP route
 */
module.exports = class CommonController {

    constructor(service) {
        //initialize business object
        this._service = service;
        this._response = Response;
        this._httpStatusCode = HttpStatusCode;
    }

    async get(req, res) {
        try {
            let params = req.swagger.params;
            let result = await this._service.find(params);
            if (result.results === null) {
                result.results = [];
            }
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        } catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            }
            else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async getAll(req, res) {
        try {
            let result = await this._service.findAll();
            if (result.results === null) {
                result.results = [];
            }
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        } catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async getById(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let result = await this._service.findById(id);
            if (result === null) {
                result = {};
            }
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        }
        catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async post(req, res) {
        try {
            let result = await this._service.save(req.body);
            Response.responseAPI.success(res, result, HttpStatusCode.CREATED);
        }
        catch (err) {
            if (err instanceof ErroException || err instanceof ProcedureException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            }
            else if (err instanceof ConflictException) {
                Response.responseAPI.error(res, HttpStatusCode.CONFLICT, err.message, true);
            }
            else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async put(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let body = req.body;
            let result = await this._service.update(id, body);
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        }
        catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async patch(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let body = req.body;
            let result = await this._service.patch(id, body);
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        }
        catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async remove(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let result = await this._service.remove(id);
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        }
        catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async delete(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let body = req.body;
            let result = await this._service.delete(id, body);
            Response.responseAPI.success(res, result, HttpStatusCode.OK);
        }
        catch (err) {
            if (err instanceof ErroException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
            } else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }
}