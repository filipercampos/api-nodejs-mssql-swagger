'use strict';
const CommonService = require('./common.service');
const UsuarioModel = require('../model/usuario.model');

const mssql = require('mssql');
const MssqlFactory = require('../persistence/mssql');
const { Contract } = require('../persistence/contract');
const ErrorException = require('../../api/exception/exception');
const ProcedureException = require('../../api/exception/procedure.exception');

//Authentication
const Auth = require('../../api/helpers/auth');
const AuthenticationException = require('../../api/exception/authentication.exception');

module.exports = class UsuarioService extends CommonService {

  constructor() {
    super(
      UsuarioModel,
      Contract.spUsuarioGet,
      'pUsuarioID'
    );

  }

  //Implementação especifica

  /**
   * Login
   * 
   * @param {Parâmetros da procedure} params 
   */
  async login(params) {

    try {

      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pEmail', mssql.NVarChar(120), params.username)
        .input('pSenha', mssql.NVarChar(32), params.password)
        .execute(Contract.spAutenticacaoGet);

      try {
        //result
        let data = result.recordset[0];
        //user data
        let loginToken = UsuarioModel.dto(data);
        //gera um token jwt a partir do dados do usuário
        let _auth = new Auth();
        const tokenValue = await _auth.sign(loginToken);
        return ({ token: tokenValue });
      } catch (error) {
        throw new AuthenticationException('Usuário ou senha incorreto(s)');
      }

    } catch (error) {

      throw new ProcedureException(Contract.spAutenticacaoGet, err.message);

    }
  }

  /**
   * Recupera dados de usuários
   * 
   * @param {Parâmetros da procedure} params 
   */

  async find(params) {

    try {

      //Table type use
      // let myTvp = this.createTableParameters(params.ids);

      this.validatePagination(params);

      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pUsuarioID', mssql.Int, this._toParamValue(params.id))
        .input('pNome', mssql.VarChar(200), this._toParamValue(params.nome))
        .input('pCPF', mssql.VarChar(20), this._toParamValue(params.cpf))
        .input('pEmail', mssql.NVarChar(400), this._toParamValue(params.email))
        .input('pNumeroPagina', mssql.Int, params.numeroPagina)
        .input('pLinhasPagina', mssql.Int, params.linhasPagina)
        // .input('pCodigos', myTvp)
        .execute(this._spGet.name);

      return super.findResponse(result.recordset, params.numeroPagina, params.linhasPagina);
    }
    catch (err) {
      throw new ProcedureException(this._spGet.name, err.message);
    }
  }

  /**
   * Registra um usuário no sistema
   * 
   * @param {Parâmetros da procedures} params
   */
  async save(params) {

    try {
      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pNome', mssql.VarChar(100), params.nome)
        .input('pEmail', mssql.NVarChar(200), params.email)
        .input('pSenha', mssql.NVarChar(400), params.senha)
        .input('pUsuarioId', mssql.Int, params.usuarioId)
      return this.getRowsAffected(result);
    }
    catch (err) {
      if (err.class === 11) {
        throw new ErrorException(err.message);
      } else {
        throw new ProcedureException(Contract.spUsuarioPost, err.message);
      }
    }
  }

  /**
  * Atualiza os dados usuário
  * 
  * @param {Parâmetros da procedures} params 
  */
  async update(id, params) {

    try {
      let conn = await MssqlFactory;
      let result = await conn.request()
        .input('pUsuarioID', mssql.Int, id)
        .input('pNome', mssql.VarChar(200), params.nome)
        .input('pEmail', mssql.NVarChar(200), params.email)
        .input('pSenha', mssql.NVarChar(400), params.senha)
        .execute(Contract.spUsuarioPut);

      return this.getRowsAffected(result);
    }
    catch (err) {
      if (err.class === 11) {
        throw new ErrorException(err.message);
      } else {
        throw new ProcedureException(Contract.spUsuarioPut, err.message);
      }
    }
  }

  /**
   * Altera a senha do usuário
   * 
   * @param {Parâmetros da procedures} params 
   */
  async patch(id, params) {

    try {
      let conn = await MssqlFactory;
      let result = await conn.request()

        .input('pUsuarioID', mssql.Int, id)
        .input('pSenhaAtual', mssql.NVarChar(400), params.senhaAtual)
        .input('pNovaSenha', mssql.NVarChar(400), params.novaSenha)
        .execute(Contract.spUsuarioPatch);

      return this.getRowsAffected(result);
    }
    catch (err) {
      if (err.class === 11) {
        throw new ErrorException(err.message);
      } else {
        throw new ProcedureException(Contract.spUsuarioPatch, err.message);
      }
    }
  }
}