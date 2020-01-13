/**
 * Objeto para salvar requisição em memória (cache)
 * 
 * @author Filipe Campos
 */
module.exports = class CacheMiddleware {

    Cache() {
        this.duration = null;
        this.key = null;
    }
    setCache(duration, key) {
        this.duration = duration;
        this.key = key;
    }
    buildCache(req, keyHeader, duration = 3600) {
        this.duration = duration;
        this.key = req.originalUrl || req.url;;
        const newKey = `&${keyHeader}=${req.headers[keyHeader]}`;
        this.key += newKey;
    }
    appendKey(key) {
        this.key += key;
    }
}