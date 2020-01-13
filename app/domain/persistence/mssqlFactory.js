'use strict';
const mssql = require('mssql');
const mssqlDefaultConfig = require('../persistence/mssql.config');
/**
 * Pool de conexão com o banco de dados SQL
 * @author Filipe Campos
 */
module.exports = class MssqlFactory {

    MssqlFactory() {
    }

    connectPool(config) {

        if (!config || config == null) {
            config = mssqlDefaultConfig;
        }

        const pool = new mssql.ConnectionPool(config).connect();
        return pool;
    }
}