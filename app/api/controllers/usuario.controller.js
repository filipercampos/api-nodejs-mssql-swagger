'use strict';

const UsuarioService = require('../services/usuario.service');

/**
 * Realiza o login e retorna um token
 */
module.exports.postLogin = function (req, res) {
  const service = new UsuarioService();
  service.authentication(req, res);
}

module.exports.getUsuario = function (req, res) {
  const service = new UsuarioService();
  service.getById(req, res);
}

module.exports.getUsuarios = function (req, res) {
  const service = new UsuarioService();
  service.get(req, res);
}

module.exports.postUsuario = function (req, res) {
  const service = new UsuarioService();
  service.post(req, res);
}

module.exports.putUsuario = function (req, res) {
  const service = new UsuarioService();
  service.update(req, res);
}

module.exports.patchUsuario = function (req, res) {
  const service = new UsuarioService();
  service.patch(req, res);
}