const winston = require('winston');

const logger = winston.createLogger({
  transports: [new winston.transports.Console({
    level: 'info',
    handleExceptions: true,
    json: false,
  })],
  exitOnError: false,
});

const log = (context, message, scope) => {
  logger.info({
    context,
    message: message.toString(),
    scope,
  });
};

module.exports = log;
