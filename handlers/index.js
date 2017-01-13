import { registerHandler } from '../services/state';
import { effects } from '../middlewares/effects';

module.exports = () => {
  registerHandler('route-index', [effects], routeIndexHandler);
  registerHandler('route-indexCombined', [effects], routeIndexCombinedHandler);
  registerHandler('route-indexCombinedResponse', [effects], routeIndexCombinedResponseHandler);
};

function routeIndexHandler({ server }) {
  return {
    httpResponse: {
      data: { server },
    },
  };
}

function routeIndexCombinedHandler({ server }) {
  return {
    httpRequest: {
      method: 'GET',
      url: server === 'server1' ? 'http://localhost:3051' : 'http://localhost:3050',
      onSuccess: { eventName: 'route-indexCombinedResponse', server },
    },
  };
}

function routeIndexCombinedResponseHandler({ server, httpData }) {
  return {
    httpResponse: {
      data: {
        server,
        other: httpData,
      },
    },
  };
}
