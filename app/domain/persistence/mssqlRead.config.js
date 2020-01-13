const config = require('config');

const MSSQL_CONN_READONLY = {
    server: config.get('DB_READ').MSSQL.HOST,
    port: config.get('DB_READ').MSSQL.PORT,
    user: config.get('DB_READ').MSSQL.USER,
    password: config.get('DB_READ').MSSQL.PASSWORD,
    database: config.get('DB_READ').MSSQL.DB, 
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


module.exports = MSSQL_CONN_READONLY;