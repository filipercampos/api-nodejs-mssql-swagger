'use strict';

module.exports = class ProcedureException {

  constructor(procedureName, error){ 
    this.message = {
      sp: procedureName,
      error: error
    }
  } 
}