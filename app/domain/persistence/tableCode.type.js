'use strict';

const _ = require('lodash');

/**
 * Table value parameter for Array ids
 * @author Filipe Campos
 */
module.exports = class TableCode {
  constructor() {
    this.ids = [];

  }

  setParameter(obj) {
    if (!_.isNil(obj) && _.isArray(obj.value)) {
      for (var o of obj.value) {

        if (_.isNumber(o)) {
          this.ids.push(o);
        }
      }
    }
  }
}
