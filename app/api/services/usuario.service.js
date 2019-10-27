'use strict';

const Response = require('../helpers/httpResponse');
const HttpStatusCode = require('../helpers/httpStatusCode');
const HttpException = require('../exception/httpError.exception');
const AuthenticationException = require('../exception/authentication.exception');

const CommonService = require('./common.service');
const UsuarioBO = require('../../domain/business/usuario.bo');

module.exports = class UsuarioService extends CommonService {
  constructor() {
    super(new UsuarioBO());
  }

  async authentication(req, res) {
    try {

      var body = req.body;
      var auth = body.auth;

      let result = await this._business.login(body, auth);
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
  
}
 