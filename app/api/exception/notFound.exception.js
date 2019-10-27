const StringUtils = require("../../domain/utils/string.util");

'use strict';

class NotFoundException {
    /** Construtor */
  constructor(message){ 
    this.message = message || StringUtils.error_exception_message_default;
  } 
}

module.exports = NotFoundException;