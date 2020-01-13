'use strict';
/**
 * Object Util
 * @author Filipe Campos
 */
exports.findKeyEnum = function (enumName, key) {
    let result = enumName.enums.find(function (element) {
        if (element.value === key)
            return element;
    });
    return typeof result !== 'undefined' ? result.key : null;
};

