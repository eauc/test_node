import R from 'ramda';

module.exports = ({ services: { logger } }) => {
  return {
    logger: createLoggerMiddleware,
  };

  function createLoggerMiddleware() {
    return function loggerMiddleware(handler) {
      return function (event, coeffects) {
        return handler(
          event,
          R.assoc('logger', logger, coeffects)
        );
      };
    };
  }
};
