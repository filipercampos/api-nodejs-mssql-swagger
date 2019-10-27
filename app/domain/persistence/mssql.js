'use strict';
const mssqlConfig = require('../persistence/mssql.config');
const mssql = require('mssql');

const pool = new mssql.ConnectionPool(mssqlConfig).connect();

module.exports = pool;