'use strict';
const moment = require('moment');

module.exports = {
    getTimestamp: (date) => {
        try {
            return new Date(date.valueOf() + date.getTimezoneOffset() * 60000).getTime();
        } catch (err) {
            return null;
        }
    },

    getDate: (timestamp) => {
        try {
            if (typeof timestamp !== 'number') {
                return null;
            }

            return new Date(timestamp);
        } catch (err) {
            return null;
        }
    },

    getDay: (timestamp) => {
        try {
            let date = new Date(timestamp);
            if ((date.getDate() + 1) < 10) {
                return `0${date.getDate()}`;
            } else {
                return date.getDate();
            }
        } catch (err) {
            return null;
        }
    },

    getMonthTextBr: (month) => {
        try {
            let result = null;
            switch (month) {
                case 1:
                    result = 'Janeiro';
                    break;
                case 2:
                    result = 'Fevereiro'
                    break;
                case 3:
                    result = 'Março';
                    break;
                case 4:
                    result = 'Abril';
                    break;
                case 5:
                    result = 'Maio';
                    break;
                case 6:
                    result = 'Junho';
                    break;
                case 7:
                    result = 'Julho';
                    break;
                case 8:
                    result = 'Agosto';
                    break;
                case 9:
                    result = 'Setembro';
                    break;
                case 10:
                    result = 'Outubro';
                    break;
                case 11:
                    result = 'Novembro';
                    break;
                case 12:
                    result = 'Dezembro';
                    break;
            }
            return result;
        } catch (err) {
            return null
        }
    },

    getMonth: (timestamp) => {
        try {
            let date = new Date(timestamp);
            if ((date.getMonth() + 1) < 10) {
                return `0${date.getMonth() + 1}`;
            } else {
                return date.getMonth() + 1;
            }
        } catch (err) {
            return null;
        }
    },

    getYear: (timestamp) => {
        try {
            let date = new Date(timestamp);
            return date.getFullYear();
        } catch (err) {
            return null;
        }
    },

    getHour: (timestamp) => {
        try {
            let date = new Date(timestamp);
            let minutes = date.getMinutes().toString();
            if (minutes.length === 1) {
                minutes += '0';
            }
            return `${date.getHours()}:${minutes}`
        } catch (err) {
            return null;
        }
    },

    /**
     * Possiveis mascaras
     * DDMMYYY,
     * YYYY-MM-DD, 
     * dd/MM/yyyyy
     * @param {Valor timespan }
     */
    dateFormat: (timestamp, mask) => {
        try {
            if (timestamp === undefined || timestamp === null) {
                return null;
            }
            if (mask != undefined && typeof mask === 'string') {
                return moment(timestamp).format(mask)
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
        } catch (err) {
            return null;
        }
    },

    /**
     * Decreptado - Use {dateFormat} moment
     * Formatar uma timespan em data
     * 
     * @param {Valor timespan} value 
     * @param {Formatos: 0 DDMMYYY, 1 YYYY-MM-DD, Padrão dd/MM/yyyyy } format 
     */
    toDateFormat(value, format) {
        var today = new Date(value);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0
        var yyyy = today.getFullYear();
        var mask = "";

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        if (format == 0) {
            mask = dd + '' + mm + '' + yyyy;
        }
        else if (format == 1) {
            mask = yyyy + '-' + mm + '-' + dd;
        } else {
            mask = dd + '/' + mm + '/' + yyyy;
        }

        return mask;

    }
}