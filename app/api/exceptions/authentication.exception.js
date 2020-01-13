'use strict';
const Exception = require('./exception');

/**
 * Exceção
 * @author Filipe Campos
 */
module.exports = class AutheticationException extends Exception {
    constructor(message) { 
        super();
        this.message = message;
    }
}