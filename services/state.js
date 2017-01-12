import R from 'ramda';

module.exports = {
  registerHandler,
  dispatch,
};

let HANDLERS = {};

function registerHandler(eventName, middlewaresOrHandler, handlerOrNull) {
  const middlewares = handlerOrNull ? middlewaresOrHandler : [];
  const handler = handlerOrNull ? handlerOrNull : middlewaresOrHandler;
  console.info(`Registering event ${eventName} handler`);
  HANDLERS[eventName] = R.compose(...middlewares, handler);
}

function dispatch(event) {
  const { eventName } = event;
  if (!HANDLERS[eventName]) {
    errorResponse(event, `Unknown event "${eventName}"`);
    return;
  }
  Promise
    .resolve(HANDLERS[eventName]({}, event))
    .catch((error) => errorResponse(event, error));
}

function errorResponse(event, error) {
  const { response } = event;
  response.status(500).json({ error });
}
