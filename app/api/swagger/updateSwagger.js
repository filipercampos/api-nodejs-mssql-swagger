const fs = require('fs');
const config = require('config');

class UpdateSwagger {
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

module.exports = UpdateSwagger;