'use strict';

const HttpStatusCode = require('../helpers/httpStatusCode');

const CommonController = require('./common.controller');
const UsuarioService = require('../../domain/services/usuario.service');
const CacheMiddleware = require('./cacheMiddleware');
class UsuarioController extends CommonController {
  constructor() {
    super();
    this._service = new UsuarioService()
  }

  async authentication(req, res) {
    try {
      //processe os dados do body
      var body = req.body;
      //realiza a requisica no bd
      let result = await this._service.login(body);

      super.sendSucess(res, result);

    } catch (err) {
      super.sendError(res, err);
    }
  }

  async get(req, res) {

    const cache = new CacheMiddleware();
    cache.buildCache(req, 'usuarioid', 360);

    await super.get(req, res, cache);
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