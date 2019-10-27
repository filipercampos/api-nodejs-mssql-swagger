'use strict';
const DateUtil = require('../utils/date.util');

// Objeto de response da api Usuario
module.exports = {
    dto: (entity) => {
        return {
            id: entity.UsuarioID,
            nome: entity.Nome,
            cpf: entity.CPF,
            dataNascimento: DateUtil.getTimestamp(entity.DataNascimento),
            email: entity.Email,
            celular: entity.Celular,
            senha: entity.Senha,
            dataPrimeiraHabilitacao: DateUtil.getTimestamp(entity.DataPrimeiraHabilitacao),
            numeroCNH: entity.NumeroCNH,
            validadeCNH: DateUtil.getTimestamp(entity.ValidadeCNH),
            categoriaCNH: entity.CategoriaCNH,
            cep: entity.CEP,
            cidade: entity.Cidade,
            uf: entity.UF,
            logradouro: entity.Logradouro,
            complemento: entity.Complemento,
            inseridoEm: DateUtil.getTimestamp(entity.InseridoEm),
            contasBancarias: [],
            veiculo: null,
            //TODO links
        }
    }
};