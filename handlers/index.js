module.exports = ({
  middlewares: { logger: { logger }, effects: { effects } },
  services: { state: { registerHandler } },
}) => {
  const middlewares = [
    logger('index'),
    effects,
  ];
  registerHandler('route-index', middlewares, routeIndexHandler);
  registerHandler('route-indexCombined', middlewares, routeIndexCombinedHandler);
  registerHandler('route-indexCombinedResponse', middlewares, routeIndexCombinedResponseHandler);
};

function routeIndexHandler({ server }, { logger }) {
  logger('info', 'routeIndexHandler');
  return {
    httpResponse: {
      data: { server },
    },
  };
}

function routeIndexCombinedHandler({ server }, { logger }) {
  logger('info', 'routeIndexCombinedHandler');
  return {
    httpRequest: {
      method: 'GET',
      url: `http://localhost:${server === 'server1' ? 3051 : 3050}`,
      onSuccess: { eventName: 'route-indexCombinedResponse', server },
    },
  };
}

function routeIndexCombinedResponseHandler({ server, httpData }, { logger }) {
  logger('info', 'routeIndexCombinedResponseHandler');
  return {
    httpResponse: {
      data: {
        server,
        other: httpData,
      },
    },
  };
}
