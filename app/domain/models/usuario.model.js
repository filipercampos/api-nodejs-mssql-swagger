'use strict';
const DateUtil = require('../utils/date.util');

// Objeto de response da api Usuario
module.exports = {
    model: (entity) => {
        return {
            id: entity.UsuarioID,
            nome: entity.NomeUsuario,
            cpf: entity.CPF,
            dataNascimento: DateUtil.getTimestamp(entity.DataNascimento),
            email: entity.Email,
            cidade: entity.Cidade,
            uf: entity.Estado,
            logradouro: entity.Logradouro,
            complemento: entity.Complemento,
            inseridoEm: DateUtil.getTimestamp(entity.InseridoEm)
            //TODO links
        }
    }
};