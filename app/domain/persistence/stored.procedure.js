'use strict';

module.exports = class StoredProcedure {

    /**
     * Stored Procedure
     * @param {Procedure name} name 
     * @param {Primary key} key 
     */
    StoredProcedure() {
        this.name = null;
        this.key = null;
    }

    initialize(procedureName, keyName) {
        this.name = procedureName;
        this.key = keyName;
    }

}

