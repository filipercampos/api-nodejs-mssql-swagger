'use strict';

class TableCode {
  constructor() {
    this.ids = [];

  }

  setParameter(obj) {
    if (typeof obj.ids !== 'undefined' && Array.isArray(obj.ids.value)) {
      for (var item of obj.ids.value) {
        let element = new ItemId(item);
        if (element.id != null) {
          this.ids.push(element);
        }
      }
    }
  }

}

class ItemId {
  constructor(obj) {
    if (typeof obj !== 'undefined' && typeof obj === 'number') {
      this.id = obj;
    }else{
      this.id = null;
    }
  }
}


module.exports = TableCode;