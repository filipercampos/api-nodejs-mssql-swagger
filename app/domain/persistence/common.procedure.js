/**
 * Interface padrão de procedure SQL
 * @author Filipe Campos
 */
module.exports = class CommonProcedure {

    /**
     * Procedure common
     */
    CommonProcedure() {
        this.name = null;
        this.key = null;
        this.pageIndex = null;
        this.rowsPerPage = null;
        this.totalRows = null;
        this.totalPages = null;
        this.results = null;
    }
    initialize(procedureName, keyName) {
        this.name = procedureName;
        this.key = keyName;
    }
}

