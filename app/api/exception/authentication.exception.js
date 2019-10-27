'use strict';
const Exception = require('./exception');

class AutheticationException extends Exception {
    constructor(message) { 
        super();
        this.message = message;
    }
}

module.exports = AutheticationException;