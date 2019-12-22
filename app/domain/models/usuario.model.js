'use strict';
const DateUtil = require('../utils/date.util');

// Objeto de response da api Usuario
module.exports = {
    dto: (entity) => {
        return {
            id: entity.CodigoUsuario,
            nome: entity.NomeUsuario,
            cpf: entity.CPF,
            dataNascimento: DateUtil.getTimestamp(entity.DataNascimento),
            email: entity.Email,
            telefone: entity.Telefone1,
            cidade: entity.Cidade,
            uf: entity.Estado,
            logradouro: entity.Logradouro,
            complemento: entity.Complemento,
            inseridoEm: DateUtil.getTimestamp(entity.InseridoEm),
            grupoUsuarioId: entity.CodigoGrupoUsuario,
            valorMaxAprovacao: parseFloat(entity.ValorMaxAprovacao)
            //TODO links
        }
    }
};