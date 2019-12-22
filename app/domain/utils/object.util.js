'use strict';

module.exports = class ObjectUtil {
    constructor() { }

    static isEmpty(obj) {
        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that property is correct
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        // if it ins't an object at this point
        // it is empty, but it can't be anything but empty
        // Is it empty ? Depends on your application
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }

    static removeMask(value) {
        if (typeof value === 'undefined') {
            return '';
        }
        if (typeof value !== 'string') {
            return '';
        }
        if (value === '') {
            return '';
        }

        return value.replace(/(\.|\/|\-)/g, "");
    }

    static findKeyEnum(enumName, key) {
        let result = enumName.enums.find(function (element) {
            if (element.value === key)
                return element;
        });
        return typeof result !== 'undefined' ? result.key : null;
    }

    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    
}