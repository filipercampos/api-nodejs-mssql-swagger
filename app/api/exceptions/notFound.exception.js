const DefaultErrorMessage = require("../../domain/utils/string.util");

'use strict';
/**
 * Exceção
 * @author Filipe Campos
 */
module.exports = class NotFoundException {

  constructor(message) {
    this.message = message || DefaultErrorMessage.error_exception_message_default;
  }
}