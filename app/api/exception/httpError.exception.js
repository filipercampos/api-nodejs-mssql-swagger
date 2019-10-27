const StringUtil = require("../../domain/utils/string.util");

'use strict';

class HttpErrorException {
    /** Construtor */
  constructor(message){ 
    this.message = message || StringUtil.error_exception_message_default;
  } 
}

module.exports = HttpErrorException;