const config = require('config');

'use strict';
const MSSQL_CONN = {
    server: config.get('DB').MSSQL.HOST,
    port: config.get('DB').MSSQL.PORT,
    user: config.get('DB').MSSQL.USER,
    password: config.get('DB').MSSQL.PASSWORD,
    database: config.get('DB').MSSQL.DB, 
    connectionTimeout: 30000,
    pool: {
        max: 50,
        min: 0,
        idleTimeoutMillis: 30000
    },       
    options: {
        encrypt: false
    }
}

module.exports = MSSQL_CONN;