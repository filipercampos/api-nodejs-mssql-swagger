'use strict';

const mssql = require('mssql');
const MssqlFactory = require('../persistence/mssql');
const ProcedureException = require('../../api/exception/procedure.exception');
const CommonProcedure = require('../persistence/common.procedure');
const DateUtil = require('../utils/date.util');

const ConflictException = require('../../api/exception/conflict.exception');

/**
 * Business Layer 
 * 
 * Direct communication with repository layer
 * 
 * Camada de negócio: Faz a requisição e renderiza o retorno do banco de dados
 * 
 */
module.exports = class CommonBO {

    constructor(model, spGetName, keyParam) {
        this._model = model;
        this._spGet = new CommonProcedure();
        this._spGet.initialize(spGetName, keyParam);
    }

    async openConnection() {
        return await MssqlFactory;
    }

    /**
     * Get data from id
     * @param {PK from table} id 
     */
    async findById(id) {

        try {
            let conn = await MssqlFactory;
            let result = await conn.request()
                .input(this._spGet.key, mssql.Int, id)
                .execute(this._spGet.name);

            let record = typeof result.recordset[0] !== 'undefined'
                ? result.recordset[0]
                : null;

            return record !== null ? this._model.dto(record) : record;

        } catch (err) {
            throw new ProcedureException(this._spGet.name, err.message);
        }
    }

    /**
     * Get data from id
     * @param {PK from table} id 
     */
    async remove(id) {

        try {
            let conn = await MssqlFactory;
            let result = await conn.request()
                .input(this._spGet.key, mssql.Int, id)
                .execute(this._spGet.name);

            var r = this.getRowsAffected(result);

            return this.removeResponse(r);

        } catch (err) {
            throw new ProcedureException(this._spGet.name, err.message);
        }
    }

    /**
     * Get all data
     */
    async findAll() {
        let name = this._spGet.name;
        try {
            let conn = await MssqlFactory;
            let result = await conn.request()
                .execute(name);

            let results = result.recordset;
            let resultsResponse = results.map(item => {
                return this._model.dto(item)
            });

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
    async findResponse(results) {
        let resultsResponse = results.map(item => {
            return this._model.dto(item)
        });

        return this.getResponsePagination(
            results,
            resultsResponse,
            procedure.pageIndex,
            procedure.rowsPerPage
        );
    }

    /**
     * Response for Save      
     * @param {body} payload 
     */
    async saveResponse(result) {

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
    async updateResponse(result) {

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
    async patchResponse(result) {

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
    async removeResponse(result) {

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
    async deleteResponse(result) {

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
            if (typeof result === 'undefined') {
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
    getResponsePagination(results, resultsResponse, numeroPagina, linhasPagina) {

        const totalPagina = (results.length > 0 && results[0].TotalPagina)
            ? results[0].TotalPagina
            : null;

        let totalRows = null;

        if (totalPagina !== null && linhasPagina !== null) {
            totalRows = totalPagina * linhasPagina;
        }

        return {
            pageIndex: numeroPagina,
            rowsPerPage: linhasPagina,
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
    getResultPaginationProcedure(records, numeroPagina, linhasPagina) {

        let resultsResponse = records.map(item => {
            return this._model.dto(item)
        });
        let totalPages = records.length > 0 ? records[0].TotalPagina : null;
        let totalRows = null;
        if (totalPages !== null && linhasPagina !== null) {
            totalRows = totalPages * linhasPagina;
        }
        let result = {
            pageIndex: numeroPagina,
            rowsPerPage: linhasPagina,
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
        params.numeroPagina = params.numeroPagina === undefined ? null : params.numeroPagina;
        params.linhasPagina = params.linhasPagina === undefined ? null : params.linhasPagina;
    }

    /**
     * Get datetime from timespan
     * @param { Timespan } timespan 
     */
    getDate(timespan) {
        return DateUtil.getDate(timespan);
    }

    /**
     * Parametro generico da array_codigo
     * 
     * @param {Table type int} ids 
     */
    createTableParameters(ids) {
        if (ids == 'undefined' || !Array.isArray(ids)) {
            throw new ProcedureException("Tabela de parametros inválida");
        }
        let tvp = new mssql.Table();

        //estrutura da tabela genérica
        tvp.columns.add('Codigo', mssql.Int);

        ids.forEach(item => {
            tvp.rows.add(item.id);
        });
        return tvp;
    }
}