/**
 * Utilitário de números
 * @author Filipe Campos
 */
module.exports = {
    isInt: (n) => {
        return Number(n) === n && n % 1 === 0;
    },
    isFloat: (n) => {
        return Number(n) === n && n % 1 !== 0;
    },
    isInt: (n) => {
        return Number(n) === n && n % 1 === 0;
    },
    isTimespan: (value) => {
        var input = parseInt(value);

      let result = isNaN(input)
        ? false
        : typeof input === 'number'
          ? value.length == 13
            ? true
            : false
          : false;
    return result;

    }
}