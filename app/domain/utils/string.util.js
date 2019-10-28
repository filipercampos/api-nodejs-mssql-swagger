'use strict';

/**
 * String utéis do sistema
 */
module.exports.DefaultErrorMessage = {
    error_message_internal_error: "Internal Error",
    error_exception_message_default: "Something wrong",
    exception_notfound: 'Not found'
}


module.exports.toFirstCase = function (text, upper = true) {
    var words = text.split(" ");
    var w = words[0];

    if (upper)
        words[0] = w[0].toUpperCase() + w.slice(1);
    else
        words[0] = w[0].toLowerCase() + w.slice(1);

    return words.join(" ");
}
