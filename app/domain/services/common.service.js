'use strict';

const mssql = require('mssql');
const Factory = require('../persistence/mssqlFactory');
const ProcedureException = require('../../api/exceptions/procedure.exception');
const CommonProcedure = require('../persistence/common.procedure');
const ConflictException = require('../../api/exceptions/conflict.exception');
const Exception = require('../../api/exceptions/exception');
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
        return  await this._factory.connectPool();
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
            let conn =  await this._factory.connectPool();
            let result = await conn.request()
                .input(this._spGet.key, mssql.Int, this._toParamValue(id))
                .execute(this._spGet.name);

            var r = this.getRowsAffected(result);

            return this.responseRemove(r);

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
            let conn =  await this._factory.connectPool();
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
    async findResponse(results, pageIndex, rowsPerPage) {
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
            pageIndex,
            rowsPerPage
        );
    }

    /**
     * Response for Save      
     * @param {body} payload 
     */
    async responseSave(result) {

        if (!result)
            throw new ConflictException(`Ocorreu um erro ao salvar os dados`)
        let response = {
            id: parseInt(result),
            message: Boolean(result) ? `Dados salvos com sucesso` : 'Falha ao atualizar os dados'
        }
        return response;
    }

    /**
     * Response for Update
     * @param {PK da tabela} id 
     * @param {Procedure params} payload 
     */
    async responseUpdate(result) {

        if (!result)
            throw new ConflictException(`Ocorreu um erro ao atualizar os dados`)

        let response = {
            rowsAffected: parseInt(result),
            message: Boolean(result) ? `Dados atualizados com sucesso` : 'Falha ao atualizar os dados'
        }
        return response;
    }

    /**
     * Response for Update
     */
    async responsePatch(result) {

        if (!result)
            throw new ConflictException(`Ocorreu um erro ao atualizar os dados`)

        let response = {
            rowsAffected: parseInt(result),
            message: Boolean(result) ? `Dados atualizados com sucesso` : 'Falha ao atualizar os dados'
        }
        return response;
    }

    /**
     * Response for Remove
     * @param {PK da tabela} id 
     */
    async responseRemove(result) {

        if (!result)
            throw new ConflictException(`Ocorreu um erro ao remover o registro`)

        let response = {
            rowsAffected: parseInt(result),
            message: Boolean(result) ? `Registro(s) removido(s) com sucesso` : 'Erro ao remover'
        }
        return response;
    }

    /**
     * Response for Delete 
     * @param {PK da tabela} id 
     * @param {Parametros da procedure} payload 
     */
    async responseDelete(result) {

        if (!result)
            throw new ConflictException(`Ocorreu um erro ao remover o registro`)

        let response = {
            rowsAffected: parseInt(result),
            message: Boolean(result) ? `Registro(s) removido(s) com sucesso` : 'Erro ao remover'
        }
        return response;
    }

    /**
     * Rows affected from tables
     * @param {Recordset} result 
     */
    getRowsAffected(result) {
        try {
            if (_.isNil(result)) {
                throw new ProcedureException('Procedure execute fail. Result is undefined');
            }

            if (result.recordset.length === 0
                || result.recordset[0] === ''
                || result.recordset[0] === null) {
                throw new ProcedureException('Execução com sucesso, mas sem nenhuma linha afetada');
            }

            //id da linha afetada
            return result.recordset[0][""].toString();
        } catch (error) {
            //linha afetada
            return result.recordsets.length;
        }
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
        params.numeroPagina = _.isNil(params.numeroPagina.value) ? null : params.numeroPagina.value;
        params.linhasPagina = _.isNil(params.linhasPagina.value) ? null : params.linhasPagina.value;
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
        else if (_.isNil(o.value)) {
            if (!_.isNil(o)) {
                return o;
            }
            return null;
        } else {
            return o.value;
        }
    }

    /**
     * Executa uma instrução SQL
     * 
     * @param {Instrução sql} sql 
     */
    async query(conn, sql) {

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
        await conn.request().batch(
            `IF OBJECT_ID('tempdb..${tableName}') IS NOT NULL 
                DROP TABLE ${tableName}
            `);
    }
}