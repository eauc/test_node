import winston from 'winston';

module.exports = ({ config: { name } }) => {
  const loggerInstance = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: 'all',
        label: name,
      }),
    ],
  });

  return logger;

  function logger(...args) {
    loggerInstance.log(...args);
  }
};
