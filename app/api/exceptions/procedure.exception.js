'use strict';
/**
 * Exceção
 * @author Filipe Campos
 */
module.exports = class ProcedureException {

  constructor(procedureName, error){ 
    this.message = {
      sp: procedureName,
      error: error
    }
  } 
}