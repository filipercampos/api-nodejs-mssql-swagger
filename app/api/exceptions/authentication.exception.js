'use strict';
const Exception = require('./exception');

module.exports = class AutheticationException extends Exception {
    constructor(message) { 
        super();
        this.message = message;
    }
}