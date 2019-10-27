'use strict'
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cert = fs.readFileSync(path.join(__dirname, './api.cert'));

class Auth {
    constructor() { }

    baseConfigSecurity() {
        const _self = this;
        return {
            Bearer: function(req, authOrSecDef, scopesOrApiKey, callback) {
                // Get auth header value
                const bearerHeader = req.headers['authorization'];
                // Check if bearer is undefined
                if(typeof bearerHeader !== 'undefined') {
                    // Split at the space
                    const bearer = bearerHeader.split(' ');
                    // Get token from array
                    const bearerToken = bearer[1];
                    // Verify token
                    jwt.verify(bearerToken, cert, function(err, authData) {
                        if(err){
                            callback(_self.sendError(req));
                        } else {
                            // Save session in request
                            req.security = authData;
                            callback();
                        }
                    });
                } else {
                    callback(_self.sendError(req));
                }
            }
        }
    }

    sign(user) {
        return new Promise(function(resolve, reject) { 
            jwt.sign({user}, cert, function(err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    sendError(req) {
        return req.res.status(403).json({ message: "Error: Access Denied" });
    }
}

module.exports = Auth;