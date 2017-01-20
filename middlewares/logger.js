import R from 'ramda';

module.exports = ({ services: { logger: { create } } }) => {
  return {
    logger: createLoggerMiddleware,
  };

  function createLoggerMiddleware(label) {
    return function loggerMiddleware(handler) {
      return function (event, coeffects) {
        const id = R.pathOr(
          'N/A',
          ['request','headers','x-id'],
          coeffects
        );
        const logger = create(`${label}] [${id}`);
        return handler(
          event,
          R.assoc('logger', logger, coeffects)
        );
      };
    };
  }
};
