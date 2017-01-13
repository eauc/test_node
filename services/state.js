import R from 'ramda';

module.exports = {
  registerHandler,
  dispatch,
};

let HANDLERS = {};

function registerHandler(eventName, middlewaresOrHandler, handlerOrNull) {
  const middlewares = handlerOrNull ? middlewaresOrHandler : [R.identity];
  const handler = handlerOrNull ? handlerOrNull : middlewaresOrHandler;
  console.info(`Registering event ${eventName} handler`);
  HANDLERS[eventName] = R.compose(...R.flatten(middlewares))(handler);
}

function dispatch(event, coeffects = {}) {
  const { eventName } = event;
  if (!HANDLERS[eventName]) {
    errorResponse(coeffects, `Unknown event "${eventName}"`);
    return;
  }
  console.log(`Resolve event "${eventName}"`);
	coeffects.dispatch = coeffects.dispatch || dispatch;
  Promise
    .resolve(HANDLERS[eventName](event, coeffects))
    .catch((error) => errorResponse(coeffects, error));
}

function errorResponse({ response }, error) {
	if (!response) {
		console.error('Unhandled error', error);
		return;
	}
  response.status(500).json({ error });
}
