const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const swaggerTools = require('swagger-tools');
const swaggerUIExpress = require('swagger-ui-express');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, '../api/swagger/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    app.use('/api-docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerDoc, true)); //show explorer

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Provide the security handlers
    // app.use(middleware.swaggerSecurity({
    //     Bearer: auth.verifyToken
    // }));

    // Validate Swagger requests
    // app.use(middleware.swaggerValidator({
    //     validateResponse: false
    // }));

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter({ controllers: path.join(__dirname, '../api/controllers'), useStubs: false }));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
});

module.exports = app;