const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const swaggerThemes = require('swagger-theme-changer');
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cloud Computing APIs',
      version: '1.0.0',
      description: 'This is a documentation of my REST API',
      contact: {
        name: 'Epi Alert',
        url: 'https://github.com/epialert',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server.js', './routes/*.js'],
};

const specs = swaggerJsdoc(options);
// const theme = swaggerThemes.getTheme('dracula');

const optionstheme = {
  // customCss: theme,
  customJs: [
    'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
  ],
  customCssUrl: [
    '/assets/css/swagger-light.css',
  ],
};

module.exports = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, optionstheme));
};
