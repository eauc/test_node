import R from 'ramda';

let HANDLERS = {};

module.exports = ({ services: { logger } }) => {
  return {
    registerHandler,
    dispatch,
  };

  function registerHandler(eventName, middlewaresOrHandler, handlerOrNull) {
    const middlewares = handlerOrNull ? middlewaresOrHandler : [R.identity];
    const handler = handlerOrNull ? handlerOrNull : middlewaresOrHandler;
    logger('info', `Registering event ${eventName} handler`);
    HANDLERS[eventName] = R.compose(...R.flatten(middlewares))(handler);
  }

  function dispatch(event, coeffects = {}) {
    const { eventName } = event;
    if (!HANDLERS[eventName]) {
      errorResponse(coeffects, `Unknown event "${eventName}"`);
      return;
    }
    logger('info',`Resolve event "${eventName}"`);
    coeffects.dispatch = coeffects.dispatch || dispatch;
    Promise
      .resolve(HANDLERS[eventName](event, coeffects))
      .catch((error) => errorResponse(coeffects, error));
  }

  function errorResponse({ response }, error) {
    if (!response) {
      logger('error', 'Unhandled error', error);
      return;
    }
    response.status(500).json({ error });
  }
};
