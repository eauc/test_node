import R from 'ramda';

let HANDLERS = {};
let INITS = [];
let STATE = {};

module.exports = ({
  middlewares: { effects: { effects, registerEffect } },
  services: { logger },
}) => {
  registerEffect('dispatch', dispatchEffect);
  registerEffect('state', stateEffect);
  registerHandler('state-init', [effects], stateInitHandler);

  return {
    registerHandler,
    registerInit,
    dispatch,
  };

  function stateEffect(state) {
    STATE = state;
    logger('info', 'new state', STATE);
  }

  function registerHandler(eventName, middlewaresOrHandler, handlerOrNull) {
    const middlewares = handlerOrNull ? middlewaresOrHandler : [R.identity];
    const handler = handlerOrNull ? handlerOrNull : middlewaresOrHandler;
    logger('info', `Registering event ${eventName} handler`);
    HANDLERS[eventName] = R.compose(...R.flatten(middlewares))(handler);
  }

  function registerInit(eventName) {
    logger('info', `Register init ${eventName}`);
    INITS = R.append(eventName, INITS);
  }

  function stateInitHandler() {
    return {
      dispatch: R.map((eventName) => ({ eventName }), INITS),
    };
  }

  function dispatch(event, coeffects = {}) {
    const { eventName } = event;
    if (!HANDLERS[eventName]) {
      const errorMessage = `Unknown event "${eventName}"`;
      errorResponse(coeffects, errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    logger('info',`Resolve event "${eventName}"`);
    return Promise
      .resolve(HANDLERS[eventName](event, R.pipe(
        R.assoc('state', STATE),
        R.over(R.lensProp('dispatch'), R.defaultTo(dispatch))
      )(coeffects)))
      .catch((error) => errorResponse(coeffects, error));
  }

  function dispatchEffect(events) {
    R.reduce(
      (previous, event) => previous.then(() => dispatch(event)),
      Promise.resolve(),
      events
    );
  }

  function errorResponse({ response }, error) {
    if (!response) {
      logger('error', 'Unhandled error', error);
      return;
    }
    response.status(500).json({ error });
  }
};
