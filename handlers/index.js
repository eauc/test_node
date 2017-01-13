import { registerHandler } from '../services/state';
import { effects } from '../middlewares/effects';

module.exports = () => {
  registerHandler('route-index', [effects], routeIndexHandler);
  registerHandler('route-indexWithOtherServer', [effects], routeIndexWithOtherServerHandler);
};

function routeIndexHandler(_state_, event) {
  const { server } = event;
  if ('server1' === server) {
    return {
      httpRequest: {
        method: 'GET',
        url: 'http://localhost:3051',
        onSuccess: { eventName: 'route-indexWithOtherServer', server },
      },
    };
  }
  return {
    httpResponse: {
      data: { server },
    },
  };
}

function routeIndexWithOtherServerHandler(_state_, { server, httpData }) {
  console.log('route2', server, httpData);
  return {
    httpResponse: {
      data: {
        server,
        other: httpData,
      },
    },
  };
}
