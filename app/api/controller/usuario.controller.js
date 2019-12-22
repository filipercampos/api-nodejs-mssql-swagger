'use strict';

const Response = require('../helpers/httpResponse');
const HttpStatusCode = require('../helpers/httpStatusCode');
const HttpException = require('../exception/httpError.exception');
const AuthenticationException = require('../exception/authentication.exception');

const CommonController = require('./common.controller');
const UsuarioService = require('../../domain/service/usuario.service');

class UsuarioController extends CommonController {
  constructor() {
    super(new UsuarioService());
  }

  async authentication(req, res) {
    try {

      var body = req.body;
      var auth = body.auth;

      let result = await this._service.login(body, auth);
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

/**
 * Realiza o login e retorna um token
 */
module.exports.postLogin = function (req, res) {
  const controller = new UsuarioController();
  controller.authentication(req, res);
}

module.exports.getUsuario = function (req, res) {
  const controller = new UsuarioController();
  controller.getById(req, res);
}

module.exports.getUsuarios = function (req, res) {
  const controller = new UsuarioController();
  controller.get(req, res);
}

module.exports.postUsuario = function (req, res) {
  const controller = new UsuarioController();
  controller.post(req, res);
}

module.exports.putUsuario = function (req, res) {
  const controller = new UsuarioController();
  controller.update(req, res);
}

module.exports.patchUsuario = function (req, res) {
  const controller = new UsuarioController();
  controller.patch(req, res);
}