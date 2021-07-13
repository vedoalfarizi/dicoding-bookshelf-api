const Hapi = require('@hapi/hapi');

const config = require('./helpers/config');
const logger = require('./helpers/utils/logger');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: config.get('/port'),
    host: config.get('/env') !== 'production' ? config.get('/localhost') : config.get('/prodhost'),
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  logger('server', `Server running on ${server.info.uri}`, 'info');
};

init();
