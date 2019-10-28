const DefaultErrorMessage = require("../../domain/utils/string.util");

'use strict';

class ConflictException {
    /** Construtor */
  constructor(message){ 
    this.message = message || DefaultErrorMessage.error_exception_message_default;
  } 
}

module.exports = ConflictException;