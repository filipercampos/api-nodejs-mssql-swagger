'use strict';

const mssql = require('mssql');
const Factory = require('../persistence/mssqlFactory');
const ProcedureException = require('../../api/exceptions/procedure.exception');
const CommonProcedure = require('../persistence/common.procedure');
const ConflictException = require('../../api/exceptions/conflict.exception');
const Exception = require('../../api/exceptions/exception');
const fs = require('fs');
const path = require('path');

const _ = require('lodash');

/**
 * Service Layer 
 * 
 * Direct communication with repository layer
 * 
 * Camada de serviço: Faz a requisição e renderiza o retorno do banco de dados
 * 
 */
module.exports = class CommonService {

    constructor(model, spGetName, keyParam) {
        this._model = model;
        this._spGet = new CommonProcedure();
        this._spGet.initialize(spGetName, keyParam);
        this._factory = new Factory();
    }

    /**
     * Cria um pool de conexão
     */
    async openConnection() {
        return await this._factory.connectPool();
    }

    /**
     * Get data from id
     * @param {PK from table} id 
     */
    async getById(id) {

        try {
            let conn = await this._factory.connectPool();
            let result = await conn.request()
                .input(this._spGet.key, mssql.Int, this._toParamValue(id))
                .execute(this._spGet.name);

            let record = result != null && _.isArray(result.recordset)
                ? result.recordset[0]
                : null;

            if (record != null) {
                if (this._model != null) {
                    return this._model.model(record);
                }
                else {
                    return record;
                }
            }

            return record;

        } catch (err) {
            throw new ProcedureException(this._spGet.name, err.message);
        }
    }

    /**
     * Remove data from id
     * @param {PK from table} id 
     */
    async deleteById(id) {

        try {
            let conn = await this._factory.connectPool();
            let result = await conn.request()
                .input(this._spGet.key, mssql.Int, this._toParamValue(id))
                .execute(this._spGet.name);

            return this.responseDelete(result);

        } catch (err) {
            throw new ProcedureException(this._spGet.name, err.message);
        }
    }

    /**
     * Get all data
     */
    async getAll() {
        let name = this._spGet.name;
        try {
            let conn = await this._factory.connectPool();
            let result = await conn.request()
                .execute(name);

            let results = _.isArray(result.recordset) ? result.recordset : [];

            let resultsResponse = null;

            if (this._model != null) {
                resultsResponse = results.map(item => {
                    return this._model.model(item)
                });
            }
            else {
                resultsResponse = results;
            }
            return this.getResponsePagination(
                results,
                resultsResponse,
                procedure.pageIndex,
                procedure.rowsPerPage
            );

        } catch (error) {
            throw new ProcedureException(name, error.message);
        }
    }

    /**
     * Response for recordset
     * @param {Recordset} Data
     */
    findResponse(results, pageIndex, rowsPerPage) {
        let resultsResponse = null;

        if (this._model != null) {
            resultsResponse = results.map(item => {
                return this._model.model(item)
            });
        }
        else {
            resultsResponse = results;
        }

        if (_.isUndefined(pageIndex) || _.isUndefined(rowsPerPage)) {
            return {
                results: resultsResponse
            };
        }
        return this.getResponsePagination(
            results,
            resultsResponse,
            pageIndex,
            rowsPerPage
        );
    }


    /**
     * Response for recordset
     * @param {Recordset} Data
     */
    customResponse(results, model, pageIndex, rowsPerPage) {
        let resultsResponse = null;

        if (model != null) {
            resultsResponse = results.map(item => {
                return model.model(item)
            });
        }
        else {
            resultsResponse = results;
        }

        if (_.isUndefined(pageIndex) || _.isUndefined(rowsPerPage)) {
            return resultsResponse;
        }

        return this.getResponsePagination(
            results,
            resultsResponse,
            pageIndex,
            rowsPerPage
        );
    }

    /**
     * Response for Save      
     * @param {body} payload 
     */
    responseSave(result) {

        let pk = null;
        let message = 'Salvo com sucesso';

        if (_.isNil(result)) {
            message = 'responseSave is null or undefined';
        }

        else if (_.isArray(result.recordset)) {

            pk = parseInt(result.recordset[0][""].toString());
        }

        else if (!_.isNil(result.output.pID)) {

            pk = result.output.pID;
        }

        else {
            pk = null;
        }

        let response = {
            id: pk,
            message: message
        }
        return response;
    }

    /**
     * Response for PUT ou PATCH
     * @param {Result procedure} result 
     */
    responseUpdate(result) {

        let message = 'Atualizado com sucesso';
        let rowsAffected = this._getRowsAffected(result);
        if (_.isNil(result) || rowsAffected == 0) {
            message = 'Sucesso, mas nenhuma linha afetada';
        }
        let response = {
            rowsAffected: rowsAffected,
            message: message
        }
        return response;
    }

    /**
     * Response for DELETE 
     * @param {Result procedure} result 
     */
    responseDelete(result) {

        let message = 'Removido com sucesso';
        let rowsAffected = this._getRowsAffected(result);
        if (_.isNil(result) || rowsAffected == 0) {
            message = 'Sucesso, mas nenhuma linha afetada';
        }
        let response = {
            rowsAffected: rowsAffected,
            message: message
        }

        return response;
    }

    _getRowsAffected(result) {
        let rowsAffected = null;

        if (_.isArray(result.rowsAffected) && (_.isArray(result.recordset) && result.recordset.length == 0)) {

            if (result.rowsAffected.length == 1) {
                rowsAffected = parseInt(result.rowsAffected[0].toString());
            }
            else {
                rowsAffected = 0;
                //conte as linhas afetadas
                result.rowsAffected.map(rowCount => {
                    rowsAffected += rowCount;
                });
            }
        }
        else if (_.isArray(result.recordset) && result.recordset.length > 0) {
            rowsAffected = parseInt(result.recordset[0][""].toString());
        }
        return rowsAffected;
    }

    /**
     * Pagination from response
     * @param {Filtro} procedure 
     * @param {Resultado da procedure} results 
     * @param {Response} response 
     */
    getResponsePagination(results, resultsResponse, index, rowsCount) {

        const totalPagina = (results.length > 0 && results[0].TotalPagina)
            ? results[0].TotalPagina
            : null;

        let totalRows = null;

        if (totalPagina !== null && rowsCount !== null) {
            totalRows = totalPagina * rowsCount;
        }

        return {
            pageIndex: index,
            rowsPerPage: rowsCount,
            totalRows: totalRows,
            totalPages: Math.ceil(totalPagina),
            results: resultsResponse
        };
    }


    /**
     * Generate response pagination from recordset
     * 
     * @param {Result set procedure} records 
     * @param {Total pages} numeroPagina 
     * @param {Row per page} linhasPagina 
     */
    getResultPaginationProcedure(records, index, rowsCount) {

        let resultsResponse = records.map(item => {
            return this._model.model(item)
        });
        let totalPages = records.length > 0 ? records[0].TotalPagina : null;
        let totalRows = null;
        if (totalPages !== null && rowsCount !== null) {
            totalRows = totalPages * rowsCount;
        }
        let result = {
            pageIndex: index,
            rowsPerPage: rowsCount,
            totalRows: totalRows,
            totalPages: totalPages,
            results: resultsResponse
        };
        return result;
    }

    /**
     * Validation parameter pagination
     * 
     * @param {Pagination parameters } params 
     */
    validatePagination(params) {

        if (params.numeroPagina) {
            params.numeroPagina = _.isNil(params.numeroPagina.value) ? null : params.numeroPagina.value;
        } else {
            params.numeroPagina = null;
        }

        if (params.linhasPagina) {
            params.linhasPagina = _.isNil(params.linhasPagina.value) ? null : params.linhasPagina.value;
        } else {
            params.linhasPagina = null;
        }
    }

    /**
     * Parametro generico da array_codigo
     * 
     * @param {Table type int} ids 
     */
    createTableParameters(ids) {

        if (_.isNil(ids) || !_.isArray(ids.value)) {
            throw new ProcedureException("Array de parametros 'ids' inválida");
        }
        let tvp = new mssql.Table();

        //estrutura da tabela genérica
        tvp.columns.add('Codigo', mssql.Int);

        ids.value.forEach(item => {
            tvp.rows.add(item);
        });
        return tvp;
    }

    /**
    * Get simple value from objet or .value
    * Check object is null or undefined
    * @param {Object to be verified} o 
    */
    _toParamValue(o) {

        if (_.isNil(o)) {
            return null;
        }
        //variables body
        else if (_.isNil(o.path)) {
            return o;
        }
        else if (_.isNil(o.value)) {
            return null;
        }
        //variables get
        else {
            if(o.value == 'null'){
                return null;
            }
            return o.value;
        }
    }
    
    /**
     * Executa uma instrução SQL
     * 
     * @param { sql } sql Instrução SQL  
     * @param { conn } conn Conexão especifica  
     */
    async query(sql, conn) {
        if (!conn) {
           conn = await this._factory.connectPool();
        }

        try {
            //parse lower
            let sqlBroken = sql.toLowerCase().split(' ');
            //count froms
            let froms = 0;
            //count join
            let joins = 0;
            //count with nolock
            let nolocks = 0;

            for (let i = 0; i < sqlBroken.length; i++) {

                let line = sqlBroken[i].trim();

                if (line !== '') {

                    if (line === 'from') {
                        froms++;
                    }
                    else if (line === 'inner') {
                        joins++;
                    }
                    else if (line.includes('nolock')) {
                        nolocks++;
                    }
                }
            }

            if ((froms + joins) > nolocks) {
                throw new Exception(
                    {
                        error: 'Tentativa de execução de uma instrução sql sem WITH(NOLOCK)',
                        sql: sql
                    }
                );
            }
            let result = await conn.request().query(sql);
            return result.recordset;
        }
        catch (err) {

            if (err instanceof Exception) {
                throw err;
            }
            throw new Exception({ sql: sql, error: err.message });
        }
    }
    /**
     * Drop table from database
     * @param {Connection} conn 
     * @param {Nome da tabela} tableName 
     */
    async dropTable(conn, tableName) {
        try {

            const batchSql = `IF OBJECT_ID('tempdb..${tableName}') IS NOT NULL 
                            DROP TABLE ${tableName}
                          `;
            await conn.request().batch(batchSql);
        } catch (error) {
            console.error(error.message);
        }
    }

    /**
     * Leitura de arquivos .sql
     * ```
     * '../db/sqls/file.sql';
     * ```
     * Use 
     * @param {Path do arquivo} pathSql 
     */
    getSqlText(pathSql) {
        try {

            const sqlText = fs.readFileSync(path.join(__dirname, pathSql),
                { encoding: 'utf8' }
            );
            return sqlText;

        } catch (err) {

            throw new Error(`atendimentosClientesRepository._getSqlText => Error na leitura do sql ${pathSql}`);
        }
    }
}