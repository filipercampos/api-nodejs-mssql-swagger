'use strict';

const Response = require('../helpers/httpResponse');
const HttpStatusCode = require('../helpers/httpStatusCode');
const ErroException = require('../exceptions/httpError.exception');
const ConflictException = require('../exceptions/conflict.exception');
const ProcedureException = require('../exceptions/procedure.exception');
const cache = require('memory-cache');
let memCache = new cache.Cache();

/**
 * Request service HTTP route
 * @author Filipe Campos
 */
module.exports = class CommonController {

    constructor(service) {
        //initialize service object
        this._service = service;
        this._response = Response;
        this._httpStatusCode = HttpStatusCode;
    }

    /**
     * Envia um resposta sucesso
     * 
     * @param {Response} res 
     * @param {Result} result 
     */
    async sendSucess(res, result) {
        try {
            res.status(HttpStatusCode.OK).send(result);
        } catch (err) {
            if (err instanceof HttpException) {
                Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message);
            }
            else if (err instanceof AuthenticationException) {
                Response.responseAPI.error(res, HttpStatusCode.UNAUTHORIZED, err.message);
            }
            else {
                Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    /**
     * Envia um resposta erro
     * 
     * @param {Response} res 
     * @param {Result} result 
     */
    async sendError(res, err, httpStatus) {
        if (httpStatus) {
            Response.responseAPI.error(res, httpStatus, err.message);
        }
        else if (err instanceof ErroException) {
            Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
        } else {
            Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
        }
    }

    /**
     * Envia um requisição get 
     * 
     * Aceita cache em memória
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Result} result 
     */
    async get(req, res, cache) {

        let cacheContent = null;

        if (cache) {
            //verifica se recuperou o cache
            cacheContent = memCache.get(cache.key);
            if (cacheContent) {
                //send cache
                Response.responseAPI.success(res, cacheContent, HttpStatusCode.OK);
            }
        }

        //not exist cache
        if (cacheContent == null) {
            try {

                let params = req.swagger.params;
                let result = await this._service.get(params);
                if (result.results == null) {
                    result.results = [];
                }
                if (cache) {
                    memCache.put(cache.key, result, cache.duration * 1000);
                }

                if (result.results && result.results.length == 0) {
                    Response.responseAPI.success(res, null, HttpStatusCode.OK);
                } else {
                    Response.responseAPI.success(res, result, HttpStatusCode.OK);
                }
            } catch (err) {
                if (err instanceof ErroException) {
                    Response.responseAPI.error(res, HttpStatusCode.UNPROCESSABLE_ENTITY, err.message, true);
                } else {
                    Response.responseAPI.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, err.message);
                }
            }
        }
    }

    /**
     * Envia uma requisição get
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async getAll(req, res) {
        try {
            let result = await this._service.getAll();
            if (result.results == null) {
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

    /**
     * Envia uma requisição get
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async getById(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let result = await this._service.getById(id);
            if (result == null) {
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

    /**
     * Envia uma requisição save
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async post(req, res) {
        try {
            let result = await this._service.post(req.body);
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

    /**
     * Envia uma requisição update
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
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

    /**
     * Envia uma requisição update
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
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

    /**
     * Envia uma requisição delete
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async deleteById(req, res) {
        try {
            let id = req.swagger.params.id.value;
            let result = await this._service.deleteById(id);
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