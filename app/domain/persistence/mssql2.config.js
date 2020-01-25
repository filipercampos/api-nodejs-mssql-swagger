const config = require('config');

/**
 * Configuração de banco de dados
 * 
 * @author Filipe Campos
 */
module.exports = MSSQL_CONN_READONLY = {
    server: config.get('DB2').MSSQL.HOST,
    port: config.get('DB2').MSSQL.PORT,
    user: config.get('DB2').MSSQL.USER,
    password: config.get('DB2').MSSQL.PASSWORD,
    database: config.get('DB2').MSSQL.DB, 
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
