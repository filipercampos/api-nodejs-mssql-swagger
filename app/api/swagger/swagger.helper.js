const fs = require('fs');
const config = require('config');
const Exception = require('../exception/exception');
const stringUtil = require('../../domain/utils/string.util');
const numberUtil = require('../../domain/utils/number.util');
const pluralize = require('pluralize');

module.exports = class SwaggerHelper {

  /**
   * Build swagger's properties response
   * 
   * @param {Resource name} resource 
   * @param {JSON response} response 
   */
  static buildResponse(resource, response) {
    const swaggerPath = __dirname + '/swagger.yaml';
    const swagger = fs.readFileSync(swaggerPath, 'utf8')
    const data = swagger.replace(/\r/g, '').split('\n');

    let resourceUpper = stringUtil.toFirstCase(resource);
    let resourcePluralUpper = pluralize.plural(stringUtil.toFirstCase(resource));

    let jsonString = JSON.stringify(response).replace('{', '').replace('}', '');
    let fields = jsonString.split(',');
    let swaggerProperties = '';
    var responseName = `${resource}Response`;

    for (let i = 0; i < data.length; i++) {
      const lineData = data[i];
      if (lineData.includes(responseName)) {
        console.warn(`Response '${responseName}  already exists`);
        return false;
      }
    }

    for (let i = 0; i < fields.length; i++) {
      let f = fields[i].split(':');
      let field = f[0].replace('\"', '').replace('\"', '');
      let value = f[1].replace('\"', '').replace('\"', '');

      var input = parseInt(value);
      var isDecimal = value.includes('.');
      var realPrecision = 2;

      if (isDecimal) {
        realPrecision = value.split('.')[1].length;
      }

      let typeSwagger = isNaN(input)
        ? 'string'
        : typeof input === 'number' && isDecimal === false
          ? numberUtil.isTimespan(value)
            ?
            `integer
        format: int64
        description: 'Valor timestamp'`
            : `integer
        format: int64`
          : `number
        description: 'Decimal (18,${realPrecision})'`;

      let fieldSwagger =
        ` ${field}:
        type: ${typeSwagger}
      `;
      swaggerProperties += fieldSwagger;
    }

    let stringData =
      `\n
  #${resourceUpper}
  get${resourcePluralUpper}Response:
    type: object
    properties:
      data:
        type: array
        items:
          $ref: '#/definitions/${responseName}'
  get${resourceUpper}Response:
    type: object
    properties:
      data:
        $ref: '#/definitions/${responseName}'
  ${responseName}:
    type: object
    properties:
      ${swaggerProperties}
  `;

    fs.appendFile(swaggerPath, stringData, function (err) {
      if (err) throw new Exception("Build response fail.\n" + err);
      console.log('Response swagger saved!');
    });

  }

  static writeFile() {
    const swagger = fs.readFileSync(__dirname + '/swagger.yaml', 'utf8')
    const data = swagger.replace(/\r/g, '').split('\n');

    let stringData = '';
    data.forEach(e => {
      if (e.includes('host: ')) {
        const host = `${config.HOST ? config.HOST : 'localhost'}:${config.SERVER.PORT}`;
        stringData += `host: '${host}' \n`;
      }
      else { stringData += e + '\n'; }
    })
    stringData = stringData.substring(0, stringData.length - 1)
    fs.writeFileSync(__dirname + '/swagger.yaml', stringData, (err) => { if (err) throw err; })
  }
}